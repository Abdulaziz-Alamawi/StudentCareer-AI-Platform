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

export default function RoadmapPage() {
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
      toast.success("Roadmap generated!");
    } catch (e: any) {
      toast.error(e.message ?? "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Career Roadmap Generator"
        description="Get a personalized learning, certification, project and career roadmap."
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
              <Label>Major</Label>
              <Input
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="Computer Science"
              />
            </div>
            <div className="space-y-2">
              <Label>Current skills</Label>
              <Input
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="python, sql, git"
              />
            </div>
            <div className="space-y-2">
              <Label>Interests</Label>
              <Input
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="machine learning, web development"
              />
            </div>
          </div>
          <Button onClick={generate} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            <Map className="h-4 w-4" /> Generate roadmap
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Personalized roadmap for <strong>{result.track}</strong>
          </p>
          {result.sections.map((section) => (
            <Card key={section.kind}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge>{section.kind}</Badge> {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.steps.map((step) => (
                  <div
                    key={step.order}
                    className="flex gap-4 rounded-lg border border-border p-4"
                  >
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {step.order}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium">{step.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {step.description}
                      </p>
                      <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" /> {step.duration_weeks} weeks
                      </p>
                      {step.resources.length > 0 && (
                        <ul className="mt-2 text-xs text-muted-foreground">
                          {step.resources.map((r) => (
                            <li key={r}>• {r}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
