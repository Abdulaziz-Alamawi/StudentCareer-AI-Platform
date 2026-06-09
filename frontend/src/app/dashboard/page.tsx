"use client";

import * as React from "react";
import { Loader2, FileText, Mic, PuzzleIcon, Map, TrendingUp } from "lucide-react";
import { api, type DashboardData } from "@/lib/api";
import { PageHeader } from "@/components/dashboard/page-header";
import { ScoreRing } from "@/components/dashboard/score-ring";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { readinessLabel } from "@/lib/utils";

export default function DashboardPage() {
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

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          Could not load dashboard data. {error}
        </CardContent>
      </Card>
    );
  }

  const breakdown = [
    { label: "Resume", value: data.readiness.breakdown.resume_score },
    { label: "Skills", value: data.readiness.breakdown.skills_score },
    { label: "Certifications", value: data.readiness.breakdown.certifications_score },
    { label: "Projects", value: data.readiness.breakdown.projects_score },
    { label: "Interview", value: data.readiness.breakdown.interview_score },
  ];

  const quickStats = [
    { icon: FileText, label: "Resumes", value: data.resume_analytics.total_resumes },
    { icon: TrendingUp, label: "Best ATS", value: `${data.resume_analytics.best_ats_score}` },
    { icon: Mic, label: "Interviews", value: data.interview_analytics.attempts },
    { icon: PuzzleIcon, label: "Skill Coverage", value: `${Math.round(data.skill_coverage)}%` },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Your complete career readiness at a glance."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Career Readiness</CardTitle>
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
            <CardTitle>Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-2">
            {breakdown.map((b) => (
              <div key={b.label}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-medium">{b.label}</span>
                  <span className="text-muted-foreground">{Math.round(b.value)}%</span>
                </div>
                <Progress value={b.value} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((s) => (
          <Card key={s.label}>
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
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" /> Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.recommendations.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Run an analysis or skill-gap check to get personalized recommendations.
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
            <CardTitle>Interview Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="flex items-center justify-between rounded-lg bg-secondary/40 p-4">
              <span className="text-sm text-muted-foreground">Average score</span>
              <span className="text-2xl font-bold">
                {data.interview_analytics.average_score}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-secondary/40 p-4">
              <span className="text-sm text-muted-foreground">Best score</span>
              <span className="text-2xl font-bold">
                {data.interview_analytics.best_score}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-secondary/40 p-4">
              <span className="text-sm text-muted-foreground">Roadmap progress</span>
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
