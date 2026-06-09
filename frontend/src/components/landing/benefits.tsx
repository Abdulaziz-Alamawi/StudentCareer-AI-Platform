"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const benefits = [
  "Know exactly where you stand with a single readiness score",
  "Beat applicant tracking systems with ATS-optimized resumes",
  "Walk into interviews confident and well-practiced",
  "Stop guessing — follow a data-driven learning roadmap",
  "Build a portfolio of the right projects and certifications",
  "Explainable AI: every score comes with clear reasons",
];

export function Benefits() {
  return (
    <section className="py-24">
      <div className="container grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            Why StudentCareer AI
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">
            Turn uncertainty into a clear plan
          </h2>
          <p className="mt-4 text-muted-foreground">
            Most students don't know if they're ready for the job market. We replace
            anxiety with measurable, actionable insight.
          </p>
          <ul className="mt-8 space-y-4">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <span className="text-sm">{b}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-primary/20 to-purple-500/20 blur-2xl" />
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-semibold">Career Readiness</span>
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-500">
                Job Ready
              </span>
            </div>
            <div className="mb-6 text-5xl font-extrabold gradient-text">78<span className="text-2xl text-muted-foreground">/100</span></div>
            {[
              ["Resume", 85],
              ["Skills", 72],
              ["Projects", 80],
              ["Interview", 68],
              ["Certifications", 60],
            ].map(([label, val]) => (
              <div key={label as string} className="mb-3">
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>{label}</span>
                  <span>{val}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
