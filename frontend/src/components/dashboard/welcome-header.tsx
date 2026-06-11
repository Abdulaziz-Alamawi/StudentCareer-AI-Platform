"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { readinessLabel } from "@/lib/utils";

export function WelcomeHeader({
  score,
  level,
}: {
  score: number;
  level: string;
}) {
  const { user } = useAuth();
  const { t, dir } = useI18n();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  const hour = new Date().getHours();
  const greetKey =
    hour < 12 ? "dash.greetMorning" : hour < 18 ? "dash.greetAfternoon" : "dash.greetEvening";
  const firstName = (user?.full_name || "").trim().split(" ")[0] || "";

  const pct = Math.min(Math.max(score, 0), 100);

  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/[0.04] to-transparent p-6 sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -end-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            {readinessLabel(level)}
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t(greetKey)}{firstName ? `، ${firstName}` : ""}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("dash.welcomeSub")}</p>
        </div>

        <div className="w-full max-w-xs shrink-0">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t("dash.levelProgress")}</span>
            <span className="font-bold tabular-nums">{Math.round(pct)}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-violet-500 transition-all duration-1000"
              style={{ width: `${pct}%` }}
            />
          </div>
          <Link
            href="/dashboard/roadmap"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {t("dash.viewRoadmap")} <Arrow className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
