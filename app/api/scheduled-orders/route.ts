import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getNextRunDate } from "@/lib/utils";

const scheduledOrderSchema = z.object({
  symbol: z.string().min(1).max(5).toUpperCase(),
  side: z.enum(["BUY", "SELL"]).default("BUY"),
  notional: z.number().min(1),
  frequency: z.enum(["DAILY", "WEEKLY", "BIWEEKLY", "MONTHLY"]),
});

export async function GET() {
  return NextResponse.json({ scheduledOrders: [] });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = scheduledOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { symbol, side, notional, frequency } = parsed.data;
    const nextRunAt = getNextRunDate(frequency);

    const scheduledOrder = {
      id: `mock_sched_${Date.now()}`,
      symbol,
      side,
      notional,
      frequency,
      active: true,
      nextRunAt,
      lastRunAt: null,
      totalExecuted: 0,
      totalInvested: 0,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ scheduledOrder });
  } catch (error) {
    console.error("Create scheduled order error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
