"use client";

import { LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border glass px-6">
      <div>
        <p className="text-sm text-muted-foreground">Welcome back,</p>
        <p className="font-semibold">{user?.full_name ?? "Student"}</p>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <span className="hidden h-9 w-9 items-center justify-center rounded-full bg-primary/15 font-semibold text-primary sm:flex">
          {user?.full_name?.charAt(0)?.toUpperCase() ?? "S"}
        </span>
        <Button variant="ghost" size="icon" onClick={logout} aria-label="Logout">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
