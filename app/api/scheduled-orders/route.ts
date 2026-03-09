import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getNextRunDate } from "@/lib/utils";

const scheduledOrderSchema = z.object({
  symbol: z.string().min(1).max(5).toUpperCase(),
  side: z.enum(["BUY", "SELL"]).default("BUY"),
  notional: z.number().min(1),
  frequency: z.enum(["DAILY", "WEEKLY", "BIWEEKLY", "MONTHLY"]),
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

    const scheduledOrders = await prisma.scheduledOrder.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ scheduledOrders });
  } catch (error) {
    console.error("Get scheduled orders error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(_request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = scheduledOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { symbol, side, notional, frequency } = parsed.data;

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const nextRunAt = getNextRunDate(frequency);

    const scheduledOrder = await prisma.scheduledOrder.create({
      data: {
        userId: user.id,
        symbol,
        side,
        notional,
        frequency,
        nextRunAt,
        active: true,
      },
    });

    return NextResponse.json({ scheduledOrder });
  } catch (error) {
    console.error("Create scheduled order error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
