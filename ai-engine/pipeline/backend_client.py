import os
import httpx

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5000").rstrip("/")
INTERNAL_API_KEY = os.getenv("INTERNAL_API_KEY", "dev-internal-key-change-in-production")

HEADERS = {
    "Content-Type": "application/json",
    "x-internal-key": INTERNAL_API_KEY,
}


async def _post(path: str, payload: dict):
    """Best-effort notify — never crash the pipeline on callback failures."""
    url = f"{BACKEND_URL}{path}"
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            res = await client.post(url, json=payload, headers=HEADERS)
            if res.status_code >= 400:
                print(f"Backend notify warning {res.status_code} {path}: {res.text[:200]}")
            return res
    except Exception as exc:
        print(f"Backend notify failed {path}: {exc}")
        return None


async def notify_case_started(case_id: str, participating_agents: list[str]):
    await _post(
        "/api/internal/case/started",
        {"caseId": case_id, "participatingAgents": participating_agents},
    )


async def notify_agent_speaking(case_id: str, agent_id: str, agent_name: str, phase: str):
    await _post(
        "/api/internal/case/agent-speaking",
        {"caseId": case_id, "agentId": agent_id, "agentName": agent_name, "phase": phase},
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
    await _post("/api/internal/case/round-complete", payload)


async def notify_verdict_ready(case_id: str, verdict: dict, summary: str, agent_updates: list[dict]):
    await _post(
        "/api/internal/case/verdict-ready",
        {
            "caseId": case_id,
            "verdict": verdict,
            "summary": summary,
            "agentUpdates": agent_updates,
        },
    )
