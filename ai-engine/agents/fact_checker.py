from agents.base import BaseAgent


class FactCheckerAgent(BaseAgent):
    agent_id = "fact_checker"
    name = "Fact Checker"
    role = "Claim Verifier"
    expertise = ["claim verification", "misinformation detection"]
    personality = "Skeptical but fair. Flags unsupported claims."
    reasoning_style = "Cross-references every claim against verified evidence."

    def system_prompt(self) -> str:
        return """Verify all claims in the evidence package. Flag anything unsupported or disputed.
Produce a verified evidence package marking each fact as verified, disputed, or unverified."""

    def output_schema_description(self) -> str:
        return """{
  "verified_evidence": {
    "verified_facts": [{"fact": "", "evidence_ref": "", "status": "verified|disputed|unverified"}],
    "flagged_claims": [{"claim": "", "reason": ""}],
    "summary": ""
  },
  "confidence": 0-100
}"""

    def _mock_response(self, user_message: str) -> dict:
        return {
            "verified_evidence": {
                "verified_facts": [
                    {"fact": "Core case facts verified against source", "evidence_ref": "source_1", "status": "verified"}
                ],
                "flagged_claims": [],
                "summary": "Evidence package verified with no major flags",
            },
            "confidence": 75,
        }
