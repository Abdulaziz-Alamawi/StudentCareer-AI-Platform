"use client";

import { motion } from "framer-motion";
import {
  FileText,
  ScanSearch,
  Mic,
  Gauge,
  PuzzleIcon,
  Map,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

export function Features() {
  const { t } = useI18n();
  const features = [
    { icon: FileText, key: "resume" },
    { icon: ScanSearch, key: "analyzer" },
    { icon: Mic, key: "interview" },
    { icon: Gauge, key: "readiness" },
    { icon: PuzzleIcon, key: "skills" },
    { icon: Map, key: "roadmap" },
    { icon: LayoutDashboard, key: "unified" },
    { icon: ShieldCheck, key: "secure" },
  ];
  return (
    <section id="features" className="py-24">
      <div className="container">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            {t("features.eyebrow")}
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">
            {t("features.title")}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {t("features.subtitle")}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardHeader>
                  <span className="mb-2 flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <CardTitle className="text-lg">{t(`features.${f.key}.title`)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{t(`features.${f.key}.desc`)}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
