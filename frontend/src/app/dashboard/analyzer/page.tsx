"use client";

import * as React from "react";
import { Loader2, AlertTriangle, CheckCircle2, ScanSearch } from "lucide-react";
import { toast } from "sonner";
import { api, CAREER_TRACKS, type AnalysisResult } from "@/lib/api";
import { PageHeader } from "@/components/dashboard/page-header";
import { ScoreRing } from "@/components/dashboard/score-ring";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScoreBars } from "@/components/dashboard/charts";
import { useI18n } from "@/lib/i18n";

const severityStyle: Record<string, string> = {
  high: "text-rose-500",
  medium: "text-amber-500",
  low: "text-blue-500",
};

export default function AnalyzerPage() {
  const { t } = useI18n();
  const [track, setTrack] = React.useState(CAREER_TRACKS[0].value);
  const [summary, setSummary] = React.useState("");
  const [skills, setSkills] = React.useState("");
  const [experience, setExperience] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [hasEducation, setHasEducation] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<AnalysisResult | null>(null);

  async function analyze() {
    setLoading(true);
    try {
      const content = {
        personal_info: { email, full_name: "", phone: "", linkedin: "" },
        summary,
        education: hasEducation ? [{ institution: "University", degree: "BSc" }] : [],
        experience: experience
          ? [{ role: "Role", bullets: experience.split("\n").filter(Boolean) }]
          : [],
        projects: [],
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
        certifications: [],
        languages: [],
        achievements: [],
      };
      const res = await api.analyzeResume({ content, target_track: track });
      setResult(res);
      toast.success(t("analyzer.complete"));
    } catch (e: any) {
      toast.error(e.message ?? t("analyzer.failed"));
    } finally {
      setLoading(false);
    }
  }

  const subScores = result
    ? [
        { label: t("analyzer.atsLabel"), value: result.ats_score },
        { label: t("analyzer.content"), value: result.content_score },
        { label: t("analyzer.formatting"), value: result.formatting_score },
        { label: t("analyzer.completeness"), value: result.completeness_score },
        { label: t("analyzer.skillsCoverage"), value: result.skills_coverage },
      ]
    : [];

  return (
    <div>
      <PageHeader
        showBack
        title={t("analyzer.title")}
        description={t("analyzer.desc")}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScanSearch className="h-5 w-5 text-primary" /> {t("analyzer.input")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t("analyzer.targetTrack")}</Label>
              <Select value={track} onChange={(e) => setTrack(e.target.value)}>
                {CAREER_TRACKS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("analyzer.contactEmail")}</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("analyzer.summary")}</Label>
              <Textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder={t("analyzer.summaryPlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("analyzer.skills")}</Label>
              <Input
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="python, react, sql, git"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("analyzer.expBullets")}</Label>
              <Textarea
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder={"Built a REST API reducing latency by 30%\nLed a team of 4"}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={hasEducation}
                onChange={(e) => setHasEducation(e.target.checked)}
                className="h-4 w-4"
              />
              {t("analyzer.includeEducation")}
            </label>
            <Button onClick={analyze} disabled={loading} className="w-full">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("analyzer.analyze")}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {result ? (
            <>
              <Card>
                <CardContent className="flex flex-col items-center gap-4 pt-6 sm:flex-row sm:gap-8">
                  <ScoreRing value={result.overall_score} label={t("analyzer.overall")} />
                  <div className="flex-1">
                    <ScoreBars data={subScores} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t("analyzer.suggestions")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {result.suggestions.length === 0 ? (
                    <p className="flex items-center gap-2 text-sm text-emerald-500">
                      <CheckCircle2 className="h-4 w-4" /> {t("analyzer.noIssues")}
                    </p>
                  ) : (
                    result.suggestions.map((s, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <AlertTriangle
                          className={`mt-0.5 h-4 w-4 flex-shrink-0 ${severityStyle[s.severity]}`}
                        />
                        <span>
                          <span className="font-medium">{s.category}:</span> {s.message}
                        </span>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {(result.matched_skills.length > 0 || result.missing_skills.length > 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{t("analyzer.missingSkills")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {result.matched_skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {result.matched_skills.map((s) => (
                          <Badge key={s} variant="success">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {result.missing_skills.map((s) => (
                        <Badge key={s} variant="warning">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="flex h-full min-h-[300px] flex-col items-center justify-center text-center text-muted-foreground">
                <ScanSearch className="mb-3 h-10 w-10 opacity-40" />
                <p>{t("analyzer.empty")}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
