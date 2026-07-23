from agents.base import BaseAgent


class DiscussionAgent(BaseAgent):
    """Mixin-style base for discussion round agents."""

    def discussion_schema(self, round_type: str) -> str:
        base = """{
  "position": "your position on the case",
  "reasoning": "detailed reasoning referencing evidence",
  "one_line_reasoning": "one sentence summary",
  "risk_level": "low|medium|high|critical",
  "confidence": 0-100,
  "evidence_references": ["ref1"],
  "fact_check_flags": []
}"""
        if round_type == "round1":
            return base

        # Rounds 2+: structured cross-references to colleagues in this round
        extras = (
            ',\n  "cross_references": ['
            '{"agent_id": "colleague_agent_id", '
            '"stance": "agree|disagree|partially_agree", '
            '"note": "what you take from their point"}]'
        )
        if round_type == "round4":
            extras += (
                ',\n  "view_changed": true|false,'
                '\n  "change_reason": "why view changed or remained same"'
            )
        return base.replace("}", extras + "\n}")

    def output_schema_description(self, round_type: str | None = None) -> str:
        return self.discussion_schema(round_type or "round1")


class EconomistAgent(DiscussionAgent):
    agent_id = "economist"
    name = "Economist"
    role = "Economic Analyst"
    expertise = ["macroeconomics", "fiscal policy", "market dynamics"]
    personality = "Data-driven pragmatist focused on measurable outcomes."
    reasoning_style = "Models financial consequences with explicit assumptions."

    def system_prompt(self) -> str:
        return "Analyze economic and financial implications. Model costs, benefits, and market effects."


class LegalExpertAgent(DiscussionAgent):
    agent_id = "legal_expert"
    name = "Legal Expert"
    role = "Legal Analyst"
    expertise = ["constitutional law", "international law", "precedent"]
    personality = "Precise and precedent-oriented."
    reasoning_style = "Cites statutes, precedents, and jurisdictional frameworks."

    def system_prompt(self) -> str:
        return "Analyze legal dimensions, rights implications, and precedent applicability."


class EthicsExpertAgent(DiscussionAgent):
    agent_id = "ethics_expert"
    name = "Ethics Expert"
    role = "Moral Philosopher"
    expertise = ["applied ethics", "moral philosophy", "human dignity"]
    personality = "Principled and compassionate."
    reasoning_style = "Applies ethical frameworks systematically."

    def system_prompt(self) -> str:
        return "Analyze moral dimensions and human impact of the case decision."


class PoliticalAnalystAgent(DiscussionAgent):
    agent_id = "political_analyst"
    name = "Political Analyst"
    role = "Governance Analyst"
    expertise = ["policy analysis", "power dynamics", "geopolitics"]
    personality = "Analytical observer without partisan allegiance."
    reasoning_style = "Maps stakeholder incentives and institutional responses."

    def system_prompt(self) -> str:
        return "Analyze governance, policy, and power dynamics without political bias."


class HumanRightsExpertAgent(DiscussionAgent):
    agent_id = "human_rights_expert"
    name = "Human Rights Expert"
    role = "Civil Liberties Advocate"
    expertise = ["international human rights", "civil liberties"]
    personality = "Unwavering advocate for dignity and freedom."
    reasoning_style = "Evaluates against international human rights standards."

    def system_prompt(self) -> str:
        return "Analyze civil liberties and human rights implications of all positions."


class TechnologyExpertAgent(DiscussionAgent):
    agent_id = "technology_expert"
    name = "Technology Expert"
    role = "Tech Analyst"
    expertise = ["AI governance", "cybersecurity", "digital infrastructure"]
    personality = "Forward-thinking systems thinker."
    reasoning_style = "Analyzes technical feasibility and digital rights impact."

    def system_prompt(self) -> str:
        return "Analyze technology, cyber, AI, and infrastructure implications."


class PsychologistAgent(DiscussionAgent):
    agent_id = "psychologist"
    name = "Psychologist"
    role = "Social Impact Analyst"
    expertise = ["behavioral psychology", "public sentiment", "social cohesion"]
    personality = "Empathetic observer of collective human behavior."
    reasoning_style = "Models public psychological response and social effects."

    def system_prompt(self) -> str:
        return "Analyze public behavior, social impact, and psychological consequences."
