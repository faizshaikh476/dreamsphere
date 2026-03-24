import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { serializeDream } from "@/lib/firestore-serializers";

const PAGE_SIZE = 10;

export async function GET(request: NextRequest) {
  try {
    const cursor = request.nextUrl.searchParams.get("cursor");

    let query = adminDb
      .collection("dreams")
      .where("privacy", "==", "public")
      .orderBy("created_at", "desc")
      .limit(PAGE_SIZE);

    if (cursor) {
      query = query.startAfter(Timestamp.fromDate(new Date(cursor)));
    }

    const snapshot = await query.get();
    const dreams = snapshot.docs.map(serializeDream);
    const last = snapshot.docs.at(-1);

    return NextResponse.json({
      dreams,
      nextCursor: last?.data()?.created_at?.toDate().toISOString() || null
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to fetch feed."
      },
      { status: 500 }
    );
  }
}
