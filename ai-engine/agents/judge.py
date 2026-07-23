from agents.base import BaseAgent


class JudgeAgent(BaseAgent):
    agent_id = "judge"
    name = "Judge"
    role = "Final Arbiter"
    expertise = ["synthesis", "deliberation", "consequence modeling"]
    personality = "Silent during discussion. Impartial. Judicial rigor."
    reasoning_style = "Synthesizes all evidence into final verdict."

    def system_prompt(self) -> str:
        return """You are the Judge. You receive verified evidence and all 4 rounds of agent discussion.
Deliver the final verdict with full justification. You NEVER participated in discussion rounds.
Weigh all agent positions impartially. Output consequence projections for 6 months, 1 year, and 2 years."""

    def output_schema_description(self, round_type: str | None = None) -> str:
        return """{
  "decision": "approved|rejected|approved_with_conditions|delayed",
  "statement": "one clear verdict statement",
  "justification": "full judicial justification",
  "confidence": 0-100,
  "agent_positions": [{"agent_id": "", "agent_name": "", "final_position": "", "confidence": 0}],
  "key_debate_moments": ["moment1"],
  "consequences": [
    {
      "timeframe": "6_months|1_year|2_years",
      "social_impact": "",
      "economic_effect": "",
      "institutional_integrity": "",
      "long_term_stability": ""
    }
  ]
}"""

    def _mock_response(self, user_message: str) -> dict:
        return {
            "decision": "approved_with_conditions",
            "statement": "The proposed action is approved with strict oversight conditions.",
            "justification": "Based on verified evidence and expert deliberation, approval with conditions balances stakeholder interests while mitigating identified risks.",
            "confidence": 72,
            "agent_positions": [],
            "key_debate_moments": ["Economist and Ethics Expert reached consensus on conditional approval"],
            "consequences": [
                {
                    "timeframe": "6_months",
                    "social_impact": "Moderate public adjustment period",
                    "economic_effect": "Short-term market stabilization",
                    "institutional_integrity": "Enhanced oversight mechanisms established",
                    "long_term_stability": "Foundation for sustainable policy",
                },
                {
                    "timeframe": "1_year",
                    "social_impact": "Public trust gradually restored",
                    "economic_effect": "Measurable economic benefits emerge",
                    "institutional_integrity": "Institutions demonstrate accountability",
                    "long_term_stability": "Policy framework proves adaptable",
                },
                {
                    "timeframe": "2_years",
                    "social_impact": "Societal norms align with new standards",
                    "economic_effect": "Long-term economic gains realized",
                    "institutional_integrity": "Systemic integrity strengthened",
                    "long_term_stability": "Sustainable equilibrium achieved",
                },
            ],
        }
