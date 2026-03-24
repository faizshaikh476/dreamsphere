import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { requireUser } from "@/lib/firebase/admin-auth";
import { enrichDreamWithAI } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const authenticatedUserId = await requireUser(request);
    const body = await request.json();
    const { userId, dream_text, mood, privacy } = body as {
      userId?: string;
      dream_text?: string;
      mood?: string;
      privacy?: "private" | "anonymous" | "public";
    };

    if (!userId || !dream_text || !mood || !privacy) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (userId !== authenticatedUserId) {
      return NextResponse.json({ error: "Unauthorized user mismatch." }, { status: 403 });
    }

    const userDoc = await adminDb.collection("users").doc(userId).get();
    const userName = String(userDoc.data()?.name || "Dreamer");
    const ai = await enrichDreamWithAI(dream_text, mood);
    const dreamRef = adminDb.collection("dreams").doc();

    const dream = {
      id: dreamRef.id,
      user_id: userId,
      user_name: privacy === "anonymous" ? "Anonymous" : userName,
      dream_text,
      story_text: ai.story_text,
      tags: ai.tags,
      mood,
      ai_emotion: ai.ai_emotion,
      summary: ai.summary,
      privacy,
      reactions: {
        like: 0,
        same_dream: 0
      },
      created_at: FieldValue.serverTimestamp()
    };

    await dreamRef.set(dream);

    const userData = userDoc.data();
    const now = new Date();
    const lastDreamAt = userData?.last_dream_at ? new Date(String(userData.last_dream_at)) : null;
    const msPerDay = 24 * 60 * 60 * 1000;
    const dayDiff = lastDreamAt
      ? Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) -
          Date.UTC(
            lastDreamAt.getFullYear(),
            lastDreamAt.getMonth(),
            lastDreamAt.getDate()
          )) /
          msPerDay)
      : null;

    const nextStreak =
      dayDiff === null ? 1 : dayDiff === 0 ? Number(userData?.streak_count || 1) : dayDiff === 1 ? Number(userData?.streak_count || 0) + 1 : 1;

    await adminDb.collection("users").doc(userId).set(
      {
        last_dream_at: now.toISOString(),
        streak_count: nextStreak
      },
      { merge: true }
    );

    const savedDream = await dreamRef.get();

    return NextResponse.json({
      dream: {
        ...dream,
        created_at: savedDream.data()?.created_at?.toDate().toISOString() || new Date().toISOString()
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Dream processing failed.";
    return NextResponse.json(
      {
        error: message === "Unauthorized" ? "Unauthorized" : message
      },
      { status: message === "Unauthorized" ? 401 : 500 }
    );
  }
}
