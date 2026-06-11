"use client";

import * as React from "react";
import { Loader2, Map, Clock } from "lucide-react";
import { toast } from "sonner";
import { api, CAREER_TRACKS, type RoadmapResult } from "@/lib/api";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/dashboard/states";
import { useI18n } from "@/lib/i18n";

export default function RoadmapPage() {
  const { t } = useI18n();
  const [track, setTrack] = React.useState(CAREER_TRACKS[0].value);
  const [major, setMajor] = React.useState("");
  const [skills, setSkills] = React.useState("");
  const [interests, setInterests] = React.useState("");
  const [result, setResult] = React.useState<RoadmapResult | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function generate() {
    setLoading(true);
    try {
      const res = await api.generateRoadmap({
        major,
        career_track: track,
        current_skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
        interests: interests.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setResult(res);
      toast.success(t("roadmap.generated"));
    } catch (e: any) {
      toast.error(e.message ?? t("roadmap.failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        showBack
        title={t("roadmap.title")}
        description={t("roadmap.desc")}
      />

      <Card className="mb-6">
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("roadmap.careerTrack")}</Label>
              <Select value={track} onChange={(e) => setTrack(e.target.value)}>
                {CAREER_TRACKS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("roadmap.major")}</Label>
              <Input
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="Computer Science"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("roadmap.currentSkills")}</Label>
              <Input
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="python, sql, git"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("roadmap.interests")}</Label>
              <Input
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="machine learning, web development"
              />
            </div>
          </div>
          <Button onClick={generate} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            <Map className="h-4 w-4" /> {t("roadmap.generate")}
          </Button>
        </CardContent>
      </Card>

      {!result && !loading && (
        <EmptyState
          icon={Map}
          title={t("roadmap.emptyTitle")}
          description={t("roadmap.emptyDesc")}
        />
      )}

      {result && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-primary/20 bg-primary/[0.04] p-4">
            <p className="text-sm text-muted-foreground">
              {t("roadmap.personalizedFor")} <strong className="text-foreground">{result.track}</strong>
            </p>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4 text-primary" />
              {t("roadmap.totalDuration")}:{" "}
              <span className="font-bold">
                {result.sections.reduce(
                  (sum, s) => sum + s.steps.reduce((a, st) => a + st.duration_weeks, 0),
                  0
                )}{" "}
                {t("roadmap.weeksShort")}
              </span>
            </div>
          </div>

          {result.sections.map((section, si) => (
            <Card key={section.kind}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge>{t("roadmap.phase")} {si + 1}</Badge> {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="relative space-y-5 border-s-2 border-dashed border-border ps-6">
                  {section.steps.map((step) => (
                    <li key={step.order} className="relative">
                      <span className="absolute -start-[2.1rem] flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground ring-4 ring-background">
                        {step.order}
                      </span>
                      <div className="rounded-lg border border-border p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-medium">{step.title}</p>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" /> {step.duration_weeks} {t("roadmap.weeks")}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                        {step.resources.length > 0 && (
                          <ul className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                            {step.resources.map((r) => (
                              <li key={r}>• {r}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
