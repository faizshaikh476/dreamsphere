import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { getSimilarityScore } from "@/lib/dream-analytics";
import { serializeDream } from "@/lib/firestore-serializers";

export async function GET(request: NextRequest) {
  try {
    const dreamId = request.nextUrl.searchParams.get("dreamId");

    if (!dreamId) {
      return NextResponse.json({ error: "dreamId is required." }, { status: 400 });
    }

    const sourceDoc = await adminDb.collection("dreams").doc(dreamId).get();
    if (!sourceDoc.exists) {
      return NextResponse.json({ error: "Dream not found." }, { status: 404 });
    }

    const sourceDream = serializeDream(sourceDoc);
    const snapshot = await adminDb
      .collection("dreams")
      .where("privacy", "==", "public")
      .limit(60)
      .get();

    const matches = snapshot.docs
      .filter((doc) => doc.id !== dreamId)
      .map((doc) => serializeDream(doc))
      .map((dream) => ({
        dream,
        similarityScore: getSimilarityScore(sourceDream, dream)
      }))
      .filter((match) => match.similarityScore > 0)
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 8);

    return NextResponse.json({ matches });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to fetch similar dreams."
      },
      { status: 500 }
    );
  }
}
