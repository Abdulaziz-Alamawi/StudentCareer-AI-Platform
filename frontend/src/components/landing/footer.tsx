"use client";

import Link from "next/link";
import { GraduationCap, Github, Linkedin } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-border bg-secondary/20">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="h-4 w-4" />
              </span>
              StudentCareer AI
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              {t("footer.tagline")}
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">{t("footer.product")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground">{t("nav.features")}</a></li>
              <li><a href="#stats" className="hover:text-foreground">{t("nav.impact")}</a></li>
              <li><a href="#faq" className="hover:text-foreground">{t("nav.faq")}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">{t("footer.account")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/login" className="hover:text-foreground">{t("common.signIn")}</Link></li>
              <li><Link href="/register" className="hover:text-foreground">{t("footer.getStarted")}</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground">{t("common.dashboard")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">{t("footer.connect")}</h4>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-accent"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-accent"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} StudentCareer AI Platform. {t("footer.rights")}</p>
          <p>{t("footer.builtBy")}</p>
        </div>
      </div>
    </footer>
  );
}
