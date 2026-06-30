from agents.base import BaseAgent


class InvestigatorAgent(BaseAgent):
    agent_id = "investigator"
    name = "Investigator"
    role = "Evidence Builder"
    expertise = ["fact gathering", "source verification", "timeline construction"]
    personality = "Methodical, thorough, and relentlessly curious."
    reasoning_style = "Builds structured evidence packages from primary sources."

    def system_prompt(self) -> str:
        return """Your role is PRE-DISCUSSION evidence gathering. Structure all available facts about the case.
Build a comprehensive evidence package with: key facts, timeline, sources, and open questions.
Do not form opinions — only gather and structure evidence."""

    def output_schema_description(self) -> str:
        return """{
  "evidence_package": {
    "key_facts": ["fact1", "fact2"],
    "timeline": [{"date": "YYYY-MM-DD", "event": "description"}],
    "sources": [{"name": "source", "credibility": "high|medium|low", "url": ""}],
    "open_questions": ["question1"],
    "summary": "brief evidence summary"
  },
  "confidence": 0-100
}"""

    def _mock_response(self, user_message: str) -> dict:
        return {
            "evidence_package": {
                "key_facts": ["Case facts gathered from provided description and source"],
                "timeline": [{"date": "2026-01-01", "event": "Event occurred per source"}],
                "sources": [{"name": "Provided source", "credibility": "medium", "url": ""}],
                "open_questions": ["Additional verification needed on key claims"],
                "summary": "Initial evidence package structured from case data",
            },
            "confidence": 70,
        }
