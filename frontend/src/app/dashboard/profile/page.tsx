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

export default function ProfilePage() {
  const { user } = useAuth();
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
      toast.success("Profile updated!");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
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
        title="Profile"
        description="Manage your personal and career information."
        action={
          <Button onClick={save} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        }
      />

      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Full name</Label>
              <Input value={user?.full_name ?? ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email ?? ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>Headline</Label>
              <Input
                value={profile.headline ?? ""}
                onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                placeholder="CS Student | Aspiring Software Engineer"
              />
            </div>
            <div className="space-y-2">
              <Label>Career track</Label>
              <Select
                value={profile.career_track ?? ""}
                onChange={(e) =>
                  setProfile({ ...profile, career_track: e.target.value || undefined })
                }
              >
                <option value="">Select track</option>
                {CAREER_TRACKS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Major</Label>
              <Input
                value={profile.major ?? ""}
                onChange={(e) => setProfile({ ...profile, major: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>University</Label>
              <Input
                value={profile.university ?? ""}
                onChange={(e) => setProfile({ ...profile, university: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Graduation year</Label>
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
              <Label>Location</Label>
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
            <Label>Bio</Label>
            <Textarea
              value={profile.bio ?? ""}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Tell us about yourself..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
