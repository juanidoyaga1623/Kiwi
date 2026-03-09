import type { Metadata } from "next";
import { HistoryClient } from "@/components/orders/history-client";
import { MOCK_ORDERS } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Historial" };

export default function HistoryPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Historial de Órdenes</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Todas tus transacciones
        </p>
      </div>
      <HistoryClient initialOrders={MOCK_ORDERS} />
    </div>
  );
}
