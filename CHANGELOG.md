# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Planned
- OpenAI / LLM provider for free-text interview answer evaluation.
- Real PDF parsing pipeline for the Resume Analyzer.
- Recruiter analytics portal.

## [1.0.0] - 2026-06-10
### Added
- **Landing page** with hero, features, stats, testimonials, FAQ, contact, footer.
- **Authentication** module: register, login, logout, JWT, hashed passwords, profile.
- **Smart Resume Builder**: create/edit/duplicate/save resumes, 3 templates, PDF export.
- **AI Resume Analyzer**: ATS score, completeness, formatting & content quality, missing skills.
- **AI Interview Simulator**: 6 career tracks, technical/behavioral/scenario questions, scoring.
- **Career Readiness Engine**: weighted 0–100 readiness score with levels.
- **Skill Gap Analyzer**: missing skills + recommended tech/certs/projects.
- **Career Roadmap Generator**: learning/certification/project/career roadmaps.
- **User Dashboard** with unified analytics.
- Complete PostgreSQL schema via Prisma (Users, Profiles, Resumes, Scores, Skills,
  Certifications, Projects, InterviewQuestions, InterviewAttempts, CareerRoadmaps,
  Recommendations, Analytics).
- Production-ready FastAPI API layer with Swagger docs.
- Dedicated AI Engine (scikit-learn / pandas / numpy).
- Unit, integration and validation tests.
- Docker Compose, CI workflow, and full documentation.
