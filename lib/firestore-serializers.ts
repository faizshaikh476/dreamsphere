import { DocumentSnapshot, Timestamp } from "firebase-admin/firestore";
import { DreamRecord } from "@/types";

function serializeTimestamp(value: Timestamp | string | undefined) {
  if (!value) {
    return new Date().toISOString();
  }

  if (typeof value === "string") {
    return value;
  }

  return value.toDate().toISOString();
}

export function serializeDream(doc: DocumentSnapshot): DreamRecord {
  const data = doc.data() as Record<string, unknown>;
  const reactions =
    data.reactions && typeof data.reactions === "object"
      ? (data.reactions as Record<string, unknown>)
      : {};

  return {
    id: doc.id,
    user_id: String(data.user_id),
    user_name: String(data.user_name || "Dreamer"),
    dream_text: String(data.dream_text || ""),
    story_text: String(data.story_text || ""),
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    mood: String(data.mood || "calm") as DreamRecord["mood"],
    ai_emotion: String(data.ai_emotion || "calm"),
    privacy: String(data.privacy || "private") as DreamRecord["privacy"],
    created_at: serializeTimestamp(data.created_at as Timestamp | string | undefined),
    reactions: {
      like: Number(reactions.like || 0),
      same_dream: Number(reactions.same_dream || 0)
    }
  };
}
