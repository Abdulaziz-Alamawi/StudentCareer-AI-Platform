"use client";

import { LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LangToggle } from "@/components/lang-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export function Topbar() {
  const { user, logout } = useAuth();
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border glass px-6">
      <div>
        <p className="text-sm text-muted-foreground">{t("top.welcome")}</p>
        <p className="font-semibold">{user?.full_name ?? t("top.student")}</p>
      </div>
      <div className="flex items-center gap-2">
        <LangToggle />
        <ThemeToggle />
        <span className="hidden h-9 w-9 items-center justify-center rounded-full bg-primary/15 font-semibold text-primary sm:flex">
          {user?.full_name?.charAt(0)?.toUpperCase() ?? "S"}
        </span>
        <Button variant="ghost" size="icon" onClick={logout} aria-label={t("top.logout")}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
