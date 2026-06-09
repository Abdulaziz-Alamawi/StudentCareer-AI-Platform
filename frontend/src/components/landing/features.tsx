"use client";

import { motion } from "framer-motion";
import {
  FileText,
  ScanSearch,
  Mic,
  Gauge,
  PuzzleIcon,
  Map,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: FileText,
    title: "Smart Resume Builder",
    desc: "Create, edit, duplicate and export polished resumes with Modern, ATS-friendly, and Professional templates.",
  },
  {
    icon: ScanSearch,
    title: "AI Resume Analyzer",
    desc: "Get ATS, content, formatting and completeness scores with actionable improvement suggestions.",
  },
  {
    icon: Mic,
    title: "AI Interview Simulator",
    desc: "Practice technical, behavioral and scenario questions across 6 career tracks with instant scoring.",
  },
  {
    icon: Gauge,
    title: "Career Readiness Engine",
    desc: "A single 0–100 readiness score combining resume, skills, certifications, projects and interviews.",
  },
  {
    icon: PuzzleIcon,
    title: "Skill Gap Analyzer",
    desc: "Discover exactly which skills, technologies and certifications you're missing for your dream role.",
  },
  {
    icon: Map,
    title: "Career Roadmap Generator",
    desc: "Personalized learning, certification, project and career roadmaps tailored to your goals.",
  },
  {
    icon: LayoutDashboard,
    title: "Unified Dashboard",
    desc: "Track all your analytics, scores and recommendations in one beautiful command center.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Private",
    desc: "JWT authentication, hashed passwords and owner-scoped data keep your information safe.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24">
      <div className="container">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            Everything you need
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">
            One platform for complete career readiness
          </h2>
          <p className="mt-4 text-muted-foreground">
            Nine intelligent modules working together to maximize your employability.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardHeader>
                  <span className="mb-2 flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <CardTitle className="text-lg">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{f.desc}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
