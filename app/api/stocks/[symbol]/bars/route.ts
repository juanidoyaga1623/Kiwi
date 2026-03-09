import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { polygonApi, getDateRange } from "@/lib/polygon";
import type { Timeframe } from "@/types";

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
    const { searchParams } = new URL(request.url);
    const timeframe = (searchParams.get("timeframe") as Timeframe) || "1M";

    const { from, to, multiplier, timespan } = getDateRange(timeframe);

    const bars = await polygonApi.getAggregates(
      symbol,
      multiplier,
      timespan,
      from,
      to
    );

    return NextResponse.json({ bars: bars || [], symbol, timeframe });
  } catch (error) {
    console.error("Bars fetch error:", error);
    // Return mock candlestick data
    const mockBars = generateMockBars(100);
    return NextResponse.json({ bars: mockBars, mock: true });
  }
}

function generateMockBars(count: number) {
  const bars = [];
  const now = Date.now();
  let price = 180;

  for (let i = count; i >= 0; i--) {
    const timestamp = now - i * 24 * 60 * 60 * 1000;
    const change = (Math.random() - 0.48) * 5;
    const open = price;
    const close = Math.max(50, price + change);
    const high = Math.max(open, close) + Math.random() * 2;
    const low = Math.min(open, close) - Math.random() * 2;
    const volume = Math.floor(Math.random() * 50_000_000) + 10_000_000;
    bars.push({ t: timestamp, o: open, h: high, l: low, c: close, v: volume });
    price = close;
  }
  return bars;
}
