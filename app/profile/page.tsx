"use client";

import { useEffect, useState } from "react";
import { AuthGate } from "@/components/auth/auth-gate";
import { ProfileOverview } from "@/components/profile/profile-overview";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/toast-provider";
import { fetchProfile } from "@/lib/api";
import { DreamRecord } from "@/types";

interface ProfileState {
  totalDreams: number;
  topThemes: string[];
  recentDreams: DreamRecord[];
  streak: number;
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<ProfileState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return;
    }

    fetchProfile(user.uid)
      .then((data) => setProfile(data.profile))
      .catch((error) =>
        showToast(error instanceof Error ? error.message : "Unable to load profile.", "error")
      )
      .finally(() => setLoading(false));
  }, [showToast, user]);

  return (
    <AuthGate>
      <section className="glass-panel mb-6 flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-accent">Profile</p>
          <h2 className="mt-2 text-2xl font-semibold">{user?.displayName || "Dreamer"}</h2>
          <p className="mt-2 text-sm text-muted">{user?.email || "Anonymous profile"}</p>
        </div>
        <button className="button-secondary" onClick={() => logout()}>
          Sign out
        </button>
      </section>

      {loading || !profile ? (
        <div className="glass-panel animate-pulse p-5">
          <div className="h-28 rounded-3xl bg-panelSoft" />
        </div>
      ) : (
        <ProfileOverview
          recentDreams={profile.recentDreams}
          streak={profile.streak}
          topThemes={profile.topThemes}
          totalDreams={profile.totalDreams}
        />
      )}
    </AuthGate>
  );
}
