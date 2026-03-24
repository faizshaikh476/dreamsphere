import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { computeTagBuckets } from "@/lib/dream-analytics";
import { serializeDream } from "@/lib/firestore-serializers";

export async function GET() {
  try {
    const snapshot = await adminDb
      .collection("dreams")
      .where("privacy", "==", "public")
      .orderBy("created_at", "desc")
      .limit(200)
      .get();

    const dreams = snapshot.docs.map(serializeDream);
    const heatmap = computeTagBuckets(dreams).slice(0, 18);

    return NextResponse.json({ heatmap });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to fetch heatmap."
      },
      { status: 500 }
    );
  }
}
