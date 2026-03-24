import { DreamMood } from "@/types";

export const moodOptions: DreamMood[] = [
  "fear",
  "happy",
  "confusion",
  "sad",
  "hopeful",
  "curious",
  "calm"
];

export const privacyOptions = [
  { value: "private", label: "Private" },
  { value: "anonymous", label: "Anonymous" },
  { value: "public", label: "Public" }
] as const;
