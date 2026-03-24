"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { AuthCard } from "@/components/auth/auth-card";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="glass-panel mx-auto mt-12 max-w-xl p-8">
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-32 rounded bg-panelSoft" />
          <div className="h-4 w-full rounded bg-panelSoft" />
          <div className="h-4 w-3/4 rounded bg-panelSoft" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthCard />;
  }

  return <>{children}</>;
}
