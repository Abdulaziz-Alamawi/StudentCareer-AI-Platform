"use client";

import * as React from "react";
import { Loader2, Mic, Trophy, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import {
  api,
  CAREER_TRACKS,
  type Question,
  type InterviewResult,
} from "@/lib/api";
import { PageHeader } from "@/components/dashboard/page-header";
import { ScoreRing } from "@/components/dashboard/score-ring";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"];

export default function InterviewPage() {
  const [track, setTrack] = React.useState(CAREER_TRACKS[0].value);
  const [difficulty, setDifficulty] = React.useState("MEDIUM");
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [result, setResult] = React.useState<InterviewResult | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  async function start() {
    setLoading(true);
    setResult(null);
    try {
      const qs = await api.getQuestions({ track, difficulty, limit: 5 });
      setQuestions(qs);
      setAnswers({});
      if (qs.length === 0) toast.info("No questions found for this combination.");
    } catch (e: any) {
      toast.error(e.message ?? "Failed to load questions");
    } finally {
      setLoading(false);
    }
  }

  async function submit() {
    const payload = {
      track,
      difficulty,
      answers: questions.map((q) => ({
        question_id: q.id,
        answer: answers[q.id] || "",
      })),
    };
    if (payload.answers.some((a) => !a.answer.trim())) {
      toast.error("Please answer all questions.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.submitInterview(payload);
      setResult(res);
      toast.success(`Interview scored: ${res.score}/100`);
    } catch (e: any) {
      toast.error(e.message ?? "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="AI Interview Simulator"
        description="Practice real interview questions and get instant scored feedback."
      />

      <Card className="mb-6">
        <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label>Career track</Label>
            <Select value={track} onChange={(e) => setTrack(e.target.value)}>
              {CAREER_TRACKS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex-1 space-y-2">
            <Label>Difficulty</Label>
            <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d.charAt(0) + d.slice(1).toLowerCase()}
                </option>
              ))}
            </Select>
          </div>
          <Button onClick={start} disabled={loading} className="sm:w-40">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Mic className="h-4 w-4" /> Start
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="mb-6 border-primary/40">
          <CardContent className="flex flex-col items-center gap-6 pt-6 sm:flex-row">
            <ScoreRing value={result.score} label="Score" />
            <div className="flex-1">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Trophy className="h-5 w-5 text-amber-500" /> Interview Report
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                You answered {result.total_questions} questions.
              </p>
              {result.improvement_areas.length > 0 && (
                <ul className="mt-3 space-y-1 text-sm">
                  {result.improvement_areas.map((a, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ArrowRight className="mt-0.5 h-4 w-4 text-primary" /> {a}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {questions.length > 0 && (
        <div className="space-y-4">
          {questions.map((q, i) => {
            const fb = result?.per_answer.find((a) => a.question_id === q.id);
            return (
              <Card key={q.id}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">
                      Q{i + 1}. {q.prompt}
                    </CardTitle>
                    <Badge variant="secondary">{q.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={answers[q.id] || ""}
                    onChange={(e) =>
                      setAnswers({ ...answers, [q.id]: e.target.value })
                    }
                    placeholder="Type your answer here..."
                    disabled={!!result}
                    className="min-h-[110px]"
                  />
                  {fb && (
                    <div className="mt-3 rounded-lg bg-secondary/50 p-3 text-sm">
                      <span className="font-semibold">Score: {fb.score}/100</span>
                      <p className="mt-1 text-muted-foreground">{fb.feedback}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {!result && (
            <Button onClick={submit} disabled={submitting} size="lg" className="w-full">
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit answers
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
