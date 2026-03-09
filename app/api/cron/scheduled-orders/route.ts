import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { alpacaApi } from "@/lib/alpaca";
import { getNextRunDate } from "@/lib/utils";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Called by Vercel Cron or trigger.dev
// vercel.json: { "crons": [{ "path": "/api/cron/scheduled-orders", "schedule": "0 9,14 * * 1-5" }] }
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  let executed = 0;
  let failed = 0;

  try {
    // Get all active scheduled orders due for execution
    const dueOrders = await prisma.scheduledOrder.findMany({
      where: {
        active: true,
        nextRunAt: { lte: now },
      },
      include: { user: true },
    });

    console.log(`Processing ${dueOrders.length} scheduled orders`);

    for (const scheduledOrder of dueOrders) {
      try {
        // Execute via Alpaca
        const alpacaOrder = await alpacaApi.createOrder({
          symbol: scheduledOrder.symbol,
          side: scheduledOrder.side.toLowerCase() as "buy" | "sell",
          type: "market",
          time_in_force: "day",
          notional: scheduledOrder.notional,
        });

        // Record the order
        await prisma.order.create({
          data: {
            userId: scheduledOrder.userId,
            alpacaOrderId: alpacaOrder.id,
            symbol: scheduledOrder.symbol,
            companyName: scheduledOrder.companyName,
            side: scheduledOrder.side,
            type: "MARKET",
            status: "PENDING",
            notional: scheduledOrder.notional,
            scheduledOrderId: scheduledOrder.id,
          },
        });

        // Update scheduled order
        const nextRunAt = getNextRunDate(scheduledOrder.frequency);
        await prisma.scheduledOrder.update({
          where: { id: scheduledOrder.id },
          data: {
            lastRunAt: now,
            nextRunAt,
            totalExecuted: { increment: 1 },
            totalInvested: { increment: scheduledOrder.notional },
          },
        });

        // Send email notification
        if (scheduledOrder.user.email) {
          try {
            await resend.emails.send({
              from: process.env.RESEND_FROM_EMAIL || "noreply@kiwi.app",
              to: scheduledOrder.user.email,
              subject: `✅ Compra automática ejecutada — ${scheduledOrder.symbol}`,
              html: `
                <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
                  <h2 style="color: #34d399;">Compra automática ejecutada</h2>
                  <p>Se ejecutó tu orden programada de <strong>${scheduledOrder.symbol}</strong>:</p>
                  <ul>
                    <li>Monto: <strong>$${scheduledOrder.notional} USD</strong></li>
                    <li>Frecuencia: ${scheduledOrder.frequency}</li>
                    <li>Fecha: ${now.toLocaleDateString("es-AR")}</li>
                  </ul>
                  <p>Tu próxima compra será el ${nextRunAt.toLocaleDateString("es-AR")}.</p>
                  <hr/>
                  <p style="color: #666; font-size: 12px;">Kiwi — Paper Trading</p>
                </div>
              `,
            });
          } catch (emailErr) {
            console.warn("Email send failed:", emailErr);
          }
        }

        executed++;
      } catch (orderErr) {
        console.error(`Failed to execute scheduled order ${scheduledOrder.id}:`, orderErr);
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      executed,
      failed,
      total: dueOrders.length,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
