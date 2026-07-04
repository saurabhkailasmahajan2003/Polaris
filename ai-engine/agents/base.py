"""Base agent class and shared utilities."""

import json
import os
from abc import ABC, abstractmethod
from typing import Any

import openai

MODEL = os.getenv("MODEL", "gpt-4o-mini")
openai.api_key = os.getenv("OPENAI_API_KEY", "")

BASE_RULES = """
CRITICAL RULES — YOU MUST FOLLOW:
- No political allegiance, partisan bias, or personal agenda
- Loyalty only to evidence and your domain expertise
- Return ONLY valid JSON — no markdown, no free text outside JSON
- Reference specific evidence from the verified evidence package
- Confidence score must reflect genuine uncertainty (0-100)
- Never fabricate facts or citations
"""


def parse_json_response(text: str) -> dict:
    text = text.strip()
    if text.startswith("```"):
        lines = text.split("\n")
        text = "\n".join(lines[1:-1] if lines[-1].strip() == "```" else lines[1:])
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        start = text.find("{")
        end = text.rfind("}") + 1
        if start >= 0 and end > start:
            return json.loads(text[start:end])
        raise


class BaseAgent(ABC):
    agent_id: str = ""
    name: str = ""
    role: str = ""
    expertise: list[str] = []
    personality: str = ""
    reasoning_style: str = ""

    @abstractmethod
    def system_prompt(self) -> str:
        pass

    @abstractmethod
    def output_schema_description(self) -> str:
        pass

    def build_system_prompt(self) -> str:
        return f"""You are {self.name}, the {self.role} in Polaris — a digital civilization of expert AI agents.

EXPERTISE: {', '.join(self.expertise)}
PERSONALITY: {self.personality}
REASONING STYLE: {self.reasoning_style}

{self.system_prompt()}

{BASE_RULES}

OUTPUT FORMAT (JSON only):
{self.output_schema_description()}
"""

    async def invoke(self, user_message: str, temperature: float = 0.3) -> dict[str, Any]:
        if not os.getenv("OPENAI_API_KEY"):
            return self._mock_response(user_message)

        response = openai.ChatCompletion.create(
            model=MODEL,
            temperature=temperature,
            messages=[
                {"role": "system", "content": self.build_system_prompt()},
                {"role": "user", "content": user_message},
            ],
        )
        text = response["choices"][0]["message"]["content"]
        return parse_json_response(text)

    def _mock_response(self, user_message: str) -> dict[str, Any]:
        """Fallback when no API key — enables local dev without Claude."""
        return {
            "position": f"{self.name} analysis pending API key",
            "reasoning": "Configure OPENAI_API_KEY for live analysis.",
            "one_line_reasoning": f"{self.name} position on case",
            "risk_level": "medium",
            "confidence": 65,
            "evidence_references": ["evidence_package"],
            "fact_check_flags": [],
        }
