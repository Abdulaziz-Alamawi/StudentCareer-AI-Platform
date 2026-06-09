"use client";

import * as React from "react";
import { Loader2, Plus, Copy, Trash2, FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { api, type Resume } from "@/lib/api";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const TEMPLATES = [
  { value: "MODERN", label: "Modern" },
  { value: "ATS_FRIENDLY", label: "ATS Friendly" },
  { value: "PROFESSIONAL", label: "Professional" },
];

const emptyContent = () => ({
  personal_info: { full_name: "", email: "", phone: "", location: "", linkedin: "", github: "" },
  summary: "",
  education: [{ institution: "", degree: "", field: "", start_date: "", end_date: "" }],
  experience: [{ company: "", role: "", start_date: "", end_date: "", bullets: [""] }],
  projects: [{ name: "", description: "", tech_stack: [], url: "" }],
  skills: [] as string[],
  certifications: [{ name: "", issuer: "", date: "" }],
  languages: [{ name: "", proficiency: "" }],
  achievements: [""],
});

export default function ResumeBuilderPage() {
  const [resumes, setResumes] = React.useState<Resume[]>([]);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [title, setTitle] = React.useState("My Resume");
  const [template, setTemplate] = React.useState("MODERN");
  const [content, setContent] = React.useState(emptyContent());
  const [skillsInput, setSkillsInput] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

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
    setContent({ ...emptyContent(), ...r.content });
    setSkillsInput((r.content?.skills || []).join(", "));
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
      toast.success("Resume created!");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function save() {
    if (!activeId) return;
    setSaving(true);
    const payload = {
      title,
      template,
      content: {
        ...content,
        skills: skillsInput.split(",").map((s) => s.trim()).filter(Boolean),
      },
    };
    try {
      await api.updateResume(activeId, payload);
      await load();
      toast.success("Resume saved!");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function duplicate() {
    if (!activeId) return;
    try {
      const copy = await api.duplicateResume(activeId);
      await load();
      selectResume(copy);
      toast.success("Resume duplicated!");
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
      toast.success("Resume deleted.");
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  function exportPdf() {
    const c = { ...content, skills: skillsInput.split(",").map((s) => s.trim()).filter(Boolean) };
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
<style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;color:#222}
h1{font-size:24px;margin:0}h2{font-size:14px;text-transform:uppercase;border-bottom:1px solid #ccc;margin-top:20px}
p,li{font-size:13px;line-height:1.5}.contact{font-size:12px;color:#555}</style></head><body>
<h1>${c.personal_info.full_name || "Your Name"}</h1>
<div class="contact">${[c.personal_info.email,c.personal_info.phone,c.personal_info.location].filter(Boolean).join(" · ")}</div>
${c.summary ? `<h2>Summary</h2><p>${c.summary}</p>` : ""}
${c.skills.length ? `<h2>Skills</h2><p>${c.skills.join(", ")}</p>` : ""}
${c.experience.length ? `<h2>Experience</h2>${c.experience.map((e:any)=>`<p><strong>${e.role}</strong> — ${e.company}<br><ul>${(e.bullets||[]).map((b:string)=>`<li>${b}</li>`).join("")}</ul></p>`).join("")}` : ""}
${c.education.length ? `<h2>Education</h2>${c.education.map((e:any)=>`<p><strong>${e.degree}</strong> — ${e.institution}</p>`).join("")}` : ""}
</body></html>`;
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
      w.print();
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Smart Resume Builder"
        description="Create, edit, duplicate and export professional resumes."
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={createNew} disabled={saving}>
              <Plus className="h-4 w-4" /> New
            </Button>
            {activeId && (
              <>
                <Button onClick={save} disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save
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

      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Your Resumes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {resumes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No resumes yet. Create one!</p>
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

        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-4">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="max-w-xs font-semibold"
              />
              <Select value={template} onChange={(e) => setTemplate(e.target.value)}>
                {TEMPLATES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
              <Badge variant="outline">{template.replace("_", " ")}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h3 className="mb-3 font-semibold">Personal Information</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {(["full_name", "email", "phone", "location", "linkedin", "github"] as const).map(
                  (field) => (
                    <div key={field} className="space-y-1">
                      <Label className="capitalize">{field.replace("_", " ")}</Label>
                      <Input
                        value={content.personal_info[field] || ""}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            personal_info: { ...content.personal_info, [field]: e.target.value },
                          })
                        }
                      />
                    </div>
                  )
                )}
              </div>
            </section>

            <section>
              <h3 className="mb-3 font-semibold">Professional Summary</h3>
              <Textarea
                value={content.summary}
                onChange={(e) => setContent({ ...content, summary: e.target.value })}
                placeholder="2–3 sentences about your strengths and goals..."
              />
            </section>

            <section>
              <h3 className="mb-3 font-semibold">Skills</h3>
              <Input
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="python, react, sql, git (comma separated)"
              />
            </section>

            <section>
              <h3 className="mb-3 font-semibold">Experience</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  placeholder="Company"
                  value={content.experience[0]?.company || ""}
                  onChange={(e) => {
                    const exp = [...content.experience];
                    exp[0] = { ...exp[0], company: e.target.value };
                    setContent({ ...content, experience: exp });
                  }}
                />
                <Input
                  placeholder="Role"
                  value={content.experience[0]?.role || ""}
                  onChange={(e) => {
                    const exp = [...content.experience];
                    exp[0] = { ...exp[0], role: e.target.value };
                    setContent({ ...content, experience: exp });
                  }}
                />
              </div>
              <Textarea
                className="mt-3"
                placeholder="Bullet points (one per line)"
                value={(content.experience[0]?.bullets || []).join("\n")}
                onChange={(e) => {
                  const exp = [...content.experience];
                  exp[0] = {
                    ...exp[0],
                    bullets: e.target.value.split("\n"),
                  };
                  setContent({ ...content, experience: exp });
                }}
              />
            </section>

            <section>
              <h3 className="mb-3 font-semibold">Education</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  placeholder="Institution"
                  value={content.education[0]?.institution || ""}
                  onChange={(e) => {
                    const edu = [...content.education];
                    edu[0] = { ...edu[0], institution: e.target.value };
                    setContent({ ...content, education: edu });
                  }}
                />
                <Input
                  placeholder="Degree"
                  value={content.education[0]?.degree || ""}
                  onChange={(e) => {
                    const edu = [...content.education];
                    edu[0] = { ...edu[0], degree: e.target.value };
                    setContent({ ...content, education: edu });
                  }}
                />
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
