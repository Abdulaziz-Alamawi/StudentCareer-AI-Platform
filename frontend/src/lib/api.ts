/**
 * Typed API client for the StudentCareer AI backend.
 * Handles JWT auth, JSON (de)serialization, and consistent error shapes.
 */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000";
const PREFIX = "/api/v1";
const TOKEN_KEY = "sc_token";

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${PREFIX}${path}`, { ...options, headers });

  if (res.status === 204) return undefined as T;

  let body: any = null;
  try {
    body = await res.json();
  } catch {
    /* no body */
  }

  if (!res.ok) {
    const message = body?.error?.message || body?.detail || "Request failed";
    throw new ApiError(message, res.status, body?.error?.details);
  }
  return body as T;
}

export const api = {
  // ---- Auth ----
  register: (data: { email: string; password: string; full_name: string }) =>
    request<AuthResult>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  login: (data: { email: string; password: string }) =>
    request<AuthResult>("/auth/login/json", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  me: () => request<User>("/auth/me"),
  getProfile: () => request<Profile>("/auth/profile"),
  updateProfile: (data: Partial<Profile>) =>
    request<Profile>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // ---- Resumes ----
  listResumes: () => request<Resume[]>("/resumes"),
  createResume: (data: any) =>
    request<Resume>("/resumes", { method: "POST", body: JSON.stringify(data) }),
  getResume: (id: string) => request<Resume>(`/resumes/${id}`),
  updateResume: (id: string, data: any) =>
    request<Resume>(`/resumes/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  duplicateResume: (id: string) =>
    request<Resume>(`/resumes/${id}/duplicate`, { method: "POST" }),
  deleteResume: (id: string) =>
    request<void>(`/resumes/${id}`, { method: "DELETE" }),

  // ---- Analysis ----
  analyzeResume: (data: any) =>
    request<AnalysisResult>("/analysis/resume", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // ---- Interview ----
  getQuestions: (data: any) =>
    request<Question[]>("/interview/questions", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  submitInterview: (data: any) =>
    request<InterviewResult>("/interview/attempts", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // ---- Skills / Roadmap / Readiness / Dashboard ----
  skillGap: (data: any) =>
    request<SkillGapResult>("/skills/gap", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  generateRoadmap: (data: any) =>
    request<RoadmapResult>("/roadmap/generate", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  readiness: () => request<ReadinessResult>("/readiness"),
  dashboard: () => request<DashboardData>("/dashboard"),
};

// ---------- Types ----------
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}
export interface Profile {
  id: string;
  user_id: string;
  headline?: string;
  bio?: string;
  major?: string;
  university?: string;
  graduation_year?: number;
  career_track?: string;
  location?: string;
  linkedin_url?: string;
  github_url?: string;
  website_url?: string;
  interests: string[];
}
export interface AuthResult {
  token: { access_token: string; token_type: string };
  user: User;
}
export interface Resume {
  id: string;
  user_id: string;
  title: string;
  template: string;
  is_primary: boolean;
  content: any;
  created_at: string;
  updated_at: string;
}
export interface Suggestion {
  category: string;
  message: string;
  severity: string;
}
export interface AnalysisResult {
  ats_score: number;
  content_score: number;
  formatting_score: number;
  completeness_score: number;
  skills_coverage: number;
  overall_score: number;
  missing_sections: string[];
  missing_skills: string[];
  matched_skills: string[];
  suggestions: Suggestion[];
}
export interface Question {
  id: string;
  track: string;
  type: string;
  difficulty: string;
  prompt: string;
}
export interface InterviewResult {
  attempt_id: string;
  score: number;
  total_questions: number;
  improvement_areas: string[];
  per_answer: { question_id: string; score: number; feedback: string }[];
}
export interface SkillGapResult {
  track: string;
  coverage: number;
  matched_skills: string[];
  missing_skills: string[];
  recommended_technologies: string[];
  recommended_certifications: string[];
  recommended_projects: string[];
}
export interface RoadmapStep {
  order: number;
  title: string;
  description: string;
  duration_weeks: number;
  resources: string[];
}
export interface RoadmapResult {
  track: string;
  sections: { kind: string; title: string; steps: RoadmapStep[] }[];
}
export interface ReadinessResult {
  overall_score: number;
  level: string;
  breakdown: {
    resume_score: number;
    skills_score: number;
    certifications_score: number;
    projects_score: number;
    interview_score: number;
  };
  summary: string;
}
export interface DashboardData {
  readiness: ReadinessResult;
  resume_analytics: {
    total_resumes: number;
    best_ats_score: number;
    latest_overall_score: number;
  };
  interview_analytics: {
    attempts: number;
    average_score: number;
    best_score: number;
  };
  skill_coverage: number;
  roadmap_progress: number;
  recommendations: {
    type: string;
    title: string;
    description: string;
    priority: number;
  }[];
}

export const CAREER_TRACKS = [
  { value: "SOFTWARE_ENGINEERING", label: "Software Engineering" },
  { value: "ARTIFICIAL_INTELLIGENCE", label: "Artificial Intelligence" },
  { value: "CLOUD_COMPUTING", label: "Cloud Computing" },
  { value: "IT_INFRASTRUCTURE", label: "IT Infrastructure" },
  { value: "DATA_SCIENCE", label: "Data Science" },
  { value: "BUSINESS_ANALYSIS", label: "Business Analysis" },
];
