export type DreamPrivacy = "private" | "anonymous" | "public";

export type DreamMood =
  | "fear"
  | "happy"
  | "confusion"
  | "sad"
  | "hopeful"
  | "curious"
  | "calm";

export type InteractionType = "like" | "same_dream";

export interface AppUser {
  id: string;
  name: string;
  email: string | null;
  created_at: string;
  avatar_seed: string;
  streak_count?: number;
}

export interface DreamRecord {
  id: string;
  user_id: string;
  user_name?: string;
  dream_text: string;
  story_text: string;
  tags: string[];
  mood: DreamMood;
  ai_emotion: string;
  privacy: DreamPrivacy;
  created_at: string;
  reactions: {
    like: number;
    same_dream: number;
  };
}

export interface DreamFormInput {
  dream_text: string;
  mood: DreamMood;
  privacy: DreamPrivacy;
}

export interface HeatmapBucket {
  tag: string;
  count: number;
  trend_24h: number;
  trend_7d: number;
}

export interface SimilarDreamMatch {
  dream: DreamRecord;
  similarityScore: number;
}
