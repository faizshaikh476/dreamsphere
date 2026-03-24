"use client";

import { compactNumber } from "@/lib/utils";
import { DreamRecord } from "@/types";

export function ProfileOverview({
  totalDreams,
  topThemes,
  streak,
  recentDreams
}: {
  totalDreams: number;
  topThemes: string[];
  streak: number;
  recentDreams: DreamRecord[];
}) {
  return (
    <div className="space-y-6">
      <section className="grid grid-cols-3 gap-3">
        <div className="glass-panel p-4">
          <p className="text-sm text-muted">Dreams logged</p>
          <p className="mt-2 text-2xl font-semibold">{compactNumber(totalDreams)}</p>
        </div>
        <div className="glass-panel p-4">
          <p className="text-sm text-muted">Streak</p>
          <p className="mt-2 text-2xl font-semibold">{streak} days</p>
        </div>
        <div className="glass-panel p-4">
          <p className="text-sm text-muted">Themes</p>
          <p className="mt-2 text-2xl font-semibold">{topThemes.length}</p>
        </div>
      </section>

      <section className="glass-panel p-5">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Common themes</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {topThemes.map((theme) => (
            <span
              key={theme}
              className="rounded-full border border-border bg-panelSoft px-3 py-1 text-sm text-accent"
            >
              #{theme}
            </span>
          ))}
        </div>
      </section>

      <section className="glass-panel p-5">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Recent public dreams</p>
        <div className="mt-4 space-y-4">
          {recentDreams.map((dream) => (
            <div key={dream.id} className="rounded-2xl border border-border bg-panelSoft p-4">
              <p className="text-sm leading-6 text-text/90">{dream.story_text}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {dream.tags.map((tag) => (
                  <span key={tag} className="text-xs text-muted">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
