import type { Metadata } from "next";
import { ScheduledClient } from "@/components/orders/scheduled-client";

export const metadata: Metadata = { title: "Órdenes Programadas" };

export default function ScheduledPage() {
  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Órdenes Programadas</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Dollar-cost averaging automático — invertí sin pensar
        </p>
      </div>
      <ScheduledClient />
    </div>
  );
}
