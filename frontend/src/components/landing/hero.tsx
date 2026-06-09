"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, FileText, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />

      <div className="container relative flex flex-col items-center py-24 text-center md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm"
        >
          <Sparkles className="h-4 w-4 text-primary" />
          AI-powered career intelligence for students
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl"
        >
          Become <span className="gradient-text">job-ready</span> before you graduate
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          Build powerful resumes, get AI-driven analysis, practice interviews, measure
          your career readiness, close skill gaps, and follow a personalized roadmap —
          all in one intelligent platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col gap-3 sm:flex-row"
        >
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto">
              Start free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Explore features
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {[
            { icon: FileText, title: "Resume Score", value: "92/100" },
            { icon: Target, title: "Career Readiness", value: "Job Ready" },
            { icon: Sparkles, title: "Skill Coverage", value: "85%" },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-xl border border-border bg-card p-5 text-left shadow-sm"
            >
              <c.icon className="mb-3 h-6 w-6 text-primary" />
              <p className="text-sm text-muted-foreground">{c.title}</p>
              <p className="text-2xl font-bold">{c.value}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
