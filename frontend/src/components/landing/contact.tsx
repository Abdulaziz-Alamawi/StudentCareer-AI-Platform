"use client";

import { Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function Contact() {
  const { t } = useI18n();
  return (
    <section id="contact" className="py-24">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-purple-500/10 p-10 text-center md:p-16">
          <div className="absolute left-1/2 top-0 -z-10 h-64 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-[100px]" />
          <h2 className="text-3xl font-bold md:text-4xl">
            {t("contact.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            {t("contact.subtitle")}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register">
              <Button size="lg">
                {t("contact.createFree")} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="mailto:contact@studentcareer.ai">
              <Button size="lg" variant="outline">
                <Mail className="h-4 w-4" /> {t("contact.contactUs")}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
