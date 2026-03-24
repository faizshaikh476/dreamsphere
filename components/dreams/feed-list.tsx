"use client";

import { useEffect, useRef, useState } from "react";
import { DreamRecord } from "@/types";
import { fetchFeed } from "@/lib/api";
import { DreamCard } from "@/components/dreams/dream-card";
import { useToast } from "@/components/providers/toast-provider";

export function FeedList() {
  const { showToast } = useToast();
  const [dreams, setDreams] = useState<DreamRecord[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  async function load(initial = false) {
    try {
      if (initial) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const data = await fetchFeed(initial ? undefined : nextCursor || undefined);
      setDreams((current) => (initial ? data.dreams : [...current, ...data.dreams]));
      setNextCursor(data.nextCursor);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to load the feed.", "error");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    load(true);

    const reload = () => load(true);
    window.addEventListener("dream:created", reload);
    window.addEventListener("dream:reacted", reload);

    return () => {
      window.removeEventListener("dream:created", reload);
      window.removeEventListener("dream:reacted", reload);
    };
  }, []);

  useEffect(() => {
    if (!loadMoreRef.current || !nextCursor) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loadingMore) {
          load(false);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loadingMore, nextCursor]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array.from({ length: 3 })].map((_, index) => (
          <div key={index} className="glass-panel animate-pulse p-5">
            <div className="h-4 w-1/3 rounded bg-panelSoft" />
            <div className="mt-4 h-4 w-full rounded bg-panelSoft" />
            <div className="mt-2 h-4 w-4/5 rounded bg-panelSoft" />
            <div className="mt-6 flex gap-2">
              <div className="h-8 w-20 rounded-full bg-panelSoft" />
              <div className="h-8 w-24 rounded-full bg-panelSoft" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {dreams.map((dream) => (
        <DreamCard key={dream.id} dream={dream} />
      ))}
      <div ref={loadMoreRef} className="h-10">
        {loadingMore ? <p className="text-center text-sm text-muted">Loading more dreams...</p> : null}
      </div>
    </div>
  );
}
