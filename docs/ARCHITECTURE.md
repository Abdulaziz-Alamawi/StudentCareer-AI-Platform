# System Architecture — StudentCareer AI Platform

## 1. Overview
StudentCareer AI is a full-stack SaaS platform split into three deployable units:

1. **Frontend** — Next.js 15 (App Router) deployed to Vercel.
2. **Backend API** — FastAPI deployed to Railway, containing the AI Engine.
3. **Database** — PostgreSQL (managed on Railway) accessed through Prisma.

The design follows **Clean Architecture**: dependencies point inward, the domain
logic (services + AI engine) never imports the web framework, and the web layer
(routers) is a thin adapter over the services.

```
            ┌─────────────────────────────────────────────┐
            │                  Web Layer                    │
            │   FastAPI routers  ·  Next.js pages/components │
            └───────────────────────┬─────────────────────┘
                                     │  depends on
            ┌───────────────────────▼─────────────────────┐
            │              Application Services             │
            │  AuthService · ResumeService · AnalysisSvc    │
            │  InterviewSvc · ReadinessSvc · RoadmapSvc     │
            └───────────────────────┬─────────────────────┘
                          ┌──────────┴──────────┐
              depends on  │                     │  depends on
            ┌─────────────▼──────┐     ┌─────────▼───────────┐
            │     AI Engine      │     │   Data Access       │
            │ scikit-learn/numpy │     │   Prisma (Postgres) │
            └────────────────────┘     └─────────────────────┘
```

## 2. Layers

### 2.1 API Layer (`app/api`)
Thin routers grouped by domain. Responsibilities: request parsing, calling a
service, mapping results to response schemas, and HTTP status codes. No business
logic lives here.

### 2.2 Service Layer (`app/services`)
Pure business logic. Orchestrates the AI engine and the database. Framework-agnostic,
making it unit-testable in isolation.

### 2.3 AI Engine (`app/ai`)
Self-contained ML/heuristic package:
- `resume_analyzer.py` — TF-IDF keyword coverage, ATS rules, completeness, formatting.
- `readiness_engine.py` — weighted multi-factor 0–100 career readiness score.
- `skill_gap.py` — cosine-similarity skill matching against curated career profiles.
- `roadmap_generator.py` — rule + data driven personalized roadmaps.
- `interview_evaluator.py` — keyword/semantic scoring of interview answers.
- `provider.py` — pluggable interface so an OpenAI/LLM provider can be added later
  without touching services.

### 2.4 Data Layer (`prisma`)
Prisma schema is the single source of truth for the relational model. The Python
Prisma client is injected into services via FastAPI dependencies.

## 3. Request Lifecycle (example: Resume Analysis)
```
Client → POST /api/v1/analysis/resume
      → AnalysisRouter (validate payload)
      → AnalysisService.analyze(resume)
           → AIEngine.resume_analyzer.analyze(...)   # scores
           → prisma.resumescore.create(...)          # persist
      → AnalysisResponse (ATS score, suggestions...)
```

## 4. Security
- **AuthN:** OAuth2 password flow → JWT access tokens (`python-jose`).
- **Passwords:** bcrypt via `passlib`.
- **AuthZ:** `get_current_user` dependency guards protected routes; resources are
  owner-scoped (a user can only read/write their own data).
- **Validation:** Pydantic v2 schemas validate every request body.
- **CORS:** restricted to configured origins.
- **Errors:** centralized exception handlers return consistent JSON error bodies.

## 5. Scalability Notes
- Stateless backend → horizontal scaling behind a load balancer.
- AI engine is CPU-bound and side-effect free → easy to move to a worker/queue.
- Provider abstraction allows swapping heuristic models for hosted LLMs.

## 6. Technology Decisions
| Concern | Choice | Why |
| --- | --- | --- |
| Frontend | Next.js 15 App Router | SSR/ISR, great DX, Vercel-native |
| Backend | FastAPI | Async, typed, auto OpenAPI docs |
| ORM | Prisma (Python) | Type-safe schema-first modeling |
| AI | scikit-learn | Transparent, explainable, no GPU needed |
| Auth | JWT | Stateless, scalable |
