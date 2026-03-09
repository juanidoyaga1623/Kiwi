import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { polygonApi } from "@/lib/polygon";

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const symbol = params.symbol.toUpperCase();
    const snapshot = await polygonApi.getSnapshot(symbol);

    return NextResponse.json({
      symbol,
      price: snapshot.lastTrade?.p || snapshot.day?.c || 0,
      change: snapshot.todaysChange || 0,
      changePercent: snapshot.todaysChangePerc || 0,
      open: snapshot.day?.o || 0,
      high: snapshot.day?.h || 0,
      low: snapshot.day?.l || 0,
      previousClose: snapshot.prevDay?.c || 0,
      volume: snapshot.day?.v || 0,
    });
  } catch (error) {
    console.error("Snapshot fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch snapshot" },
      { status: 500 }
    );
  }
}
