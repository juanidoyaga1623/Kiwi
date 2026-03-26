import type { Metadata } from "next";
import { StatsCard } from "@/components/dashboard/stats-card";
import { PortfolioChart } from "@/components/dashboard/portfolio-chart";
import { PositionsList } from "@/components/dashboard/positions-list";
import { MarketMovers } from "@/components/dashboard/market-movers";
import { formatCurrency } from "@/lib/utils";
import {
  MOCK_POSITIONS,
  MOCK_PORTFOLIO_SUMMARY,
  generatePortfolioSnapshots,
} from "@/lib/mock-data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  const firstName = "Inversor";
  const snapshots = generatePortfolioSnapshots(30);
  const summary = MOCK_PORTFOLIO_SUMMARY;

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {greeting}, {firstName}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Aquí está el resumen de tu portfolio
          </p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/explore">
            <Plus className="h-4 w-4 mr-2" />
            Comprar
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Valor Total"
          value={formatCurrency(summary.totalValue)}
          change={summary.dayPnl}
          changePercent={summary.dayPnlPercent}
          subtitle="Hoy"
          highlight
          className="col-span-2 lg:col-span-1"
        />
        <StatsCard
          title="Efectivo disponible"
          value={formatCurrency(summary.cashBalance)}
          subtitle="Paper trading"
        />
        <StatsCard
          title="Invertido"
          value={formatCurrency(summary.investedValue)}
          change={summary.totalPnl}
          changePercent={summary.totalPnlPercent}
          subtitle="P&L total"
        />
        <StatsCard
          title="Posiciones"
          value={MOCK_POSITIONS.length.toString()}
          subtitle="Acciones activas"
        />
      </div>

      {/* Chart */}
      <PortfolioChart data={snapshots} />

      {/* Positions + Market */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <PositionsList positions={MOCK_POSITIONS} limit={4} />
        </div>
        <div>
          <MarketMovers />
        </div>
      </div>
    </div>
  );
}
