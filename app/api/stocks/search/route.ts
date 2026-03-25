import { NextRequest, NextResponse } from "next/server";
import { polygonApi } from "@/lib/polygon";

const MOCK_STOCKS = [
  { ticker: "AAPL", name: "Apple Inc.", market: "stocks" },
  { ticker: "MSFT", name: "Microsoft Corporation", market: "stocks" },
  { ticker: "AMZN", name: "Amazon.com Inc.", market: "stocks" },
  { ticker: "TSLA", name: "Tesla, Inc.", market: "stocks" },
  { ticker: "NVDA", name: "NVIDIA Corporation", market: "stocks" },
  { ticker: "GOOGL", name: "Alphabet Inc.", market: "stocks" },
  { ticker: "META", name: "Meta Platforms Inc.", market: "stocks" },
  { ticker: "NFLX", name: "Netflix Inc.", market: "stocks" },
  { ticker: "AMD", name: "Advanced Micro Devices", market: "stocks" },
  { ticker: "PYPL", name: "PayPal Holdings Inc.", market: "stocks" },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (!query || query.length < 1) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await polygonApi.searchTickers(query, 10);
    return NextResponse.json({
      results: results.map((r: { ticker: string; name: string; market: string; type: string }) => ({
        ticker: r.ticker,
        name: r.name,
        market: r.market,
        type: r.type,
      })),
    });
  } catch {
    const filtered = MOCK_STOCKS.filter(
      (r) =>
        r.ticker.toLowerCase().includes(query.toLowerCase()) ||
        r.name.toLowerCase().includes(query.toLowerCase())
    );
    return NextResponse.json({ results: filtered });
  }
}
