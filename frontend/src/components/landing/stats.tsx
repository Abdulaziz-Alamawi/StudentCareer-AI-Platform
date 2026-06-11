"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export function Stats() {
  const { t } = useI18n();
  const stats = [
    { value: "9", label: t("stats.modules") },
    { value: "6", label: t("stats.tracks") },
    { value: "100+", label: t("stats.questions") },
    { value: "0–100", label: t("stats.scoring") },
  ];
  return (
    <section id="stats" className="border-y border-border bg-secondary/30 py-16">
      <div className="container">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="text-center"
            >
              <p className="text-4xl font-extrabold gradient-text md:text-5xl">
                {s.value}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
