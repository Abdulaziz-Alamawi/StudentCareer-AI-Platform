"use client";

import * as React from "react";
import Link from "next/link";
import { FileText, Mic, PuzzleIcon, Map, TrendingUp } from "lucide-react";
import { api, type DashboardData } from "@/lib/api";
import { ScoreRing } from "@/components/dashboard/score-ring";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReadinessRadar } from "@/components/dashboard/charts";
import { QuickStart } from "@/components/dashboard/quick-start";
import { WelcomeHeader } from "@/components/dashboard/welcome-header";
import { DashboardSkeleton, ErrorState } from "@/components/dashboard/states";
import { readinessLabel } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export default function DashboardPage() {
  const { t } = useI18n();
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    api
      .dashboard()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (error || !data) return <ErrorState message={error ?? undefined} />;

  const breakdown = [
    { label: t("dash.resume"), value: data.readiness.breakdown.resume_score },
    { label: t("dash.skills"), value: data.readiness.breakdown.skills_score },
    { label: t("dash.certifications"), value: data.readiness.breakdown.certifications_score },
    { label: t("dash.projects"), value: data.readiness.breakdown.projects_score },
    { label: t("dash.interview"), value: data.readiness.breakdown.interview_score },
  ];

  const quickStats = [
    { icon: FileText, label: t("dash.resumes"), value: data.resume_analytics.total_resumes, href: "/dashboard/resume" },
    { icon: TrendingUp, label: t("dash.bestAts"), value: `${data.resume_analytics.best_ats_score}`, href: "/dashboard/analyzer" },
    { icon: Mic, label: t("dash.interviews"), value: data.interview_analytics.attempts, href: "/dashboard/interview" },
    { icon: PuzzleIcon, label: t("dash.skillCoverage"), value: `${Math.round(data.skill_coverage)}%`, href: "/dashboard/skills" },
  ];

  return (
    <div>
      <WelcomeHeader
        score={data.readiness.overall_score}
        level={data.readiness.level}
      />

      <QuickStart />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{t("dash.careerReadiness")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ScoreRing value={data.readiness.overall_score} label="/ 100" />
            <Badge className="mt-4" variant="success">
              {readinessLabel(data.readiness.level)}
            </Badge>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {data.readiness.summary}
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("dash.scoreBreakdown")}</CardTitle>
          </CardHeader>
          <CardContent className="grid items-center gap-4 pt-2 sm:grid-cols-2">
            <ReadinessRadar data={breakdown} />
            <div className="space-y-3">
              {breakdown.map((b) => (
                <div key={b.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{b.label}</span>
                  <span className="font-semibold tabular-nums">{Math.round(b.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <s.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-bold">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" /> {t("dash.recommendations")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.recommendations.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t("dash.recEmpty")}
              </p>
            ) : (
              <ul className="space-y-3">
                {data.recommendations.map((r, i) => (
                  <li key={i} className="rounded-lg border border-border p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{r.title}</span>
                      <Badge variant="outline">{r.type}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{r.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("dash.interviewPerformance")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="flex items-center justify-between rounded-lg bg-secondary/40 p-4">
              <span className="text-sm text-muted-foreground">{t("dash.avgScore")}</span>
              <span className="text-2xl font-bold">
                {data.interview_analytics.average_score}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-secondary/40 p-4">
              <span className="text-sm text-muted-foreground">{t("dash.bestScore")}</span>
              <span className="text-2xl font-bold">
                {data.interview_analytics.best_score}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-secondary/40 p-4">
              <span className="text-sm text-muted-foreground">{t("dash.roadmapProgress")}</span>
              <span className="text-2xl font-bold">
                {Math.round(data.roadmap_progress)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
