"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

/** A locale-aware "back" button. Arrow points in the natural reading direction. */
export function BackButton({ fallback = "/dashboard" }: { fallback?: string }) {
  const router = useRouter();
  const { t, dir } = useI18n();

  function goBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  }

  const Arrow = dir === "rtl" ? ArrowRight : ArrowLeft;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={goBack}
      className="mb-4 -ms-2 gap-1.5 text-muted-foreground hover:text-foreground"
    >
      <Arrow className="h-4 w-4" />
      {t("common.back")}
    </Button>
  );
}
