import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { alpacaApi } from "@/lib/alpaca";
import { z } from "zod";

const orderSchema = z.object({
  symbol: z.string().min(1).max(5).toUpperCase(),
  side: z.enum(["BUY", "SELL"]),
  notional: z.number().positive().optional(),
  qty: z.number().positive().optional(),
  limitPrice: z.number().positive().optional(),
  scheduledOrderId: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");
    const side = searchParams.get("side");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");

    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
        ...(symbol && { symbol: symbol.toUpperCase() }),
        ...(side && { side: side as "BUY" | "SELL" }),
        ...(status && { status: status as never }),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid order data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { symbol, side, notional, qty, limitPrice, scheduledOrderId } = parsed.data;

    if (!notional && !qty) {
      return NextResponse.json(
        { error: "Either notional (USD) or qty (shares) is required" },
        { status: 400 }
      );
    }

    // Get or create user
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Submit to Alpaca Paper Trading
    const alpacaOrder = await alpacaApi.createOrder({
      symbol,
      side: side.toLowerCase() as "buy" | "sell",
      type: limitPrice ? "limit" : "market",
      time_in_force: "day",
      ...(notional && { notional }),
      ...(qty && { qty }),
      ...(limitPrice && { limit_price: limitPrice }),
    });

    // Save to DB
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        alpacaOrderId: alpacaOrder.id,
        symbol,
        side,
        type: limitPrice ? "LIMIT" : "MARKET",
        status: mapAlpacaStatus(alpacaOrder.status),
        quantity: qty,
        notional,
        limitPrice,
        filledQty: alpacaOrder.filled_qty ? parseFloat(alpacaOrder.filled_qty) : null,
        filledAvgPrice: alpacaOrder.filled_avg_price
          ? parseFloat(alpacaOrder.filled_avg_price)
          : null,
        scheduledOrderId: scheduledOrderId || null,
        filledAt: alpacaOrder.filled_at ? new Date(alpacaOrder.filled_at) : null,
      },
    });

    // Update portfolio if filled
    if (alpacaOrder.status === "filled" && alpacaOrder.filled_qty && alpacaOrder.filled_avg_price) {
      await updatePortfolioPosition(
        user.id,
        symbol,
        side,
        parseFloat(alpacaOrder.filled_qty),
        parseFloat(alpacaOrder.filled_avg_price)
      );
    }

    return NextResponse.json({ order, alpacaOrderId: alpacaOrder.id });
  } catch (error: unknown) {
    console.error("Create order error:", error);
    const message = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function mapAlpacaStatus(status: string): "PENDING" | "ACCEPTED" | "PARTIALLY_FILLED" | "FILLED" | "CANCELED" | "EXPIRED" | "REJECTED" {
  const map: Record<string, "PENDING" | "ACCEPTED" | "PARTIALLY_FILLED" | "FILLED" | "CANCELED" | "EXPIRED" | "REJECTED"> = {
    new: "PENDING",
    accepted: "ACCEPTED",
    partially_filled: "PARTIALLY_FILLED",
    filled: "FILLED",
    canceled: "CANCELED",
    expired: "EXPIRED",
    rejected: "REJECTED",
    pending_new: "PENDING",
    accepted_for_bidding: "ACCEPTED",
    stopped: "CANCELED",
    suspended: "CANCELED",
    calculated: "PENDING",
  };
  return map[status] || "PENDING";
}

async function updatePortfolioPosition(
  userId: string,
  symbol: string,
  side: "BUY" | "SELL",
  qty: number,
  avgPrice: number
) {
  let portfolio = await prisma.portfolio.findUnique({ where: { userId } });

  if (!portfolio) {
    portfolio = await prisma.portfolio.create({
      data: { userId, cashBalance: 10000, totalValue: 10000 },
    });
  }

  const existing = await prisma.position.findUnique({
    where: { portfolioId_symbol: { portfolioId: portfolio.id, symbol } },
  });

  if (side === "BUY") {
    if (existing) {
      const newQty = existing.quantity + qty;
      const newAvgCost =
        (existing.avgCost * existing.quantity + avgPrice * qty) / newQty;
      await prisma.position.update({
        where: { id: existing.id },
        data: { quantity: newQty, avgCost: newAvgCost, currentPrice: avgPrice },
      });
    } else {
      await prisma.position.create({
        data: {
          portfolioId: portfolio.id,
          symbol,
          quantity: qty,
          avgCost: avgPrice,
          currentPrice: avgPrice,
        },
      });
    }

    // Deduct from cash
    const cost = qty * avgPrice;
    await prisma.portfolio.update({
      where: { id: portfolio.id },
      data: { cashBalance: { decrement: cost } },
    });
  } else if (side === "SELL" && existing) {
    const newQty = existing.quantity - qty;
    if (newQty <= 0.000001) {
      await prisma.position.delete({ where: { id: existing.id } });
    } else {
      await prisma.position.update({
        where: { id: existing.id },
        data: { quantity: newQty },
      });
    }

    // Add to cash
    const proceeds = qty * avgPrice;
    await prisma.portfolio.update({
      where: { id: portfolio.id },
      data: { cashBalance: { increment: proceeds } },
    });
  }
}
