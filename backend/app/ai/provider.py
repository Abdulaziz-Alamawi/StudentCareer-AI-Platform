"""Pluggable AI provider interface.

The default `HeuristicProvider` uses the local scikit-learn/heuristic engine and
makes no external calls. An `OpenAIProvider` can be added later to evaluate
free-text answers or generate suggestions with an LLM — services depend only on
the `AIProvider` protocol, so swapping providers requires no service changes.
"""
from __future__ import annotations

from typing import Protocol

from app.ai import interview_evaluator, resume_analyzer
from app.core.config import settings


class AIProvider(Protocol):
    def analyze_resume(self, content: dict, target_track: str) -> dict: ...
    def evaluate_answer(self, answer: str, keywords: list[str]) -> tuple[float, str]: ...


class HeuristicProvider:
    """Local, deterministic, explainable provider (default)."""

    def analyze_resume(self, content: dict, target_track: str) -> dict:
        return resume_analyzer.analyze(content, target_track)

    def evaluate_answer(self, answer: str, keywords: list[str]) -> tuple[float, str]:
        return interview_evaluator.evaluate_answer(answer, keywords)


# NOTE: OpenAIProvider intentionally not implemented yet. The architecture is
# ready: implement the two methods using the OpenAI SDK and select it below.


def get_provider() -> AIProvider:
    if settings.AI_PROVIDER == "openai" and settings.OPENAI_API_KEY:
        # return OpenAIProvider(api_key=settings.OPENAI_API_KEY)
        # Fallback to heuristic until the LLM provider is implemented.
        return HeuristicProvider()
    return HeuristicProvider()
