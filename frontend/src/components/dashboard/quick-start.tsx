"use client";

import Link from "next/link";
import { FileText, ScanLine, PuzzleIcon, Mic, Map, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

const ITEMS = [
  { href: "/dashboard/resume", icon: FileText, titleKey: "dash.qsResumeTitle", descKey: "dash.qsResumeDesc" },
  { href: "/dashboard/analyzer", icon: ScanLine, titleKey: "dash.qsAnalyzerTitle", descKey: "dash.qsAnalyzerDesc" },
  { href: "/dashboard/skills", icon: PuzzleIcon, titleKey: "dash.qsSkillsTitle", descKey: "dash.qsSkillsDesc" },
  { href: "/dashboard/interview", icon: Mic, titleKey: "dash.qsInterviewTitle", descKey: "dash.qsInterviewDesc" },
  { href: "/dashboard/roadmap", icon: Map, titleKey: "dash.qsRoadmapTitle", descKey: "dash.qsRoadmapDesc" },
] as const;

export function QuickStart() {
  const { t, dir } = useI18n();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <Card className="mb-6 border-primary/30 bg-gradient-to-br from-primary/[0.06] to-transparent">
      <CardContent className="p-6">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold">{t("dash.quickStart")}</h2>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
            <Sparkles className="h-3 w-3" />
            {t("dash.poweredByAi")}
          </span>
        </div>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          {t("dash.quickStartDesc")}
        </p>

        <div className="mt-4 flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/[0.04] p-3 text-xs text-muted-foreground">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>{t("dash.aiBanner")}</span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative flex items-start gap-3 rounded-xl border border-border bg-background/60 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <span className="absolute end-3 top-3 inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                <Sparkles className="h-2.5 w-2.5" />
                {t("dash.aiBadge")}
              </span>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 pe-10">
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="truncate">{t(item.titleKey)}</span>
                  <Arrow className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{t(item.descKey)}</p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
