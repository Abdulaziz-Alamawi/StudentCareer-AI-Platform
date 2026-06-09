"use client";

import * as React from "react";
import { Loader2, PuzzleIcon } from "lucide-react";
import { toast } from "sonner";
import { api, CAREER_TRACKS, type SkillGapResult } from "@/lib/api";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function SkillsPage() {
  const [track, setTrack] = React.useState(CAREER_TRACKS[0].value);
  const [skills, setSkills] = React.useState("");
  const [result, setResult] = React.useState<SkillGapResult | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function analyze() {
    setLoading(true);
    try {
      const res = await api.skillGap({
        career_track: track,
        current_skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setResult(res);
      toast.success("Skill gap analysis complete!");
    } catch (e: any) {
      toast.error(e.message ?? "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Skill Gap Analyzer"
        description="Discover what skills, technologies and certifications you're missing."
      />

      <Card className="mb-6">
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Career track</Label>
              <Select value={track} onChange={(e) => setTrack(e.target.value)}>
                {CAREER_TRACKS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Your current skills (comma separated)</Label>
              <Input
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="python, sql, git, react"
              />
            </div>
          </div>
          <Button onClick={analyze} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            <PuzzleIcon className="h-4 w-4" /> Analyze skill gap
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Coverage for {result.track}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex justify-between text-sm">
                <span>Skill coverage</span>
                <span className="font-bold">{Math.round(result.coverage)}%</span>
              </div>
              <Progress value={result.coverage} />
              <div className="mt-6">
                <p className="mb-2 text-sm font-medium text-emerald-500">Matched skills</p>
                <div className="flex flex-wrap gap-2">
                  {result.matched_skills.map((s) => (
                    <Badge key={s} variant="success">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-amber-500">Missing skills</p>
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

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recommended Technologies</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {result.recommended_technologies.map((t) => (
                  <Badge key={t} variant="secondary">
                    {t}
                  </Badge>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recommended Certifications</CardTitle>
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
                <CardTitle className="text-base">Recommended Projects</CardTitle>
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
        </div>
      )}
    </div>
  );
}
