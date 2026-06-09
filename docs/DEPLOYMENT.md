# Deployment Guide

## Frontend → Vercel

1. Push the repo to GitHub.
2. Import the project in Vercel; set **Root Directory** to `frontend`.
3. Environment variable:
   - `NEXT_PUBLIC_API_URL` = your Railway backend URL (e.g. `https://api.example.com`)
4. Deploy. Vercel auto-detects Next.js 15.

## Backend + Database → Railway

1. Create a new Railway project.
2. Add **PostgreSQL** plugin → copy `DATABASE_URL`.
3. Deploy the `backend/` service (Dockerfile detected).
4. Set environment variables:
   ```
   DATABASE_URL=postgresql://...
   SECRET_KEY=<long-random-string>
   BACKEND_CORS_ORIGINS=["https://your-vercel-app.vercel.app"]
   ```
5. The Dockerfile runs `prisma db push` on startup.
6. Optionally run seed: `python -m app.seed` via Railway shell.

## Local Docker Compose

```bash
docker compose up --build
```
- Frontend: http://localhost:3000
- Backend: http://localhost:8000/docs
- PostgreSQL: localhost:5432

## Post-deploy checklist

- [ ] Change `SECRET_KEY` in production
- [ ] Restrict CORS to your frontend domain
- [ ] Run database seed for interview questions
- [ ] Verify `/health` returns `healthy`
- [ ] Test register → login → dashboard flow
