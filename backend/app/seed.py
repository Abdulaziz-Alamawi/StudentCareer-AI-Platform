"""Seed the database with the skills catalog and interview question bank.

Run with:  python -m app.seed
Idempotent: it clears the catalog/question tables before inserting.
"""
from __future__ import annotations

import asyncio

from app.ai.data import CAREER_PROFILES
from app.core.database import connect_db, disconnect_db, prisma

# Behavioral questions are track-agnostic; reused for every track.
BEHAVIORAL = [
    ("Tell me about a challenging project and how you handled it.",
     ["challenge", "team", "result", "learned", "solution"]),
    ("Describe a time you worked under pressure to meet a deadline.",
     ["deadline", "prioritize", "pressure", "delivered", "plan"]),
    ("Give an example of a conflict in a team and how you resolved it.",
     ["conflict", "communication", "compromise", "resolved", "listen"]),
]

SCENARIO = [
    ("A production issue appears minutes before a demo. Walk me through your response.",
     ["reproduce", "logs", "rollback", "communicate", "prioritize", "fix"]),
    ("You receive ambiguous requirements from a stakeholder. What do you do?",
     ["clarify", "questions", "assumptions", "document", "stakeholder"]),
]

# Track-specific technical questions: (prompt, keywords, difficulty)
TECHNICAL: dict[str, list[tuple[str, list[str], str]]] = {
    "SOFTWARE_ENGINEERING": [
        ("Explain the difference between an array and a linked list.",
         ["array", "linked list", "memory", "access", "insertion"], "EASY"),
        ("How would you design a URL shortener?",
         ["hashing", "database", "scalability", "cache", "collision"], "HARD"),
        ("What is the difference between SQL and NoSQL databases?",
         ["sql", "nosql", "schema", "scalability", "consistency"], "MEDIUM"),
    ],
    "ARTIFICIAL_INTELLIGENCE": [
        ("Explain overfitting and how to prevent it.",
         ["overfitting", "regularization", "validation", "dropout", "data"], "MEDIUM"),
        ("What is the difference between supervised and unsupervised learning?",
         ["supervised", "unsupervised", "labels", "clustering", "classification"], "EASY"),
        ("Describe how a transformer attention mechanism works.",
         ["attention", "query", "key", "value", "softmax", "transformer"], "HARD"),
    ],
    "CLOUD_COMPUTING": [
        ("What is the difference between IaaS, PaaS, and SaaS?",
         ["iaas", "paas", "saas", "infrastructure", "platform"], "EASY"),
        ("How would you design a highly available web application on AWS?",
         ["load balancer", "auto scaling", "multi-az", "rds", "availability"], "HARD"),
        ("Explain the purpose of Infrastructure as Code.",
         ["terraform", "iac", "reproducible", "version", "automation"], "MEDIUM"),
    ],
    "IT_INFRASTRUCTURE": [
        ("Explain the difference between TCP and UDP.",
         ["tcp", "udp", "reliable", "connection", "packets"], "EASY"),
        ("How does DNS resolution work?",
         ["dns", "resolver", "record", "cache", "domain"], "MEDIUM"),
        ("Describe a disaster recovery strategy you would implement.",
         ["backup", "rto", "rpo", "recovery", "redundancy"], "HARD"),
    ],
    "DATA_SCIENCE": [
        ("How do you handle missing data in a dataset?",
         ["imputation", "drop", "mean", "median", "missing"], "MEDIUM"),
        ("Explain the bias-variance tradeoff.",
         ["bias", "variance", "overfitting", "underfitting", "tradeoff"], "HARD"),
        ("What is the difference between correlation and causation?",
         ["correlation", "causation", "relationship", "confounding"], "EASY"),
    ],
    "BUSINESS_ANALYSIS": [
        ("How do you gather and prioritize requirements?",
         ["requirements", "stakeholder", "prioritize", "moscow", "interview"], "MEDIUM"),
        ("Explain the difference between functional and non-functional requirements.",
         ["functional", "non-functional", "performance", "behavior"], "EASY"),
        ("How would you measure the success of a new feature?",
         ["kpi", "metrics", "success", "adoption", "roi"], "HARD"),
    ],
}


async def seed_skills() -> None:
    await prisma.userskill.delete_many()
    await prisma.skill.delete_many()
    seen: set[str] = set()
    for track, profile in CAREER_PROFILES.items():
        for name in profile.core_skills:
            if name in seen:
                continue
            seen.add(name)
            await prisma.skill.create(
                data={
                    "name": name,
                    "category": profile.label,
                    "tracks": [track],
                    "demandScore": 0.6,
                }
            )
    print(f"  seeded {len(seen)} skills")


async def seed_questions() -> None:
    await prisma.interviewanswer.delete_many()
    await prisma.interviewquestion.delete_many()
    count = 0
    for track in CAREER_PROFILES:
        for prompt, keywords, difficulty in TECHNICAL[track]:
            await prisma.interviewquestion.create(
                data={
                    "track": track,
                    "type": "TECHNICAL",
                    "difficulty": difficulty,
                    "prompt": prompt,
                    "keywords": keywords,
                }
            )
            count += 1
        for prompt, keywords in BEHAVIORAL:
            await prisma.interviewquestion.create(
                data={
                    "track": track,
                    "type": "BEHAVIORAL",
                    "difficulty": "MEDIUM",
                    "prompt": prompt,
                    "keywords": keywords,
                }
            )
            count += 1
        for prompt, keywords in SCENARIO:
            await prisma.interviewquestion.create(
                data={
                    "track": track,
                    "type": "SCENARIO",
                    "difficulty": "MEDIUM",
                    "prompt": prompt,
                    "keywords": keywords,
                }
            )
            count += 1
    print(f"  seeded {count} interview questions")


async def main() -> None:
    await connect_db()
    print("Seeding database...")
    await seed_skills()
    await seed_questions()
    await disconnect_db()
    print("Done.")


if __name__ == "__main__":
    asyncio.run(main())
