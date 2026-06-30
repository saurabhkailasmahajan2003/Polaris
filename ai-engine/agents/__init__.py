from agents.investigator import InvestigatorAgent
from agents.fact_checker import FactCheckerAgent
from agents.discussion_agents import (
    EconomistAgent,
    LegalExpertAgent,
    EthicsExpertAgent,
    PoliticalAnalystAgent,
    HumanRightsExpertAgent,
    TechnologyExpertAgent,
    PsychologistAgent,
)
from agents.judge import JudgeAgent

AGENT_REGISTRY = {
    "investigator": InvestigatorAgent(),
    "fact_checker": FactCheckerAgent(),
    "economist": EconomistAgent(),
    "legal_expert": LegalExpertAgent(),
    "ethics_expert": EthicsExpertAgent(),
    "political_analyst": PoliticalAnalystAgent(),
    "human_rights_expert": HumanRightsExpertAgent(),
    "technology_expert": TechnologyExpertAgent(),
    "psychologist": PsychologistAgent(),
    "judge": JudgeAgent(),
}

DISCUSSION_AGENTS = [
    "economist",
    "legal_expert",
    "ethics_expert",
    "political_analyst",
    "human_rights_expert",
    "technology_expert",
    "psychologist",
]


def get_agent(agent_id: str):
    return AGENT_REGISTRY.get(agent_id)
