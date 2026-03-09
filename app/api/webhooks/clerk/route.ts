import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Clerk webhook handler — creates user in DB on sign up
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { type, data } = payload;

    if (type === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url } = data;
      const email = email_addresses?.[0]?.email_address;

      if (!email) {
        return NextResponse.json({ error: "No email" }, { status: 400 });
      }

      const name = [first_name, last_name].filter(Boolean).join(" ") || null;

      await prisma.user.upsert({
        where: { clerkId: id },
        update: { email, name, imageUrl: image_url },
        create: {
          clerkId: id,
          email,
          name,
          imageUrl: image_url,
          portfolio: {
            create: {
              cashBalance: 10000,
              totalValue: 10000,
            },
          },
        },
      });

      console.log(`User created: ${email}`);
    }

    if (type === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } = data;
      const email = email_addresses?.[0]?.email_address;

      await prisma.user.update({
        where: { clerkId: id },
        data: {
          ...(email && { email }),
          name: [first_name, last_name].filter(Boolean).join(" ") || undefined,
          imageUrl: image_url,
        },
      });
    }

    if (type === "user.deleted") {
      const { id } = data;
      await prisma.user.delete({ where: { clerkId: id } }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Clerk webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
