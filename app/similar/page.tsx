"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthGate } from "@/components/auth/auth-gate";
import { DreamCard } from "@/components/dreams/dream-card";
import { useToast } from "@/components/providers/toast-provider";
import { fetchSimilarDreams } from "@/lib/api";
import { SimilarDreamMatch } from "@/types";

export default function SimilarPage() {
  const params = useSearchParams();
  const dreamId = params.get("dreamId");
  const { showToast } = useToast();
  const [matches, setMatches] = useState<SimilarDreamMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dreamId) {
      setLoading(false);
      return;
    }

    fetchSimilarDreams(dreamId)
      .then((data) => setMatches(data.matches))
      .catch((error) =>
        showToast(error instanceof Error ? error.message : "Unable to load matches.", "error")
      )
      .finally(() => setLoading(false));
  }, [dreamId, showToast]);

  return (
    <AuthGate>
      <section className="glass-panel mb-6 p-5">
        <p className="text-sm text-accent">Matching</p>
        <h2 className="mt-2 text-2xl font-semibold">People who had similar dreams</h2>
        <p className="mt-2 text-sm text-muted">
          Matches are ranked by shared tags and emotional tone. You can upgrade this later with
          embeddings for deeper semantic similarity.
        </p>
      </section>
      {loading ? (
        <div className="glass-panel animate-pulse p-5">
          <div className="h-24 rounded-3xl bg-panelSoft" />
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <div key={match.dream.id} className="space-y-2">
              <p className="text-sm text-muted">Similarity: {Math.round(match.similarityScore * 100)}%</p>
              <DreamCard dream={match.dream} />
            </div>
          ))}
        </div>
      )}
    </AuthGate>
  );
}
