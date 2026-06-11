"use client";

import * as React from "react";
import { Loader2, PuzzleIcon, X, Plus, CheckCircle2, Target } from "lucide-react";
import { toast } from "sonner";
import { api, CAREER_TRACKS, type SkillGapResult } from "@/lib/api";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RadialScore } from "@/components/dashboard/charts";
import { EmptyState } from "@/components/dashboard/states";
import { useI18n } from "@/lib/i18n";

const SKILL_SUGGESTIONS: Record<string, string[]> = {
  SOFTWARE_ENGINEERING: ["python", "javascript", "react", "node.js", "sql", "git", "docker", "rest api", "testing", "algorithms"],
  ARTIFICIAL_INTELLIGENCE: ["python", "machine learning", "deep learning", "pytorch", "tensorflow", "pandas", "numpy", "nlp", "statistics"],
  CLOUD_COMPUTING: ["aws", "azure", "docker", "kubernetes", "terraform", "linux", "ci/cd", "networking", "python"],
  IT_INFRASTRUCTURE: ["linux", "networking", "windows server", "bash", "powershell", "active directory", "vmware", "monitoring"],
  DATA_SCIENCE: ["python", "sql", "pandas", "numpy", "statistics", "machine learning", "data visualization", "tableau", "excel"],
  BUSINESS_ANALYSIS: ["sql", "excel", "tableau", "requirements", "process modeling", "stakeholder management", "agile", "documentation"],
};

export default function SkillsPage() {
  const { t } = useI18n();
  const [track, setTrack] = React.useState(CAREER_TRACKS[0].value);
  const [skills, setSkills] = React.useState<string[]>([]);
  const [input, setInput] = React.useState("");
  const [result, setResult] = React.useState<SkillGapResult | null>(null);
  const [loading, setLoading] = React.useState(false);

  function addSkill(value: string) {
    const v = value.trim().toLowerCase();
    if (!v) return;
    setSkills((prev) => (prev.includes(v) ? prev : [...prev, v]));
    setInput("");
  }

  function removeSkill(value: string) {
    setSkills((prev) => prev.filter((s) => s !== value));
  }

  const suggestions = (SKILL_SUGGESTIONS[track] || []).filter((s) => !skills.includes(s));

  async function analyze() {
    if (skills.length === 0) {
      toast.error(t("skills.noSkillsYet"));
      return;
    }
    setLoading(true);
    try {
      const res = await api.skillGap({ career_track: track, current_skills: skills });
      setResult(res);
      toast.success(t("skills.complete"));
    } catch (e: any) {
      toast.error(e.message ?? t("skills.failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader showBack title={t("skills.title")} description={t("skills.desc")} />

      <Card className="mb-6">
        <CardContent className="space-y-5 pt-6">
          <div className="space-y-2">
            <Label>{t("skills.careerTrack")}</Label>
            <Select
              value={track}
              onChange={(e) => {
                setTrack(e.target.value);
                setResult(null);
              }}
            >
              {CAREER_TRACKS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("skills.yourSkills")}</Label>
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill(input);
                  }
                }}
                placeholder="python, sql, git..."
              />
              <Button type="button" variant="outline" onClick={() => addSkill(input)}>
                <Plus className="h-4 w-4" /> {t("skills.addSkill")}
              </Button>
            </div>

            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => removeSkill(s)}
                      className="rounded-full p-0.5 hover:bg-primary/20"
                      aria-label="remove"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="pt-1 text-xs text-muted-foreground">{t("skills.noSkillsYet")}</p>
            )}
          </div>

          {suggestions.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                {t("skills.suggestions")} — {t("skills.clickToAdd")}
              </Label>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => addSkill(s)}
                    className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    <Plus className="h-3 w-3" />
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button onClick={analyze} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            <PuzzleIcon className="h-4 w-4" /> {t("skills.analyze")}
          </Button>
        </CardContent>
      </Card>

      {!result && !loading && (
        <EmptyState
          icon={PuzzleIcon}
          title={t("skills.emptyTitle")}
          description={t("skills.emptyDesc")}
        />
      )}

      {result && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base">{t("skills.coverageGauge")}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadialScore value={result.coverage} />
              <p className="mt-2 text-center text-sm text-muted-foreground">
                {t("skills.summary", {
                  matched: result.matched_skills.length,
                  total: result.matched_skills.length + result.missing_skills.length,
                })}
              </p>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">
                {t("skills.coverageFor")} {result.track}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-emerald-500">
                  <CheckCircle2 className="h-4 w-4" /> {t("skills.matched")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.matched_skills.length === 0 ? (
                    <span className="text-sm text-muted-foreground">—</span>
                  ) : (
                    result.matched_skills.map((s) => (
                      <Badge key={s} variant="success">
                        {s}
                      </Badge>
                    ))
                  )}
                </div>
              </div>
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-amber-500">
                  <Target className="h-4 w-4" /> {t("skills.missing")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.missing_skills.map((s) => (
                    <Badge key={s} variant="warning">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("skills.recTech")}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {result.recommended_technologies.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("skills.recCerts")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {result.recommended_certifications.map((c) => (
                  <li key={c} className="rounded-lg border border-border p-3">
                    {c}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("skills.recProjects")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {result.recommended_projects.map((p) => (
                  <li key={p} className="rounded-lg border border-border p-3">
                    {p}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
