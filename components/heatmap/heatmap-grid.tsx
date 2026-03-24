"use client";

import { HeatmapBucket } from "@/types";

export function HeatmapGrid({ buckets }: { buckets: HeatmapBucket[] }) {
  const highest = buckets[0]?.count || 1;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {buckets.map((bucket) => {
        const intensity = Math.max(0.2, bucket.count / highest);

        return (
          <div
            key={bucket.tag}
            className="rounded-3xl border border-border p-4"
            style={{
              background: `linear-gradient(160deg, rgba(120, 230, 208, ${intensity * 0.26}), rgba(14, 26, 43, 0.92))`
            }}
          >
            <p className="text-sm text-muted">#{bucket.tag}</p>
            <p className="mt-2 text-2xl font-semibold">{bucket.count}</p>
            <div className="mt-4 text-xs text-muted">
              <p>24h: {bucket.trend_24h}</p>
              <p>7d: {bucket.trend_7d}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
