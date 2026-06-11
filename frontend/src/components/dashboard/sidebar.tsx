"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  ScanSearch,
  Mic,
  PuzzleIcon,
  Map,
  User,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();

  const nav = [
    { href: "/dashboard", label: t("side.overview"), icon: LayoutDashboard },
    { href: "/dashboard/resume", label: t("side.resume"), icon: FileText },
    { href: "/dashboard/analyzer", label: t("side.analyzer"), icon: ScanSearch },
    { href: "/dashboard/interview", label: t("side.interview"), icon: Mic },
    { href: "/dashboard/skills", label: t("side.skills"), icon: PuzzleIcon },
    { href: "/dashboard/roadmap", label: t("side.roadmap"), icon: Map },
    { href: "/dashboard/profile", label: t("side.profile"), icon: User },
  ];

  return (
    <aside className="hidden w-64 flex-shrink-0 border-e border-border bg-card/40 lg:block">
      <div className="sticky top-0 flex h-screen flex-col">
        <Link href="/" className="flex h-16 items-center gap-2 border-b border-border px-6 font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-4 w-4" />
          </span>
          <span>StudentCareer<span className="gradient-text"> AI</span></span>
        </Link>

        <nav className="flex-1 space-y-1 p-4">
          {nav.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
