"use client";

import Link from "next/link";
import { GraduationCap, Menu, X } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LangToggle } from "@/components/lang-toggle";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const { user } = useAuth();
  const { t } = useI18n();

  const links = [
    { href: "#features", label: t("nav.features") },
    { href: "#stats", label: t("nav.impact") },
    { href: "#testimonials", label: t("nav.testimonials") },
    { href: "#faq", label: t("nav.faq") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 glass">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="text-lg">StudentCareer<span className="gradient-text"> AI</span></span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LangToggle />
          <ThemeToggle />
          {user ? (
            <Link href="/dashboard">
              <Button>{t("common.dashboard")}</Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">{t("common.signIn")}</Button>
              </Link>
              <Link href="/register">
                <Button>{t("common.getStarted")}</Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <LangToggle />
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <div className="container flex flex-col gap-3 py-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-muted-foreground"
              >
                {l.label}
              </a>
            ))}
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full">{t("common.signIn")}</Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button className="w-full">{t("common.getStarted")}</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
