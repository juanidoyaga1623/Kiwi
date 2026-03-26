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

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  const snapshots = generatePortfolioSnapshots(30);
  const summary = MOCK_PORTFOLIO_SUMMARY;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="col-span-2 lg:col-span-1 space-y-3">
          <StatsCard
            title="Valor Total"
            value={formatCurrency(summary.totalValue)}
            change={summary.dayPnl}
            changePercent={summary.dayPnlPercent}
            subtitle="Hoy"
            highlight
          />
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/explore"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors"
            >
              Comprar
            </Link>
            <Link
              href="/explore"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
            >
              Vender
            </Link>
          </div>
        </div>
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
