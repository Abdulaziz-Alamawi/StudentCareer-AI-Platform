"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function Benefits() {
  const { t } = useI18n();
  const benefits = [
    t("benefits.1"),
    t("benefits.2"),
    t("benefits.3"),
    t("benefits.4"),
    t("benefits.5"),
    t("benefits.6"),
  ];
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
            {t("benefits.eyebrow")}
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">
            {t("benefits.title")}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {t("benefits.subtitle")}
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
              <span className="font-semibold">{t("benefits.cardTitle")}</span>
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-500">
                {t("hero.jobReady")}
              </span>
            </div>
            <div className="mb-6 text-5xl font-extrabold gradient-text">78<span className="text-2xl text-muted-foreground">/100</span></div>
            {[
              ["dash.resume", 85],
              ["dash.skills", 72],
              ["dash.projects", 80],
              ["dash.interview", 68],
              ["dash.certifications", 60],
            ].map(([label, val]) => (
              <div key={label as string} className="mb-3">
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>{t(label as string)}</span>
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
