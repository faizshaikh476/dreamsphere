import { auth } from "@/lib/firebase/client";
import { DreamFormInput, DreamRecord, HeatmapBucket, SimilarDreamMatch } from "@/types";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || "Something went wrong.");
  }

  return response.json();
}

async function authHeaders() {
  const token = await auth.currentUser?.getIdToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export async function submitDream(input: DreamFormInput & { userId: string }) {
  const response = await fetch("/api/dreams/process", {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(input)
  });

  return handleResponse<{ dream: DreamRecord }>(response);
}

export async function fetchFeed(cursor?: string) {
  const query = new URLSearchParams();

  if (cursor) {
    query.set("cursor", cursor);
  }

  const response = await fetch(`/api/dreams/feed?${query.toString()}`, {
    cache: "no-store"
  });

  return handleResponse<{ dreams: DreamRecord[]; nextCursor: string | null }>(response);
}

export async function reactToDream(dreamId: string, userId: string, type: "like" | "same_dream") {
  const response = await fetch("/api/interactions", {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({ dreamId, userId, type })
  });

  return handleResponse<{ success: true }>(response);
}

export async function fetchHeatmap() {
  const response = await fetch("/api/dreams/heatmap", {
    cache: "no-store"
  });

  return handleResponse<{ heatmap: HeatmapBucket[] }>(response);
}

export async function fetchSimilarDreams(dreamId: string) {
  const response = await fetch(`/api/dreams/similar?dreamId=${dreamId}`, {
    cache: "no-store"
  });

  return handleResponse<{ matches: SimilarDreamMatch[] }>(response);
}

export async function fetchProfile(userId: string) {
  const response = await fetch(`/api/profile?userId=${userId}`, {
    headers: await authHeaders(),
    cache: "no-store"
  });

  return handleResponse<{
    profile: {
      totalDreams: number;
      topThemes: string[];
      recentDreams: DreamRecord[];
      streak: number;
    };
  }>(response);
}
