import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { requireUser } from "@/lib/firebase/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const authenticatedUserId = await requireUser(request);
    const body = await request.json();
    const { dreamId, userId, type } = body as {
      dreamId?: string;
      userId?: string;
      type?: "like" | "same_dream";
    };

    if (!dreamId || !userId || !type) {
      return NextResponse.json({ error: "Missing interaction fields." }, { status: 400 });
    }

    if (userId !== authenticatedUserId) {
      return NextResponse.json({ error: "Unauthorized user mismatch." }, { status: 403 });
    }

    const interactionRef = adminDb.collection("interactions").doc(`${dreamId}_${userId}_${type}`);

    if ((await interactionRef.get()).exists) {
      return NextResponse.json({ success: true });
    }

    await interactionRef.set({
      id: interactionRef.id,
      dream_id: dreamId,
      user_id: userId,
      type,
      created_at: FieldValue.serverTimestamp()
    });

    await adminDb
      .collection("dreams")
      .doc(dreamId)
      .update({
        [`reactions.${type}`]: FieldValue.increment(1)
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save interaction.";
    return NextResponse.json(
      {
        error: message === "Unauthorized" ? "Unauthorized" : message
      },
      { status: message === "Unauthorized" ? 401 : 500 }
    );
  }
}
