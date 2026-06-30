"""Agent memory via MongoDB — stores and retrieves past positions."""

import os
from datetime import datetime

from pymongo import MongoClient

_client = None


def get_db():
    global _client
    if _client is None:
        uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/aiworld")
        _client = MongoClient(uri)
    return _client.get_default_database()


def get_agent_memory(agent_id: str, case_category: str, limit: int = 5) -> list[dict]:
    """Retrieve relevant past case positions for an agent."""
    try:
        db = get_db()
        memories = list(
            db.agentmemories.find(
                {"agentId": agent_id, "category": case_category},
                {"_id": 0},
            )
            .sort("createdAt", -1)
            .limit(limit)
        )
        return memories
    except Exception:
        return []


def store_agent_memory(agent_id: str, case_id: str, category: str, position: str, outcome: str, confidence: int):
    """Store agent position for future retrieval."""
    try:
        db = get_db()
        db.agentmemories.insert_one({
            "agentId": agent_id,
            "caseId": case_id,
            "category": category,
            "position": position,
            "outcome": outcome,
            "confidence": confidence,
            "createdAt": datetime.utcnow(),
        })
        # Ensure index exists
        db.agentmemories.create_index([("agentId", 1), ("category", 1), ("createdAt", -1)])
    except Exception as e:
        print(f"Memory store error: {e}")
