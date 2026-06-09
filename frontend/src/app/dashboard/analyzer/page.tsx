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
import { Progress } from "@/components/ui/progress";

const severityStyle: Record<string, string> = {
  high: "text-rose-500",
  medium: "text-amber-500",
  low: "text-blue-500",
};

export default function AnalyzerPage() {
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
      toast.success("Analysis complete!");
    } catch (e: any) {
      toast.error(e.message ?? "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  const subScores = result
    ? [
        { label: "ATS", value: result.ats_score },
        { label: "Content", value: result.content_score },
        { label: "Formatting", value: result.formatting_score },
        { label: "Completeness", value: result.completeness_score },
        { label: "Skills Coverage", value: result.skills_coverage },
      ]
    : [];

  return (
    <div>
      <PageHeader
        title="AI Resume Analyzer"
        description="Get an instant ATS score and actionable improvements."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScanSearch className="h-5 w-5 text-primary" /> Resume Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Target career track</Label>
              <Select value={track} onChange={(e) => setTrack(e.target.value)}>
                {CAREER_TRACKS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Contact email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
              />
            </div>
            <div className="space-y-2">
              <Label>Professional summary</Label>
              <Textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="A software engineer who built and optimized..."
              />
            </div>
            <div className="space-y-2">
              <Label>Skills (comma separated)</Label>
              <Input
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="python, react, sql, git"
              />
            </div>
            <div className="space-y-2">
              <Label>Experience bullets (one per line)</Label>
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
              Include education section
            </label>
            <Button onClick={analyze} disabled={loading} className="w-full">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Analyze resume
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {result ? (
            <>
              <Card>
                <CardContent className="flex flex-col items-center gap-4 pt-6 sm:flex-row sm:gap-8">
                  <ScoreRing value={result.overall_score} label="Overall" />
                  <div className="flex-1 space-y-3">
                    {subScores.map((s) => (
                      <div key={s.label}>
                        <div className="mb-1 flex justify-between text-xs">
                          <span>{s.label}</span>
                          <span className="text-muted-foreground">
                            {Math.round(s.value)}%
                          </span>
                        </div>
                        <Progress value={s.value} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Suggestions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {result.suggestions.length === 0 ? (
                    <p className="flex items-center gap-2 text-sm text-emerald-500">
                      <CheckCircle2 className="h-4 w-4" /> Great — no major issues found!
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

              {result.missing_skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Missing Skills</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {result.missing_skills.map((s) => (
                      <Badge key={s} variant="warning">
                        {s}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="flex h-full min-h-[300px] flex-col items-center justify-center text-center text-muted-foreground">
                <ScanSearch className="mb-3 h-10 w-10 opacity-40" />
                <p>Fill in your resume details and run the analysis to see your scores.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
