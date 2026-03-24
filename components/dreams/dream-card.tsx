"use client";

import { HeartIcon } from "@heroicons/react/24/outline";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { DreamRecord } from "@/types";
import { compactNumber, formatRelativeDate, initials } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { reactToDream } from "@/lib/api";
import { useToast } from "@/components/providers/toast-provider";
import { useState } from "react";
import Link from "next/link";

export function DreamCard({ dream }: { dream: DreamRecord }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [busyType, setBusyType] = useState<"like" | "same_dream" | null>(null);

  async function onReact(type: "like" | "same_dream") {
    if (!user) {
      showToast("Sign in to react.", "error");
      return;
    }

    setBusyType(type);

    try {
      await reactToDream(dream.id, user.uid, type);
      window.dispatchEvent(new CustomEvent("dream:reacted"));
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Reaction failed.", "error");
    } finally {
      setBusyType(null);
    }
  }

  return (
    <article className="glass-panel overflow-hidden">
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/15 text-sm font-semibold text-accent">
              {initials(dream.user_name || "Dreamer")}
            </div>
            <div>
              <p className="font-medium">{dream.privacy === "anonymous" ? "Anonymous" : dream.user_name}</p>
              <p className="text-xs text-muted">{formatRelativeDate(dream.created_at)}</p>
            </div>
          </div>
          <span className="rounded-full bg-panelSoft px-3 py-1 text-xs capitalize text-muted">
            {dream.ai_emotion}
          </span>
        </div>
      </div>

      <div className="space-y-4 px-5 py-5">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted">Story version</p>
          <p className="leading-7 text-text/95">{dream.story_text}</p>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted">Original entry</p>
          <p className="text-sm leading-6 text-muted">{dream.dream_text}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {dream.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-panelSoft px-3 py-1 text-xs text-accent"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            className="button-secondary flex-1 gap-2"
            disabled={busyType === "like"}
            onClick={() => onReact("like")}
          >
            <HeartIcon className="h-4 w-4" />
            {compactNumber(dream.reactions.like)}
          </button>
          <button
            className="button-secondary flex-1 gap-2"
            disabled={busyType === "same_dream"}
            onClick={() => onReact("same_dream")}
          >
            <SparklesIcon className="h-4 w-4" />
            Same dream {compactNumber(dream.reactions.same_dream)}
          </button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <Link className="text-sm text-accent hover:underline" href={`/similar?dreamId=${dream.id}`}>
            See similar dreams
          </Link>
          <button
            className="text-sm text-muted transition hover:text-text"
            onClick={async () => {
              try {
                if (navigator.share) {
                  await navigator.share({
                    title: "DreamSphere dream",
                    text: dream.story_text,
                    url: `${window.location.origin}/similar?dreamId=${dream.id}`
                  });
                } else {
                  await navigator.clipboard.writeText(
                    `${window.location.origin}/similar?dreamId=${dream.id}`
                  );
                  showToast("Share link copied.");
                }
              } catch {
                showToast("Share was cancelled.", "error");
              }
            }}
            type="button"
          >
            Share
          </button>
        </div>
      </div>
    </article>
  );
}
