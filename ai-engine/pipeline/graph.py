"""LangGraph pipeline for Polaris case processing."""

import json
from typing import TypedDict

from langgraph.graph import StateGraph, END

from agents import get_agent, DISCUSSION_AGENTS
from agents.discussion_agents import DiscussionAgent
from memory.store import get_agent_memory, store_agent_memory
from pipeline.backend_client import (
    notify_case_started,
    notify_agent_speaking,
    notify_round_complete,
    notify_verdict_ready,
)


class PipelineState(TypedDict):
    case_id: str
    title: str
    description: str
    source: str
    category: str
    participating_agents: list[str]
    verified_evidence: dict
    rounds: dict
    verdict: dict
    round_counter: int


def get_discussion_agents(participating: list[str]) -> list[str]:
    return [a for a in DISCUSSION_AGENTS if a in participating]


def format_message(agent_id: str, output: dict, phase: str) -> dict:
    agent = get_agent(agent_id)
    return {
        "agentId": agent_id,
        "agentName": agent.name if agent else agent_id,
        "position": output.get("position", output.get("evidence_package", {}).get("summary", "")),
        "reasoning": output.get("reasoning", json.dumps(output.get("verified_evidence", output.get("evidence_package", {})))),
        "oneLineReasoning": output.get("one_line_reasoning", ""),
        "riskLevel": output.get("risk_level", "medium"),
        "confidence": output.get("confidence", 50),
        "viewChanged": output.get("view_changed", False),
        "changeReason": output.get("change_reason", ""),
        "factCheckFlags": output.get("fact_check_flags", []),
        "evidenceReferences": output.get("evidence_references", []),
        "rawOutput": output,
    }


async def pre_discussion(state: PipelineState) -> PipelineState:
    case_id = state["case_id"]
    await notify_case_started(case_id, state["participating_agents"])

    # Investigator
    inv = get_agent("investigator")
    await notify_agent_speaking(case_id, "investigator", "Investigator", "pre_discussion")
    inv_output = await inv.invoke(json.dumps({
        "title": state["title"],
        "description": state["description"],
        "source": state["source"],
        "category": state["category"],
    }))

    inv_msg = format_message("investigator", inv_output, "pre_discussion")
    await notify_round_complete(case_id, 0, "pre_discussion", [inv_msg])

    # Fact Checker
    fc = get_agent("fact_checker")
    await notify_agent_speaking(case_id, "fact_checker", "Fact Checker", "pre_discussion")
    fc_output = await fc.invoke(json.dumps({
        "evidence_package": inv_output.get("evidence_package", {}),
        "case": {"title": state["title"], "description": state["description"], "source": state["source"]},
    }))

    verified = fc_output.get("verified_evidence", {})
    fc_msg = format_message("fact_checker", fc_output, "pre_discussion")
    await notify_round_complete(case_id, 0, "pre_discussion", [inv_msg, fc_msg], verified_evidence=verified)

    state["verified_evidence"] = verified
    state["rounds"] = {"pre_discussion": [inv_msg, fc_msg]}
    state["round_counter"] = 0
    return state


async def run_discussion_round(state: PipelineState, round_num: int, phase: str, include_prior: bool = False) -> PipelineState:
    case_id = state["case_id"]
    agents = get_discussion_agents(state["participating_agents"])
    messages = []
    prior_rounds = state.get("rounds", {})

    for agent_id in agents:
        agent = get_agent(agent_id)
        if not agent:
            continue

        memory = get_agent_memory(agent_id, state["category"])
        await notify_agent_speaking(case_id, agent_id, agent.name, phase)

        prompt_data = {
            "case": {
                "title": state["title"],
                "description": state["description"],
                "source": state["source"],
                "category": state["category"],
            },
            "verified_evidence": state["verified_evidence"],
            "round": round_num,
            "phase": phase,
            "past_memory": memory,
        }

        if include_prior:
            prompt_data["prior_discussion"] = {
                k: v for k, v in prior_rounds.items() if k.startswith("round")
            }

        output = await agent.invoke(json.dumps(prompt_data))
        msg = format_message(agent_id, output, phase)
        messages.append(msg)

    state["rounds"][phase] = messages
    state["round_counter"] = round_num
    await notify_round_complete(case_id, round_num, phase, messages)
    return state


async def round1(state: PipelineState) -> PipelineState:
    return await run_discussion_round(state, 1, "round1", include_prior=False)


async def round2(state: PipelineState) -> PipelineState:
    return await run_discussion_round(state, 2, "round2", include_prior=True)


async def round3(state: PipelineState) -> PipelineState:
    return await run_discussion_round(state, 3, "round3", include_prior=True)


async def round4(state: PipelineState) -> PipelineState:
    return await run_discussion_round(state, 4, "round4", include_prior=True)


async def verdict(state: PipelineState) -> PipelineState:
    case_id = state["case_id"]
    judge = get_agent("judge")
    await notify_agent_speaking(case_id, "judge", "Judge", "verdict")

    judge_input = {
        "case": {
            "title": state["title"],
            "description": state["description"],
            "category": state["category"],
        },
        "verified_evidence": state["verified_evidence"],
        "all_rounds": state["rounds"],
    }

    verdict_output = await judge.invoke(json.dumps(judge_input))
    state["verdict"] = verdict_output

    verdict_payload = {
        "decision": verdict_output.get("decision", "delayed"),
        "statement": verdict_output.get("statement", ""),
        "justification": verdict_output.get("justification", ""),
        "confidence": verdict_output.get("confidence", 50),
        "consequences": [
            {
                "timeframe": c.get("timeframe", "6_months"),
                "socialImpact": c.get("social_impact", ""),
                "economicEffect": c.get("economic_effect", ""),
                "institutionalIntegrity": c.get("institutional_integrity", ""),
                "longTermStability": c.get("long_term_stability", ""),
            }
            for c in verdict_output.get("consequences", [])
        ],
        "agentPositions": [
            {
                "agentId": p.get("agent_id", ""),
                "agentName": p.get("agent_name", ""),
                "finalPosition": p.get("final_position", ""),
                "confidence": p.get("confidence", 50),
            }
            for p in verdict_output.get("agent_positions", [])
        ],
        "keyDebateMoments": verdict_output.get("key_debate_moments", []),
    }

    # Build agent updates from round 4
    agent_updates = []
    round4_msgs = state["rounds"].get("round4", [])
    for msg in round4_msgs:
        agent_updates.append({
            "agentId": msg["agentId"],
            "position": msg["position"],
            "confidence": msg["confidence"],
        })
        store_agent_memory(
            msg["agentId"], case_id, state["category"],
            msg["position"], verdict_payload["decision"], msg["confidence"],
        )

    summary = verdict_output.get("statement", "")
    await notify_verdict_ready(case_id, verdict_payload, summary, agent_updates)
    return state


def build_graph():
    graph = StateGraph(PipelineState)

    graph.add_node("pre_discussion", pre_discussion)
    graph.add_node("round1", round1)
    graph.add_node("round2", round2)
    graph.add_node("round3", round3)
    graph.add_node("round4", round4)
    graph.add_node("verdict", verdict)

    graph.set_entry_point("pre_discussion")
    graph.add_edge("pre_discussion", "round1")
    graph.add_edge("round1", "round2")
    graph.add_edge("round2", "round3")
    graph.add_edge("round3", "round4")
    graph.add_edge("round4", "verdict")
    graph.add_edge("verdict", END)

    return graph.compile()


async def run_pipeline(case_data: dict) -> dict:
    initial_state: PipelineState = {
        "case_id": case_data["caseId"],
        "title": case_data["title"],
        "description": case_data["description"],
        "source": case_data["source"],
        "category": case_data["category"],
        "participating_agents": case_data.get("participatingAgents", []),
        "verified_evidence": {},
        "rounds": {},
        "verdict": {},
        "round_counter": 0,
    }

    graph = build_graph()
    result = await graph.ainvoke(initial_state)
    return {
        "caseId": result["case_id"],
        "status": "completed",
        "verdict": result.get("verdict", {}),
        "rounds": result.get("rounds", {}),
    }
