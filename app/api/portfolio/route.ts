import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    portfolio: {
      id: "mock_portfolio",
      totalValue: 10842.5,
      cashBalance: 7342.5,
      investedValue: 3500,
      totalPnl: 342.5,
      totalPnlPercent: 10.8,
      dayPnl: 28.4,
      dayPnlPercent: 0.26,
      positions: [
        { id: "1", symbol: "AAPL", companyName: "Apple Inc.", quantity: 5.2, avgCost: 180, currentPrice: 189.5, currentValue: 985.4, costBasis: 936, pnl: 49.4, pnlPercent: 5.3 },
        { id: "2", symbol: "NVDA", companyName: "NVIDIA Corporation", quantity: 1.8, avgCost: 750, currentPrice: 875.4, currentValue: 1575.7, costBasis: 1350, pnl: 225.7, pnlPercent: 16.7 },
        { id: "3", symbol: "TSLA", companyName: "Tesla, Inc.", quantity: 3.8, avgCost: 260, currentPrice: 248.5, currentValue: 944.3, costBasis: 988, pnl: -43.7, pnlPercent: -4.4 },
      ],
    },
  });
}
