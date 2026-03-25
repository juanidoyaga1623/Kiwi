import { NextRequest, NextResponse } from "next/server";
import { polygonApi } from "@/lib/polygon";

const MOCK_PRICES: Record<string, number> = {
  AAPL: 189.5, MSFT: 415.2, NVDA: 875.4, TSLA: 248.5, AMZN: 186.3,
  GOOGL: 175.8, META: 504.2, NFLX: 632.1, AMD: 168.9, PYPL: 62.4,
};

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  const symbol = params.symbol.toUpperCase();

  try {
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
  } catch {
    const price = MOCK_PRICES[symbol] ?? 100 + Math.random() * 200;
    const change = (Math.random() - 0.45) * 5;
    return NextResponse.json({
      symbol,
      price,
      change,
      changePercent: (change / price) * 100,
      open: price - 1,
      high: price + 3,
      low: price - 3,
      previousClose: price - change,
      volume: Math.floor(Math.random() * 50_000_000),
    });
  }
}
