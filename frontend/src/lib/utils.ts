import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function scoreColor(score: number): string {
  if (score >= 85) return "text-emerald-500";
  if (score >= 70) return "text-blue-500";
  if (score >= 45) return "text-amber-500";
  return "text-rose-500";
}

export function readinessLabel(level: string): string {
  return (
    {
      BEGINNER: "Beginner",
      DEVELOPING: "Developing",
      JOB_READY: "Job Ready",
      HIGHLY_COMPETITIVE: "Highly Competitive",
    }[level] || level
  );
}
