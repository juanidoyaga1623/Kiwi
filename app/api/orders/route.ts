import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const orderSchema = z.object({
  symbol: z.string().min(1).max(5).toUpperCase(),
  side: z.enum(["BUY", "SELL"]),
  notional: z.number().positive().optional(),
  qty: z.number().positive().optional(),
  limitPrice: z.number().positive().optional(),
  scheduledOrderId: z.string().optional(),
});

export async function GET() {
  return NextResponse.json({ orders: [] });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid order data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { symbol, side, notional, qty, limitPrice } = parsed.data;

    if (!notional && !qty) {
      return NextResponse.json(
        { error: "Either notional (USD) or qty (shares) is required" },
        { status: 400 }
      );
    }

    // Mock order response for demo
    const mockOrder = {
      id: `mock_${Date.now()}`,
      symbol,
      side,
      type: limitPrice ? "LIMIT" : "MARKET",
      status: "FILLED",
      notional: notional ?? null,
      quantity: qty ?? null,
      filledQty: qty ?? (notional ? notional / 150 : null),
      filledAvgPrice: 150,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ order: mockOrder });
  } catch (error: unknown) {
    console.error("Create order error:", error);
    const message = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
