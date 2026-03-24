import { DreamRecord } from "@/types";

export function computeTagBuckets(dreams: DreamRecord[]) {
  const now = Date.now();
  const dayAgo = now - 24 * 60 * 60 * 1000;
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const buckets = new Map<string, { count: number; trend_24h: number; trend_7d: number }>();

  for (const dream of dreams) {
    const created = new Date(dream.created_at).getTime();

    for (const tag of dream.tags) {
      const current = buckets.get(tag) || { count: 0, trend_24h: 0, trend_7d: 0 };
      current.count += 1;

      if (created >= dayAgo) {
        current.trend_24h += 1;
      }

      if (created >= weekAgo) {
        current.trend_7d += 1;
      }

      buckets.set(tag, current);
    }
  }

  return Array.from(buckets.entries())
    .map(([tag, metrics]) => ({ tag, ...metrics }))
    .sort((a, b) => b.count - a.count);
}

export function getSimilarityScore(source: DreamRecord, target: DreamRecord) {
  const sourceTags = new Set(source.tags);
  const overlap = target.tags.filter((tag) => sourceTags.has(tag)).length;
  const tagScore = overlap / Math.max(source.tags.length, target.tags.length, 1);
  const moodScore = source.ai_emotion === target.ai_emotion ? 0.25 : 0;
  return Number((tagScore + moodScore).toFixed(2));
}
