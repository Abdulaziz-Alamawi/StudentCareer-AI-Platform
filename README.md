<div align="center">

#  StudentCareer AI Platform

### An AI-powered career development & employability assessment system

Helping students and graduates build stronger resumes, ace interviews, close skill gaps, and become **job-ready** through intelligent recommendations and career planning.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

**Author:** Abdulaziz AlAmawi

</div>

---

## �‑ Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Technologies](#-technologies)
- [Architecture](#-architecture)
- [Screenshots](#-screenshots)
- [Installation Guide](#-installation-guide)
- [Folder Structure](#-folder-structure)
- [API Documentation](#-api-documentation)
- [Deployment Guide](#-deployment-guide)
- [Testing](#-testing)
- [Future Improvements](#-future-improvements)
- [License](#-license)

---

##  Project Overview

**StudentCareer AI Platform** is a full-stack, AI-powered SaaS application designed to maximize the **employability** of university students and fresh graduates.

Instead of guessing whether they are ready for the job market, students get **data-driven, explainable insights**:

- An **AI Resume Analyzer** that scores ATS-compatibility and content quality.
- An **AI Interview Simulator** across six career tracks.
- A **Career Readiness Engine** that produces a single 0–100 readiness score.
- A **Skill Gap Analyzer** and **Career Roadmap Generator** powered by ML similarity models.

The platform is built with a clean, scalable, production-minded architecture and is fully deployable to **Vercel** (frontend) and **Railway** (backend + database).

---

## ✨ Features

| Module | Description |
| --- | --- |
|  **Landing Page** | Modern SaaS marketing site: hero, features, stats, testimonials, FAQ, contact. |
|  **Authentication** | JWT-based register / login / logout, hashed passwords, protected routes, profiles. |
|  **Smart Resume Builder** | Create, edit, duplicate, and export resumes (PDF) with 3 templates. |
|  **AI Resume Analyzer** | ATS score, completeness, formatting, content quality, missing skills report. |
|  **AI Interview Simulator** | 6 career tracks, technical/behavioral/scenario questions, difficulty levels, scoring. |
|  **Career Readiness Engine** | Weighted readiness score (resume, skills, certs, projects, interview). |
|  **Skill Gap Analyzer** | Detects missing skills, recommends technologies, certifications, and projects. |
|  **Career Roadmap Generator** | Personalized learning / certification / project / career roadmaps. |
|  **User Dashboard** | Unified analytics dashboard for all modules. |

---

## 🛠 Technologies

**Frontend:** Next.js 15 · React 18 · TypeScript · TailwindCSS · Framer Motion · Shadcn UI · Recharts
**Backend:** FastAPI · Python 3.11+ · Pydantic v2 · Uvicorn
**AI Layer:** Scikit-Learn · Pandas · NumPy (TF‑IDF, cosine similarity, weighted scoring)
**Database:** PostgreSQL 16 · Prisma ORM (Python client)
**Auth:** JWT (python-jose) · Passlib/bcrypt
**DevOps:** Docker · Docker Compose · GitHub Actions · Vercel · Railway

---

##  Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                        │
└───────────────────────────────┬──────────────────────────────┘
                                 │ HTTPS
              ┌──────────────────▼───────────────────┐
              │      Frontend — Next.js 15 (Vercel)   │
              │  App Router · Server/Client Components │
              │  Tailwind · Shadcn · Framer Motion     │
              └──────────────────┬───────────────────┘
                                 │ REST (JSON / JWT)
              ┌──────────────────▼───────────────────┐
              │       Backend — FastAPI (Railway)     │
              │  ┌──────────────┐  ┌────────────────┐ │
              │  │  API Routers │  │  Service Layer │ │
              │  └──────┬───────┘  └────────┬───────┘ │
              │         │      ┌────────────▼───────┐ │
              │         │      │     AI ENGINE      │ │
              │         │      │  scikit-learn /    │ │
              │         │      │  pandas / numpy    │ │
              │         │      └────────────────────┘ │
              │  ┌──────▼───────────────────────────┐ │
              │  │   Prisma ORM (Python client)      │ │
              │  └──────────────┬───────────────────┘ │
              └─────────────────┼─────────────────────┘
                                │ SQL
                   ┌────────────▼────────────┐
                   │   PostgreSQL 16 (Railway)│
                   └─────────────────────────┘
```

The system follows **Clean Architecture** principles with clear separation between
**API (routers) → Services (business logic) → AI Engine / Data (Prisma)**.
See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for the full design.

---

## 📸 Screenshots

> Add your screenshots to `docs/screenshots/` and reference them here.

| Landing | Dashboard | Resume Analyzer |
| --- | --- | --- |
| `docs/screenshots/landing.png` | `docs/screenshots/dashboard.png` | `docs/screenshots/analyzer.png` |

---

##  Installation Guide

### Prerequisites
- Node.js ≥ 20
- Python ≥ 3.11
- PostgreSQL ≥ 14 (or Docker)

### 1. Clone
```bash
git clone https://github.com/<your-username>/studentcareer-ai-platform.git
cd studentcareer-ai-platform
```

### 2. Quick start (Windows — two terminals)
```powershell
# Terminal 1 — Backend
cd backend
.\.venv\Scripts\activate          # or use C:\scvenv if on a localized path
copy .env.example .env
$env:SECRET_KEY="dev-secret"; $env:DATABASE_URL="postgresql://studentcareer:studentcareer@localhost:5432/studentcareer"
uvicorn app.main:app --reload

# Terminal 2 — Frontend
cd frontend
copy .env.example .env.local
npm install && npm run dev
```
Or run `.\scripts\start-dev.ps1` to launch both in separate windows.

- Frontend → http://localhost:3000
- Backend (Swagger) → http://localhost:8000/docs

### 3. Run everything with Docker (recommended for full DB support)
```bash
docker compose up --build
```

### 3. Manual setup

**Backend**
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate   |   Unix: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # set DATABASE_URL + SECRET_KEY
prisma generate
prisma db push
python -m app.seed            # optional: seed interview questions & catalog
uvicorn app.main:app --reload
```

**Frontend**
```bash
cd frontend
npm install
cp .env.example .env.local    # set NEXT_PUBLIC_API_URL
npm run dev
```

### Troubleshooting

- **`prisma generate` → `spawn prisma-client-py ENOENT` (Windows):** make sure the
  virtual environment is **activated** (`\.venv\Scripts\activate`) so the venv
  `Scripts` directory is on `PATH`, then re-run `prisma generate`.
- **Non‑ASCII project path (Windows):** the Prisma Python generator may fail to
  write the client when the absolute path contains non‑ASCII characters (e.g. a
  localized `Documents` folder). If `from prisma.models import ...` fails after a
  "successful" generate, clone/move the project to an ASCII path such as
  `C:\dev\studentcareer-ai-platform`. Docker, CI, Vercel and Railway use ASCII
  paths and are unaffected.
- **Database migrations:** this project uses Prisma's schema‑first `prisma db push`
  (the recommended flow for `prisma-client-py`); Docker and CI run it automatically.

---

## 📁 Folder Structure

```
studentcareer-ai-platform/
├── frontend/                 # Next.js 15 application
│   ├── src/
│   │   ├── app/              # App Router pages (landing, auth, dashboard)
│   │   ├── components/       # Reusable UI + Shadcn components
│   │   ├── lib/              # API client, utils, hooks
│   │   └── styles/
│   └── package.json
│
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── api/              # Routers (auth, resume, analysis, interview...)
│   │   ├── core/             # Config, security, dependencies
│   │   ├── schemas/          # Pydantic models
│   │   ├── services/         # Business logic
│   │   ├── ai/               # AI ENGINE (scikit-learn / pandas)
│   │   └── main.py
│   ├── prisma/schema.prisma  # Database schema
│   ├── tests/                # Unit + integration tests
│   └── requirements.txt
│
├── docs/                     # Architecture, API, screenshots
├── docker-compose.yml
├── README.md · LICENSE · CHANGELOG.md · CONTRIBUTING.md
```

---

## 📡 API Documentation

Interactive docs (Swagger UI) are auto-generated at `http://localhost:8000/docs`.
A written reference lives in [`docs/API.md`](./docs/API.md).

Key endpoint groups:
- `POST /api/v1/auth/register · /login · /me`
- `GET/POST/PUT/DELETE /api/v1/resumes`
- `POST /api/v1/analysis/resume`
- `GET /api/v1/interview/questions · POST /api/v1/interview/attempts`
- `GET /api/v1/dashboard`
- `POST /api/v1/skills/gap · /api/v1/roadmap/generate`

---

##  Deployment Guide

**Frontend → Vercel**
1. Import the `frontend/` directory as a Vercel project.
2. Set `NEXT_PUBLIC_API_URL` to your Railway backend URL.
3. Deploy.

**Backend + DB → Railway**
1. Create a PostgreSQL plugin → copy `DATABASE_URL`.
2. Deploy `backend/` (Dockerfile detected automatically).
3. Set env vars: `DATABASE_URL`, `SECRET_KEY`, `BACKEND_CORS_ORIGINS`.
4. Run `prisma db push` as a release command.

See [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) for details.

---

## 🧪 Testing

```bash
cd backend
pytest -v                 # unit + integration + validation tests
```

---

##  Future Improvements

- OpenAI / LLM integration for free-text interview evaluation (architecture already supports a pluggable provider).
- Real PDF parsing pipeline (currently text + structured input).
- Job-board integrations (LinkedIn / Indeed) for live skill demand.
- Multi-language resume support.
- Recruiter-facing analytics portal.

---

##  License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE).

<div align="center">

**Built with ❤️ by Abdulaziz AlAmawi**

</div>
