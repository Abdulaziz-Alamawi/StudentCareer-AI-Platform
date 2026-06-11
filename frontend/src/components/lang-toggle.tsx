"use client";

import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function LangToggle() {
  const { toggle, t } = useI18n();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      aria-label="Switch language"
      className="gap-1.5 font-semibold"
    >
      <Languages className="h-4 w-4" />
      {t("lang.toggle")}
    </Button>
  );
}
