"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote:
      "The AI analyzer showed me exactly why my resume was getting rejected. After fixing the ATS issues, I landed three interviews in a week.",
    name: "Sara M.",
    role: "CS Senior",
  },
  {
    quote:
      "The interview simulator is incredible. I practiced cloud computing scenarios and walked into my AWS interview fully prepared.",
    name: "Omar K.",
    role: "Fresh Graduate",
  },
  {
    quote:
      "The readiness score gave me a clear goal. The roadmap told me exactly what to learn next. I went from 'Developing' to 'Job Ready' in two months.",
    name: "Lina A.",
    role: "Data Science Student",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="border-y border-border bg-secondary/30 py-24">
      <div className="container">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            Loved by students
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">
            Results that speak for themselves
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    “{t.quote}”
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 font-semibold text-primary">
                      {t.name.charAt(0)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
