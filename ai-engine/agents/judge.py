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
Weigh all agent positions impartially. Output consequence projections for 6 months, 1 year, and 2 years.

CRITICAL — plain_comparison (for the public):
- Write for someone who may not read hard English. Use short, everyday words only.
- No jargon, no legal Latin, no academic phrases. Prefer words a 12-year-old knows.
- Build a clear table of the BEST points: what has happened / is happening in the REAL WORLD
  so far versus what the AI WORLD (Polaris) decided or recommends.
- 3 to 5 rows max. Each cell: one short sentence.
- Also provide translations of plain_comparison into Hindi (hi) and Spanish (es) with the same simple style.
"""

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
  ],
  "plain_comparison": {
    "bottom_line": "one very simple sentence: what Polaris decided and why it matters",
    "rows": [
      {
        "topic": "short label e.g. Main action",
        "real_world": "what people/gov/companies did so far in real life — simple words",
        "ai_world": "what Polaris / the AI city decided — simple words"
      }
    ],
    "translations": {
      "hi": {
        "bottom_line": "सरल हिंदी में",
        "rows": [{"topic": "", "real_world": "", "ai_world": ""}]
      },
      "es": {
        "bottom_line": "en español sencillo",
        "rows": [{"topic": "", "real_world": "", "ai_world": ""}]
      }
    }
  }
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
            "plain_comparison": {
                "bottom_line": "Polaris says yes, but only if clear rules and checks stay in place.",
                "rows": [
                    {
                        "topic": "Main action",
                        "real_world": "Leaders started the plan or talked about it in public.",
                        "ai_world": "AI world says: go ahead, but follow the rules.",
                    },
                    {
                        "topic": "People's safety",
                        "real_world": "Some people worry about harm or unfair treatment.",
                        "ai_world": "AI world asks for strong protection for ordinary people.",
                    },
                    {
                        "topic": "Money and jobs",
                        "real_world": "Markets and jobs may shift because of this.",
                        "ai_world": "AI world wants careful money checks and fair help for workers.",
                    },
                    {
                        "topic": "Next step",
                        "real_world": "Real world is still moving, with mixed results so far.",
                        "ai_world": "AI world will watch results and can change advice later.",
                    },
                ],
                "translations": {
                    "hi": {
                        "bottom_line": "पोलारिस कहता है हाँ, लेकिन साफ नियम और जाँच होनी चाहिए।",
                        "rows": [
                            {
                                "topic": "मुख्य कदम",
                                "real_world": "नेताओं ने योजना शुरू की या सार्वजनिक रूप से बात की।",
                                "ai_world": "एआई दुनिया कहती है: आगे बढ़ो, पर नियमों का पालन करो।",
                            },
                            {
                                "topic": "लोगों की सुरक्षा",
                                "real_world": "कुछ लोग नुकसान या अन्याय से डरते हैं।",
                                "ai_world": "एआई दुनिया आम लोगों की मज़बूत सुरक्षा चाहती है।",
                            },
                            {
                                "topic": "पैसा और नौकरी",
                                "real_world": "इससे बाज़ार और नौकरियाँ बदल सकती हैं।",
                                "ai_world": "एआई दुनिया पैसे की सावधानी और मज़दूरों की मदद चाहती है।",
                            },
                            {
                                "topic": "अगला कदम",
                                "real_world": "असल दुनिया अभी चल रही है, नतीजे मिले-जुले हैं।",
                                "ai_world": "एआई दुनिया नतीजे देखेगी और बाद में सलाह बदल सकती है।",
                            },
                        ],
                    },
                    "es": {
                        "bottom_line": "Polaris dice sí, pero solo con reglas claras y control.",
                        "rows": [
                            {
                                "topic": "Acción principal",
                                "real_world": "Los líderes empezaron el plan o hablaron de él en público.",
                                "ai_world": "El mundo IA dice: adelante, pero sigan las reglas.",
                            },
                            {
                                "topic": "Seguridad de la gente",
                                "real_world": "Algunas personas temen daño o trato injusto.",
                                "ai_world": "El mundo IA pide fuerte protección para la gente común.",
                            },
                            {
                                "topic": "Dinero y empleos",
                                "real_world": "Los mercados y empleos pueden cambiar por esto.",
                                "ai_world": "El mundo IA quiere control del dinero y ayuda justa a trabajadores.",
                            },
                            {
                                "topic": "Siguiente paso",
                                "real_world": "El mundo real sigue avanzando, con resultados mixtos.",
                                "ai_world": "El mundo IA vigilará resultados y puede cambiar el consejo.",
                            },
                        ],
                    },
                },
            },
        }
