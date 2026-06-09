"""Interview service — question delivery, scoring, and attempt persistence."""
from __future__ import annotations

import json

from prisma import Prisma

from app.ai.interview_evaluator import evaluate_attempt
from app.ai.provider import get_provider
from app.core.exceptions import NotFoundError
from app.schemas.interview import (
    AnswerFeedback,
    InterviewResult,
    InterviewSubmit,
    QuestionOut,
    StartInterviewRequest,
)


async def get_questions(db: Prisma, payload: StartInterviewRequest) -> list[QuestionOut]:
    where: dict = {"track": payload.track.value, "difficulty": payload.difficulty.value}
    if payload.question_type:
        where["type"] = payload.question_type.value

    questions = await db.interviewquestion.find_many(where=where, take=payload.limit)
    return [
        QuestionOut(
            id=q.id, track=q.track, type=q.type, difficulty=q.difficulty, prompt=q.prompt
        )
        for q in questions
    ]


async def submit(db: Prisma, user_id: str, payload: InterviewSubmit) -> InterviewResult:
    provider = get_provider()
    per_answer: list[AnswerFeedback] = []
    scored: list[dict] = []

    attempt = await db.interviewattempt.create(
        data={
            "userId": user_id,
            "track": payload.track.value,
            "difficulty": payload.difficulty.value,
            "totalQuestions": len(payload.answers),
        }
    )

    for submission in payload.answers:
        question = await db.interviewquestion.find_unique(
            where={"id": submission.question_id}
        )
        if not question:
            raise NotFoundError(f"Question {submission.question_id} not found.")

        score, feedback = provider.evaluate_answer(submission.answer, question.keywords)
        await db.interviewanswer.create(
            data={
                "attemptId": attempt.id,
                "questionId": question.id,
                "answer": submission.answer,
                "score": score,
                "feedback": feedback,
            }
        )
        per_answer.append(
            AnswerFeedback(question_id=question.id, score=score, feedback=feedback)
        )
        scored.append({"question_id": question.id, "score": score})

    aggregate = evaluate_attempt(scored)

    from datetime import datetime, timezone

    await db.interviewattempt.update(
        where={"id": attempt.id},
        data={
            "score": aggregate["score"],
            "improvementAreas": aggregate["improvement_areas"],
            "feedback": json.dumps({"per_answer": [a.model_dump() for a in per_answer]}),
            "completedAt": datetime.now(timezone.utc),
        },
    )

    # Update analytics running averages.
    attempts = await db.interviewattempt.find_many(
        where={"userId": user_id, "completedAt": {"not": None}}
    )
    completed_scores = [a.score for a in attempts] + [aggregate["score"]]
    avg = round(sum(completed_scores) / max(len(completed_scores), 1), 2)
    await db.analytics.update(
        where={"userId": user_id},
        data={"interviewsTaken": {"increment": 1}, "avgInterviewScore": avg},
    )

    return InterviewResult(
        attempt_id=attempt.id,
        score=aggregate["score"],
        total_questions=len(payload.answers),
        improvement_areas=aggregate["improvement_areas"],
        per_answer=per_answer,
    )
