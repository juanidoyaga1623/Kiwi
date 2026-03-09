import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { polygonApi } from "@/lib/polygon";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 1) {
      return NextResponse.json({ results: [] });
    }

    const results = await polygonApi.searchTickers(query, 10);

    return NextResponse.json({
      results: results.map((r: {
        ticker: string;
        name: string;
        market: string;
        type: string;
      }) => ({
        ticker: r.ticker,
        name: r.name,
        market: r.market,
        type: r.type,
      })),
    });
  } catch (error) {
    console.error("Stock search error:", error);
    // Fallback with mock data for development
    const mockResults = [
      { ticker: "AAPL", name: "Apple Inc.", market: "stocks" },
      { ticker: "AMZN", name: "Amazon.com Inc.", market: "stocks" },
      { ticker: "TSLA", name: "Tesla, Inc.", market: "stocks" },
      { ticker: "MSFT", name: "Microsoft Corporation", market: "stocks" },
      { ticker: "NVDA", name: "NVIDIA Corporation", market: "stocks" },
    ];
    const q = new URL(request.url).searchParams.get("q") || "";
    return NextResponse.json({
      results: mockResults.filter(
        (r) =>
          r.ticker.toLowerCase().includes(q.toLowerCase()) ||
          r.name.toLowerCase().includes(q.toLowerCase())
      ),
    });
  }
}
