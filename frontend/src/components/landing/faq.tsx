"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export function FAQ() {
  const [open, setOpen] = React.useState<number | null>(0);
  const { t } = useI18n();
  const faqs = [1, 2, 3, 4, 5].map((i) => ({
    q: t(`faq.${i}.q`),
    a: t(`faq.${i}.a`),
  }));

  return (
    <section id="faq" className="py-24">
      <div className="container max-w-3xl">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            {t("faq.eyebrow")}
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">{t("faq.title")}</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="rounded-xl border border-border bg-card">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between p-5 text-left font-medium"
              >
                {f.q}
                <ChevronDown
                  className={cn(
                    "h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform",
                    open === i && "rotate-180"
                  )}
                />
              </button>
              {open === i && (
                <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
