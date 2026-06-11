"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api, CAREER_TRACKS, type Profile } from "@/lib/api";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export default function ProfilePage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [profile, setProfile] = React.useState<Partial<Profile>>({});
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    api
      .getProfile()
      .then(setProfile)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    try {
      const updated = await api.updateProfile(profile);
      setProfile(updated);
      toast.success(t("profile.updated"));
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  const completionFields = [
    profile.headline,
    profile.bio,
    profile.major,
    profile.university,
    profile.graduation_year,
    profile.career_track,
    profile.location,
    profile.linkedin_url,
    profile.github_url,
  ];
  const filled = completionFields.filter((v) => v !== undefined && v !== null && `${v}`.trim() !== "").length;
  const completion = Math.round((filled / completionFields.length) * 100);

  const initials = (user?.full_name || user?.email || "?")
    .trim()
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

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
        showBack
        title={t("profile.title")}
        description={t("profile.desc")}
        action={
          <Button onClick={save} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("common.saveChanges")}
          </Button>
        }
      />

      <Card className="mb-6">
        <CardContent className="flex flex-col gap-5 pt-6 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-500 text-2xl font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-semibold">{user?.full_name || "—"}</p>
            <p className="truncate text-sm text-muted-foreground">{profile.headline || user?.email}</p>
            <div className="mt-3 max-w-sm">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t("profile.completion")}</span>
                <span className="font-semibold">{completion}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-violet-500 transition-all duration-700"
                  style={{ width: `${completion}%` }}
                />
              </div>
              {completion < 100 && (
                <p className="mt-1.5 text-xs text-muted-foreground">{t("profile.completionHint")}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("auth.fullName")}</Label>
              <Input value={user?.full_name ?? ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>{t("auth.email")}</Label>
              <Input value={user?.email ?? ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>{t("profile.headline")}</Label>
              <Input
                value={profile.headline ?? ""}
                onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                placeholder={t("profile.headlinePlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("profile.careerTrack")}</Label>
              <Select
                value={profile.career_track ?? ""}
                onChange={(e) =>
                  setProfile({ ...profile, career_track: e.target.value || undefined })
                }
              >
                <option value="">{t("profile.selectTrack")}</option>
                {CAREER_TRACKS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("profile.major")}</Label>
              <Input
                value={profile.major ?? ""}
                onChange={(e) => setProfile({ ...profile, major: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("profile.university")}</Label>
              <Input
                value={profile.university ?? ""}
                onChange={(e) => setProfile({ ...profile, university: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("profile.gradYear")}</Label>
              <Input
                type="number"
                value={profile.graduation_year ?? ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    graduation_year: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>{t("profile.location")}</Label>
              <Input
                value={profile.location ?? ""}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>LinkedIn URL</Label>
              <Input
                value={profile.linkedin_url ?? ""}
                onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>GitHub URL</Label>
              <Input
                value={profile.github_url ?? ""}
                onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t("profile.bio")}</Label>
            <Textarea
              value={profile.bio ?? ""}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder={t("profile.bioPlaceholder")}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
