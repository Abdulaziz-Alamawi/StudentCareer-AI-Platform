"use client";

import Link from "next/link";
import { GraduationCap, ArrowLeft, ArrowRight } from "lucide-react";
import { LangToggle } from "@/components/lang-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useI18n } from "@/lib/i18n";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const { t, dir } = useI18n();
  const Arrow = dir === "rtl" ? ArrowRight : ArrowLeft;
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <Link
        href="/"
        className="absolute start-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <Arrow className="h-4 w-4" />
        {t("auth.backHome")}
      </Link>
      <div className="absolute end-4 top-4 z-20 flex items-center gap-1">
        <LangToggle />
        <ThemeToggle />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-30" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-72 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-bold">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="text-xl">StudentCareer<span className="gradient-text"> AI</span></span>
        </Link>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </main>
  );
}
