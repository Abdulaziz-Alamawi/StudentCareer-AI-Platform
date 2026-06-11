"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Password field that always types left-to-right (even in Arabic RTL layout)
 * and syncs browser autofill into React state.
 */
export function PasswordInput({
  className,
  value,
  onChange,
  autoComplete = "current-password",
  placeholder,
  id,
  required,
  name = "password",
}: {
  className?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: "current-password" | "new-password";
  placeholder?: string;
  id?: string;
  required?: boolean;
  name?: string;
}) {
  const ref = React.useRef<HTMLInputElement>(null);
  const [visible, setVisible] = React.useState(false);

  // Browser autofill does not fire onChange — sync DOM value into React state.
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function sync() {
      if (el!.value !== value) onChange(el!.value);
    }

    const t1 = setTimeout(sync, 100);
    const t2 = setTimeout(sync, 500);
    el.addEventListener("input", sync);
    el.addEventListener("change", sync);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      el.removeEventListener("input", sync);
      el.removeEventListener("change", sync);
    };
  }, [onChange, value]);

  return (
    <div className="relative">
      <input
        ref={ref}
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        required={required}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir="ltr"
        className={cn(
          "flex h-10 w-full rounded-lg border border-input bg-background py-2 pe-10 ps-3 text-sm text-left ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setVisible((v) => !v)}
        className="absolute end-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
