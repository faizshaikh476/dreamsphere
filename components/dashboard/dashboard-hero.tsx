"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";

export function DashboardHero() {
  const { user } = useAuth();

  return (
    <section className="glass-panel mb-6 overflow-hidden p-6">
      <div className="max-w-2xl">
        <p className="text-sm uppercase tracking-[0.25em] text-accent">Tonight&apos;s patterns</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Capture dreams, turn them into stories, and find people dreaming on your wavelength.
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted sm:text-base">
          DreamSphere gives every dream a second life: structured by AI, connected by shared
          symbols, and discoverable through the social feed.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <Link className="button-primary" href={user ? "/heatmap" : "#"}>
            Explore heatmap
          </Link>
          <Link className="button-secondary" href={user ? "/profile" : "#"}>
            See your profile
          </Link>
        </div>
      </div>
    </section>
  );
}
