# Database Design

**Provider:** PostgreSQL 16  
**ORM:** Prisma (`backend/prisma/schema.prisma`)

## Entity Relationship Overview

```
User ──┬── Profile (1:1)
       ├── Resume ── ResumeScore (1:N)
       ├── UserSkill ── Skill (N:M via join)
       ├── Certification
       ├── Project
       ├── InterviewAttempt ── InterviewAnswer (1:N)
       ├── CareerRoadmap
       ├── Recommendation
       ├── ReadinessScore
       └── Analytics (1:1)

InterviewQuestion ── InterviewAnswer (1:N)
```

## Tables

| Table | Purpose |
| --- | --- |
| `users` | Authentication, role, hashed password |
| `profiles` | Extended user info, career track, interests |
| `resumes` | Structured JSON resume documents |
| `resume_scores` | AI analysis snapshots per resume |
| `skills` | Global skill catalog (seeded) |
| `user_skills` | User ↔ skill join with proficiency level |
| `certifications` | User certifications |
| `projects` | Portfolio projects |
| `interview_questions` | Question bank (seeded) |
| `interview_attempts` | Completed interview sessions |
| `interview_answers` | Per-question answers and scores |
| `readiness_scores` | Career readiness snapshots |
| `career_roadmaps` | Generated roadmap sections |
| `recommendations` | Personalized recommendations |
| `analytics` | Aggregated usage counters |

## Key Design Decisions

- **Resume content as JSON** — flexible schema for all resume sections without rigid column-per-field modeling.
- **Score snapshots** — every analysis/readiness run is persisted for historical tracking.
- **Owner-scoped access** — all user data is filtered by `userId` in the service layer.
- **Seeded catalogs** — skills and interview questions are pre-populated via `python -m app.seed`.
