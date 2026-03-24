import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireUser } from "@/lib/firebase/admin-auth";
import { computeTagBuckets } from "@/lib/dream-analytics";
import { serializeDream } from "@/lib/firestore-serializers";

export async function GET(request: NextRequest) {
  try {
    const authenticatedUserId = await requireUser(request);
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required." }, { status: 400 });
    }

    if (userId !== authenticatedUserId) {
      return NextResponse.json({ error: "Unauthorized user mismatch." }, { status: 403 });
    }

    const [dreamsSnapshot, publicDreamsSnapshot, userDoc] = await Promise.all([
      adminDb.collection("dreams").where("user_id", "==", userId).orderBy("created_at", "desc").get(),
      adminDb
        .collection("dreams")
        .where("user_id", "==", userId)
        .where("privacy", "==", "public")
        .orderBy("created_at", "desc")
        .limit(5)
        .get(),
      adminDb.collection("users").doc(userId).get()
    ]);

    const dreams = dreamsSnapshot.docs.map(serializeDream);
    const publicDreams = publicDreamsSnapshot.docs.map(serializeDream);
    const topThemes = computeTagBuckets(dreams)
      .slice(0, 6)
      .map((bucket) => bucket.tag);

    return NextResponse.json({
      profile: {
        totalDreams: dreams.length,
        topThemes,
        recentDreams: publicDreams,
        streak: Number(userDoc.data()?.streak_count || 0)
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch profile.";
    return NextResponse.json(
      {
        error: message === "Unauthorized" ? "Unauthorized" : message
      },
      { status: message === "Unauthorized" ? 401 : 500 }
    );
  }
}
