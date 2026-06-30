import os
import httpx

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5000")
INTERNAL_API_KEY = os.getenv("INTERNAL_API_KEY", "dev-internal-key-change-in-production")

HEADERS = {
    "Content-Type": "application/json",
    "x-internal-key": INTERNAL_API_KEY,
}


async def notify_case_started(case_id: str, participating_agents: list[str]):
    async with httpx.AsyncClient() as client:
        await client.post(
            f"{BACKEND_URL}/api/internal/case/started",
            json={"caseId": case_id, "participatingAgents": participating_agents},
            headers=HEADERS,
            timeout=30,
        )


async def notify_agent_speaking(case_id: str, agent_id: str, agent_name: str, phase: str):
    async with httpx.AsyncClient() as client:
        await client.post(
            f"{BACKEND_URL}/api/internal/case/agent-speaking",
            json={"caseId": case_id, "agentId": agent_id, "agentName": agent_name, "phase": phase},
            headers=HEADERS,
            timeout=30,
        )


async def notify_round_complete(
    case_id: str,
    round_number: int,
    phase: str,
    messages: list[dict],
    verified_evidence: dict | None = None,
):
    payload = {
        "caseId": case_id,
        "roundNumber": round_number,
        "phase": phase,
        "messages": messages,
    }
    if verified_evidence:
        payload["verifiedEvidence"] = verified_evidence

    async with httpx.AsyncClient() as client:
        await client.post(
            f"{BACKEND_URL}/api/internal/case/round-complete",
            json=payload,
            headers=HEADERS,
            timeout=30,
        )


async def notify_verdict_ready(case_id: str, verdict: dict, summary: str, agent_updates: list[dict]):
    async with httpx.AsyncClient() as client:
        await client.post(
            f"{BACKEND_URL}/api/internal/case/verdict-ready",
            json={
                "caseId": case_id,
                "verdict": verdict,
                "summary": summary,
                "agentUpdates": agent_updates,
            },
            headers=HEADERS,
            timeout=30,
        )
