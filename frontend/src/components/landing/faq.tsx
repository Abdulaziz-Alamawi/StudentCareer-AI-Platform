"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Is StudentCareer AI free to use?",
    a: "Yes — the core modules (resume builder, analyzer, interview simulator, readiness engine and roadmaps) are available to every registered student.",
  },
  {
    q: "How does the AI scoring work?",
    a: "Our AI Engine uses explainable machine-learning techniques (TF-IDF, cosine similarity and weighted scoring) to evaluate resumes, skills and interview answers. Every score comes with the reasons behind it.",
  },
  {
    q: "Which career tracks are supported?",
    a: "Software Engineering, Artificial Intelligence, Cloud Computing, IT Infrastructure, Data Science and Business Analysis.",
  },
  {
    q: "Will it help me beat applicant tracking systems (ATS)?",
    a: "Absolutely. The analyzer checks for ATS-critical sections, contact info and keyword coverage, then tells you exactly what to fix.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. We use JWT authentication, bcrypt-hashed passwords and owner-scoped access so only you can see your data.",
  },
];

export function FAQ() {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <section id="faq" className="py-24">
      <div className="container max-w-3xl">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            FAQ
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">Frequently asked questions</h2>
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
