import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { alpacaApi } from "@/lib/alpaca";

interface AlpacaPosition {
  symbol: string;
  current_price: string;
  market_value: string;
}

interface AlpacaAccount {
  cash: string;
}

export async function GET(_request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        portfolio: {
          include: { positions: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.portfolio) {
      // Initialize portfolio for new user
      const portfolio = await prisma.portfolio.create({
        data: {
          userId: user.id,
          cashBalance: 10000,
          totalValue: 10000,
        },
        include: { positions: true },
      });

      return NextResponse.json({
        portfolio: {
          ...portfolio,
          positions: [],
          totalValue: 10000,
          cashBalance: 10000,
        },
      });
    }

    // Try to sync with Alpaca
    let alpacaPositions: AlpacaPosition[] = [];
    let alpacaAccount: AlpacaAccount | null = null;
    try {
      [alpacaPositions, alpacaAccount] = await Promise.all([
        alpacaApi.getPositions(),
        alpacaApi.getAccount(),
      ]);
    } catch (err) {
      console.warn("Alpaca sync failed, using local data:", err);
    }

    // Merge local positions with Alpaca data
    const positions = user.portfolio.positions.map((pos) => {
      const alpacaPos = alpacaPositions.find(
        (ap: AlpacaPosition) => ap.symbol === pos.symbol
      );
      const currentPrice = alpacaPos
        ? parseFloat(alpacaPos.current_price)
        : pos.currentPrice;

      const currentValue = currentPrice * pos.quantity;
      const costBasis = pos.avgCost * pos.quantity;
      const pnl = currentValue - costBasis;
      const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;

      return {
        id: pos.id,
        symbol: pos.symbol,
        companyName: pos.companyName,
        quantity: pos.quantity,
        avgCost: pos.avgCost,
        currentPrice,
        currentValue,
        costBasis,
        pnl,
        pnlPercent,
      };
    });

    const investedValue = positions.reduce(
      (sum: number, p: { currentValue: number }) => sum + p.currentValue,
      0
    );
    const cashBalance = alpacaAccount
      ? parseFloat(alpacaAccount.cash)
      : user.portfolio.cashBalance;
    const totalValue = investedValue + cashBalance;
    const totalPnl = positions.reduce(
      (sum: number, p: { pnl: number }) => sum + p.pnl,
      0
    );
    const totalCostBasis = positions.reduce(
      (sum: number, p: { costBasis: number }) => sum + p.costBasis,
      0
    );
    const totalPnlPercent =
      totalCostBasis > 0 ? (totalPnl / totalCostBasis) * 100 : 0;

    // Update portfolio value
    await prisma.portfolio.update({
      where: { id: user.portfolio.id },
      data: { totalValue, cashBalance },
    });

    return NextResponse.json({
      portfolio: {
        id: user.portfolio.id,
        totalValue,
        cashBalance,
        investedValue,
        totalPnl,
        totalPnlPercent,
        dayPnl: 0, // Would need historical data
        dayPnlPercent: 0,
        positions,
      },
    });
  } catch (error) {
    console.error("Portfolio fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
