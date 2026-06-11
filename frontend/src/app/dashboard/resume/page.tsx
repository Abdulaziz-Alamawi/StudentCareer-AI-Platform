"use client";

import * as React from "react";
import { Loader2, Plus, Copy, Trash2, FileText, Download, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { api, CAREER_TRACKS, type Resume, type AnalysisResult } from "@/lib/api";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/dashboard/score-ring";
import { useI18n } from "@/lib/i18n";

const TEMPLATES = [
  { value: "MODERN", label: "Modern" },
  { value: "ATS_FRIENDLY", label: "ATS Friendly" },
  { value: "PROFESSIONAL", label: "Professional" },
];

const emptyContent = () => ({
  personal_info: { full_name: "", email: "", phone: "", location: "", linkedin: "", github: "", website: "" },
  summary: "",
  education: [{ institution: "", degree: "", field: "", start_date: "", end_date: "", gpa: "" }],
  experience: [{ company: "", role: "", start_date: "", end_date: "", location: "", bullets: [""] }],
  projects: [{ name: "", description: "", tech_stack: [] as string[], url: "" }],
  skills: [] as string[],
  certifications: [{ name: "", issuer: "", date: "" }],
  languages: [{ name: "", proficiency: "" }],
  achievements: [] as string[],
});

type Content = ReturnType<typeof emptyContent>;

export default function ResumeBuilderPage() {
  const { t } = useI18n();
  const [resumes, setResumes] = React.useState<Resume[]>([]);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [title, setTitle] = React.useState("My Resume");
  const [template, setTemplate] = React.useState("MODERN");
  const [content, setContent] = React.useState<Content>(emptyContent());
  const [skillsInput, setSkillsInput] = React.useState("");
  const [achievementsInput, setAchievementsInput] = React.useState("");
  const [targetTrack, setTargetTrack] = React.useState(CAREER_TRACKS[0].value);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [analyzing, setAnalyzing] = React.useState(false);
  const [score, setScore] = React.useState<AnalysisResult | null>(null);

  const load = React.useCallback(async () => {
    try {
      const list = await api.listResumes();
      setResumes(list);
      if (list.length > 0 && !activeId) {
        selectResume(list[0]);
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [activeId]);

  React.useEffect(() => {
    load();
  }, [load]);

  function selectResume(r: Resume) {
    setActiveId(r.id);
    setTitle(r.title);
    setTemplate(r.template);
    const merged = { ...emptyContent(), ...r.content };
    setContent(merged);
    setSkillsInput((r.content?.skills || []).join(", "));
    setAchievementsInput((r.content?.achievements || []).join("\n"));
    setScore(null);
  }

  function buildPayloadContent() {
    return {
      ...content,
      skills: skillsInput.split(",").map((s) => s.trim()).filter(Boolean),
      achievements: achievementsInput.split("\n").map((s) => s.trim()).filter(Boolean),
    };
  }

  async function createNew() {
    setSaving(true);
    try {
      const r = await api.createResume({
        title: "Untitled Resume",
        template: "MODERN",
        content: emptyContent(),
      });
      await load();
      selectResume(r);
      toast.success(t("resume.created"));
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function save() {
    if (!activeId) return;
    setSaving(true);
    try {
      await api.updateResume(activeId, { title, template, content: buildPayloadContent() });
      await load();
      toast.success(t("resume.saved"));
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function analyzeAndScore() {
    if (!activeId) {
      toast.error(t("resume.selectFirst"));
      return;
    }
    setAnalyzing(true);
    try {
      // Save first so the stored resume reflects the latest edits, then score it.
      await api.updateResume(activeId, { title, template, content: buildPayloadContent() });
      const res = await api.analyzeResume({ resume_id: activeId, target_track: targetTrack });
      setScore(res);
      await load();
      toast.success(t("resume.scoreSaved"));
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setAnalyzing(false);
    }
  }

  async function duplicate() {
    if (!activeId) return;
    try {
      const copy = await api.duplicateResume(activeId);
      await load();
      selectResume(copy);
      toast.success(t("resume.duplicated"));
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  async function remove() {
    if (!activeId) return;
    try {
      await api.deleteResume(activeId);
      setActiveId(null);
      setContent(emptyContent());
      await load();
      toast.success(t("resume.deleted"));
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  function exportPdf() {
    const c = buildPayloadContent();
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
<style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;color:#222}
h1{font-size:24px;margin:0}h2{font-size:14px;text-transform:uppercase;border-bottom:1px solid #ccc;margin-top:20px}
p,li{font-size:13px;line-height:1.5}.contact{font-size:12px;color:#555}</style></head><body>
<h1>${c.personal_info.full_name || "Your Name"}</h1>
<div class="contact">${[c.personal_info.email,c.personal_info.phone,c.personal_info.location].filter(Boolean).join(" · ")}</div>
${c.summary ? `<h2>Summary</h2><p>${c.summary}</p>` : ""}
${c.skills.length ? `<h2>Skills</h2><p>${c.skills.join(", ")}</p>` : ""}
${c.experience.some((e)=>e.role||e.company) ? `<h2>Experience</h2>${c.experience.filter((e)=>e.role||e.company).map((e)=>`<p><strong>${e.role}</strong> — ${e.company}<br><ul>${(e.bullets||[]).filter(Boolean).map((b)=>`<li>${b}</li>`).join("")}</ul></p>`).join("")}` : ""}
${c.projects.some((p)=>p.name) ? `<h2>Projects</h2>${c.projects.filter((p)=>p.name).map((p)=>`<p><strong>${p.name}</strong><br>${p.description}</p>`).join("")}` : ""}
${c.education.some((e)=>e.institution||e.degree) ? `<h2>Education</h2>${c.education.filter((e)=>e.institution||e.degree).map((e)=>`<p><strong>${e.degree}</strong> — ${e.institution}</p>`).join("")}` : ""}
${c.certifications.some((cc)=>cc.name) ? `<h2>Certifications</h2>${c.certifications.filter((cc)=>cc.name).map((cc)=>`<p>${cc.name} — ${cc.issuer}</p>`).join("")}` : ""}
${c.languages.some((l)=>l.name) ? `<h2>Languages</h2><p>${c.languages.filter((l)=>l.name).map((l)=>`${l.name} (${l.proficiency})`).join(", ")}</p>` : ""}
${c.achievements.length ? `<h2>Achievements</h2><ul>${c.achievements.map((a)=>`<li>${a}</li>`).join("")}</ul>` : ""}
</body></html>`;
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
      w.print();
    }
  }

  // ---- Generic array helpers ----
  function updateItem<K extends keyof Content>(key: K, idx: number, patch: any) {
    const arr = [...(content[key] as any[])];
    arr[idx] = { ...arr[idx], ...patch };
    setContent({ ...content, [key]: arr });
  }
  function addItem<K extends keyof Content>(key: K, blank: any) {
    setContent({ ...content, [key]: [...(content[key] as any[]), blank] });
  }
  function removeItem<K extends keyof Content>(key: K, idx: number) {
    const arr = (content[key] as any[]).filter((_, i) => i !== idx);
    setContent({ ...content, [key]: arr.length ? arr : (content[key] as any[]) });
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const sectionTitle = "mb-3 flex items-center justify-between";
  const addBtn = (key: keyof Content, blank: any) => (
    <Button type="button" variant="ghost" size="sm" onClick={() => addItem(key, blank)}>
      <Plus className="h-4 w-4" /> {t("resume.addEntry")}
    </Button>
  );

  return (
    <div>
      <PageHeader
        showBack
        title={t("resume.title")}
        description={t("resume.desc")}
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={createNew} disabled={saving}>
              <Plus className="h-4 w-4" /> {t("common.new")}
            </Button>
            {activeId && (
              <>
                <Button onClick={save} disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {t("common.save")}
                </Button>
                <Button variant="outline" onClick={duplicate}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={exportPdf}>
                  <Download className="h-4 w-4" /> PDF
                </Button>
                <Button variant="destructive" size="icon" onClick={remove}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">{t("resume.yourResumes")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {resumes.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("resume.none")}</p>
            ) : (
              resumes.map((r) => (
                <button
                  key={r.id}
                  onClick={() => selectResume(r)}
                  className={`flex w-full items-center gap-2 rounded-lg border p-3 text-left text-sm transition-colors ${
                    activeId === r.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-accent"
                  }`}
                >
                  <FileText className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{r.title}</span>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-4">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="max-w-xs font-semibold"
              />
              <Select value={template} onChange={(e) => setTemplate(e.target.value)}>
                {TEMPLATES.map((tp) => (
                  <option key={tp.value} value={tp.value}>
                    {tp.label}
                  </option>
                ))}
              </Select>
              <Badge variant="outline">{template.replace("_", " ")}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal info */}
            <section>
              <h3 className="mb-3 font-semibold">{t("resume.personalInfo")}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {(["full_name", "email", "phone", "location", "linkedin", "github", "website"] as const).map(
                  (fieldKey) => (
                    <div key={fieldKey} className="space-y-1">
                      <Label className="capitalize">{fieldKey.replace("_", " ")}</Label>
                      <Input
                        value={(content.personal_info as any)[fieldKey] || ""}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            personal_info: { ...content.personal_info, [fieldKey]: e.target.value },
                          })
                        }
                      />
                    </div>
                  )
                )}
              </div>
            </section>

            {/* Summary */}
            <section>
              <h3 className="mb-3 font-semibold">{t("resume.summary")}</h3>
              <Textarea
                value={content.summary}
                onChange={(e) => setContent({ ...content, summary: e.target.value })}
                placeholder={t("resume.summaryPlaceholder")}
              />
            </section>

            {/* Skills */}
            <section>
              <h3 className="mb-3 font-semibold">{t("resume.skills")}</h3>
              <Input
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder={t("resume.skillsPlaceholder")}
              />
            </section>

            {/* Experience (multi) */}
            <section>
              <div className={sectionTitle}>
                <h3 className="font-semibold">{t("resume.experience")}</h3>
                {addBtn("experience", { company: "", role: "", start_date: "", end_date: "", location: "", bullets: [""] })}
              </div>
              <div className="space-y-4">
                {content.experience.map((exp, i) => (
                  <div key={i} className="rounded-lg border border-border p-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input placeholder={t("resume.company")} value={exp.company}
                        onChange={(e) => updateItem("experience", i, { company: e.target.value })} />
                      <Input placeholder={t("resume.role")} value={exp.role}
                        onChange={(e) => updateItem("experience", i, { role: e.target.value })} />
                      <Input placeholder={t("resume.startDate")} value={exp.start_date}
                        onChange={(e) => updateItem("experience", i, { start_date: e.target.value })} />
                      <Input placeholder={t("resume.endDate")} value={exp.end_date}
                        onChange={(e) => updateItem("experience", i, { end_date: e.target.value })} />
                    </div>
                    <Textarea className="mt-3" placeholder={t("resume.bullets")}
                      value={(exp.bullets || []).join("\n")}
                      onChange={(e) => updateItem("experience", i, { bullets: e.target.value.split("\n") })} />
                    {content.experience.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" className="mt-2 text-destructive"
                        onClick={() => removeItem("experience", i)}>
                        <Trash2 className="h-3.5 w-3.5" /> {t("resume.remove")}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Education (multi) */}
            <section>
              <div className={sectionTitle}>
                <h3 className="font-semibold">{t("resume.education")}</h3>
                {addBtn("education", { institution: "", degree: "", field: "", start_date: "", end_date: "", gpa: "" })}
              </div>
              <div className="space-y-4">
                {content.education.map((edu, i) => (
                  <div key={i} className="rounded-lg border border-border p-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input placeholder={t("resume.institution")} value={edu.institution}
                        onChange={(e) => updateItem("education", i, { institution: e.target.value })} />
                      <Input placeholder={t("resume.degree")} value={edu.degree}
                        onChange={(e) => updateItem("education", i, { degree: e.target.value })} />
                      <Input placeholder={t("resume.field")} value={edu.field}
                        onChange={(e) => updateItem("education", i, { field: e.target.value })} />
                      <Input placeholder="GPA" value={edu.gpa}
                        onChange={(e) => updateItem("education", i, { gpa: e.target.value })} />
                    </div>
                    {content.education.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" className="mt-2 text-destructive"
                        onClick={() => removeItem("education", i)}>
                        <Trash2 className="h-3.5 w-3.5" /> {t("resume.remove")}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Projects (multi) — NEW */}
            <section>
              <div className={sectionTitle}>
                <h3 className="font-semibold">{t("resume.projects")}</h3>
                {addBtn("projects", { name: "", description: "", tech_stack: [], url: "" })}
              </div>
              <div className="space-y-4">
                {content.projects.map((proj, i) => (
                  <div key={i} className="rounded-lg border border-border p-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input placeholder={t("resume.projectName")} value={proj.name}
                        onChange={(e) => updateItem("projects", i, { name: e.target.value })} />
                      <Input placeholder={t("resume.url")} value={proj.url}
                        onChange={(e) => updateItem("projects", i, { url: e.target.value })} />
                    </div>
                    <Textarea className="mt-3" placeholder={t("resume.projectDesc")} value={proj.description}
                      onChange={(e) => updateItem("projects", i, { description: e.target.value })} />
                    <Input className="mt-3" placeholder={t("resume.techStack")}
                      value={(proj.tech_stack || []).join(", ")}
                      onChange={(e) => updateItem("projects", i, { tech_stack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} />
                    {content.projects.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" className="mt-2 text-destructive"
                        onClick={() => removeItem("projects", i)}>
                        <Trash2 className="h-3.5 w-3.5" /> {t("resume.remove")}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Certifications (multi) — NEW */}
            <section>
              <div className={sectionTitle}>
                <h3 className="font-semibold">{t("resume.certifications")}</h3>
                {addBtn("certifications", { name: "", issuer: "", date: "" })}
              </div>
              <div className="space-y-3">
                {content.certifications.map((cert, i) => (
                  <div key={i} className="grid gap-3 sm:grid-cols-3">
                    <Input placeholder={t("resume.certName")} value={cert.name}
                      onChange={(e) => updateItem("certifications", i, { name: e.target.value })} />
                    <Input placeholder={t("resume.issuer")} value={cert.issuer}
                      onChange={(e) => updateItem("certifications", i, { issuer: e.target.value })} />
                    <div className="flex gap-2">
                      <Input placeholder={t("resume.date")} value={cert.date}
                        onChange={(e) => updateItem("certifications", i, { date: e.target.value })} />
                      {content.certifications.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" className="text-destructive"
                          onClick={() => removeItem("certifications", i)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Languages (multi) — NEW */}
            <section>
              <div className={sectionTitle}>
                <h3 className="font-semibold">{t("resume.languages")}</h3>
                {addBtn("languages", { name: "", proficiency: "" })}
              </div>
              <div className="space-y-3">
                {content.languages.map((lang, i) => (
                  <div key={i} className="flex gap-2">
                    <Input placeholder={t("resume.langName")} value={lang.name}
                      onChange={(e) => updateItem("languages", i, { name: e.target.value })} />
                    <Input placeholder={t("resume.proficiency")} value={lang.proficiency}
                      onChange={(e) => updateItem("languages", i, { proficiency: e.target.value })} />
                    {content.languages.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" className="text-destructive"
                        onClick={() => removeItem("languages", i)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Achievements — NEW */}
            <section>
              <h3 className="mb-3 font-semibold">{t("resume.achievements")}</h3>
              <Textarea
                value={achievementsInput}
                onChange={(e) => setAchievementsInput(e.target.value)}
                placeholder={t("resume.achievementsPlaceholder")}
              />
            </section>
          </CardContent>
        </Card>

        {/* Right column: live preview + analyze & score */}
        <div className="space-y-6 lg:col-span-4">
          <Card className="border-primary/30 bg-gradient-to-br from-primary/[0.06] to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-primary" /> {t("resume.analyzeScore")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">{t("resume.targetTrack")}</Label>
                <Select value={targetTrack} onChange={(e) => setTargetTrack(e.target.value)}>
                  {CAREER_TRACKS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </div>
              <Button onClick={analyzeAndScore} disabled={analyzing || !activeId} className="w-full">
                {analyzing && <Loader2 className="h-4 w-4 animate-spin" />}
                <Sparkles className="h-4 w-4" /> {t("resume.analyzeScore")}
              </Button>
              {score ? (
                <div className="flex flex-col items-center pt-2">
                  <ScoreRing value={score.overall_score} label={t("resume.scoreResult")} size={120} />
                  <div className="mt-3 grid w-full grid-cols-2 gap-2 text-center text-xs">
                    <div className="rounded-lg bg-secondary/50 p-2">
                      <p className="text-muted-foreground">ATS</p>
                      <p className="font-bold">{Math.round(score.ats_score)}</p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-2">
                      <p className="text-muted-foreground">{t("analyzer.completeness")}</p>
                      <p className="font-bold">{Math.round(score.completeness_score)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">{t("resume.scoreHint")}</p>
              )}
            </CardContent>
          </Card>

          <Card className="lg:sticky lg:top-6">
            <CardHeader>
              <CardTitle className="text-base">{t("resume.preview")}</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const skillList = skillsInput.split(",").map((s) => s.trim()).filter(Boolean);
                const achList = achievementsInput.split("\n").map((s) => s.trim()).filter(Boolean);
                const pi = content.personal_info;
                const exp = content.experience.filter((e) => e.role || e.company);
                const edu = content.education.filter((e) => e.institution || e.degree);
                const proj = content.projects.filter((p) => p.name);
                const certs = content.certifications.filter((c) => c.name);
                const langs = content.languages.filter((l) => l.name);
                const hasAny =
                  pi.full_name || pi.email || content.summary || skillList.length > 0 ||
                  exp.length || edu.length || proj.length || certs.length || langs.length || achList.length;
                if (!hasAny) {
                  return <p className="py-8 text-center text-sm text-muted-foreground">{t("resume.previewEmpty")}</p>;
                }
                const Section = ({ title: ti, children }: { title: string; children: React.ReactNode }) => (
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">{ti}</p>
                    <div className="mt-1">{children}</div>
                  </div>
                );
                return (
                  <div className="max-h-[70vh] space-y-3 overflow-auto rounded-lg border border-border bg-background p-5 text-sm" dir="ltr">
                    <div className="border-b border-border pb-3">
                      <p className="text-lg font-bold">{pi.full_name || "Your Name"}</p>
                      <p className="text-xs text-muted-foreground">
                        {[pi.email, pi.phone, pi.location].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    {content.summary && <Section title="Summary"><p className="text-xs leading-relaxed">{content.summary}</p></Section>}
                    {skillList.length > 0 && (
                      <Section title="Skills">
                        <div className="flex flex-wrap gap-1">
                          {skillList.map((s) => <span key={s} className="rounded bg-secondary px-2 py-0.5 text-xs">{s}</span>)}
                        </div>
                      </Section>
                    )}
                    {exp.length > 0 && (
                      <Section title="Experience">
                        {exp.map((e, i) => (
                          <div key={i} className="mb-1">
                            <p className="text-xs font-medium">{e.role}{e.company ? ` — ${e.company}` : ""}</p>
                            <ul className="list-disc ps-4 text-xs text-muted-foreground">
                              {(e.bullets || []).filter(Boolean).map((b, j) => <li key={j}>{b}</li>)}
                            </ul>
                          </div>
                        ))}
                      </Section>
                    )}
                    {proj.length > 0 && (
                      <Section title="Projects">
                        {proj.map((p, i) => (
                          <p key={i} className="text-xs"><span className="font-medium">{p.name}</span>{p.description ? ` — ${p.description}` : ""}</p>
                        ))}
                      </Section>
                    )}
                    {edu.length > 0 && (
                      <Section title="Education">
                        {edu.map((e, i) => <p key={i} className="text-xs">{e.degree}{e.institution ? ` — ${e.institution}` : ""}</p>)}
                      </Section>
                    )}
                    {certs.length > 0 && (
                      <Section title="Certifications">
                        {certs.map((c, i) => <p key={i} className="text-xs">{c.name}{c.issuer ? ` — ${c.issuer}` : ""}</p>)}
                      </Section>
                    )}
                    {langs.length > 0 && (
                      <Section title="Languages">
                        <p className="text-xs">{langs.map((l) => `${l.name}${l.proficiency ? ` (${l.proficiency})` : ""}`).join(", ")}</p>
                      </Section>
                    )}
                    {achList.length > 0 && (
                      <Section title="Achievements">
                        <ul className="list-disc ps-4 text-xs text-muted-foreground">
                          {achList.map((a, i) => <li key={i}>{a}</li>)}
                        </ul>
                      </Section>
                    )}
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
