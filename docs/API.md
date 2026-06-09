# API Reference — StudentCareer AI Platform

Base URL: `http://localhost:8000/api/v1`
Interactive docs: `http://localhost:8000/docs`

All protected endpoints require `Authorization: Bearer <jwt>`.

## Authentication

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | No | Register a new user |
| POST | `/auth/login` | No | OAuth2 form login (username=email) |
| POST | `/auth/login/json` | No | JSON login → token + user |
| GET | `/auth/me` | Yes | Current user |
| POST | `/auth/logout` | Yes | Logout (client discards token) |
| GET | `/auth/profile` | Yes | Get profile |
| PUT | `/auth/profile` | Yes | Update profile |

### Register
```json
POST /auth/register
{ "email": "a@b.com", "password": "secret123", "full_name": "Abdulaziz" }
```

## Resumes

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/resumes` | Create resume |
| GET | `/resumes` | List user's resumes |
| GET | `/resumes/{id}` | Get resume |
| PUT | `/resumes/{id}` | Update resume |
| POST | `/resumes/{id}/duplicate` | Duplicate resume |
| DELETE | `/resumes/{id}` | Delete resume |

## Resume Analysis

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/analysis/resume` | Analyze resume (by id or inline content) |

```json
POST /analysis/resume
{
  "content": { "summary": "...", "skills": ["python"] },
  "target_track": "SOFTWARE_ENGINEERING"
}
```

## Interview Simulator

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/interview/questions` | Fetch questions for a session |
| POST | `/interview/attempts` | Submit answers and get scored feedback |

## Skill Gap

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/skills/gap` | Analyze skill gap for a career track |

## Career Roadmap

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/roadmap/generate` | Generate personalized roadmaps |

## Career Readiness

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/readiness` | Compute and return readiness score |

## Dashboard

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/dashboard` | Aggregated analytics for the user |

## Error Format
```json
{
  "success": false,
  "error": {
    "message": "Human-readable message",
    "details": []
  }
}
```
