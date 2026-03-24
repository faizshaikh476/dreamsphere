"use client";

import { useEffect, useState } from "react";
import { AuthGate } from "@/components/auth/auth-gate";
import { HeatmapGrid } from "@/components/heatmap/heatmap-grid";
import { fetchHeatmap } from "@/lib/api";
import { HeatmapBucket } from "@/types";
import { useToast } from "@/components/providers/toast-provider";

export default function HeatmapPage() {
  const { showToast } = useToast();
  const [buckets, setBuckets] = useState<HeatmapBucket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeatmap()
      .then((data) => setBuckets(data.heatmap))
      .catch((error) =>
        showToast(error instanceof Error ? error.message : "Unable to load heatmap.", "error")
      )
      .finally(() => setLoading(false));
  }, [showToast]);

  return (
    <AuthGate>
      <section className="glass-panel mb-6 p-5">
        <p className="text-sm text-accent">Heatmap</p>
        <h2 className="mt-2 text-2xl font-semibold">What everyone is dreaming about</h2>
        <p className="mt-2 text-sm text-muted">
          Theme intensity reflects total occurrences, with trend slices for the last 24 hours and 7
          days.
        </p>
      </section>
      {loading ? (
        <div className="glass-panel animate-pulse p-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-28 rounded-3xl bg-panelSoft" />
            ))}
          </div>
        </div>
      ) : (
        <HeatmapGrid buckets={buckets} />
      )}
    </AuthGate>
  );
}
