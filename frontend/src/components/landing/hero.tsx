"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, FileText, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function Hero() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />

      <div className="container relative flex flex-col items-center py-24 text-center md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm"
        >
          <Sparkles className="h-4 w-4 text-primary" />
          {t("hero.badge")}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl"
        >
          {t("hero.titleA")}{" "}
          <span className="gradient-text">{t("hero.titleHighlight")}</span>{" "}
          {t("hero.titleB")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col gap-3 sm:flex-row"
        >
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto">
              {t("common.startFree")} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              {t("hero.exploreFeatures")}
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
            { icon: FileText, title: t("hero.cardResume"), value: "92/100" },
            { icon: Target, title: t("hero.cardReadiness"), value: t("hero.jobReady") },
            { icon: Sparkles, title: t("hero.cardCoverage"), value: "85%" },
          ].map((c) => (
            <div
              key={c.title}
              className="group rounded-xl border border-border bg-card p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              <c.icon className="mb-3 h-6 w-6 text-primary transition-transform group-hover:scale-110" />
              <p className="text-sm text-muted-foreground">{c.title}</p>
              <p className="text-2xl font-bold">{c.value}</p>
            </div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-xs uppercase tracking-widest text-muted-foreground"
        >
          {t("hero.trust")}
        </motion.p>
      </div>
    </section>
  );
}
