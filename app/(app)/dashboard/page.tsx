import type { Metadata } from "next";
import { StatsCard } from "@/components/dashboard/stats-card";
import { PortfolioChart } from "@/components/dashboard/portfolio-chart";
import { PositionsList } from "@/components/dashboard/positions-list";
import { MarketMovers } from "@/components/dashboard/market-movers";
import { formatCurrency, formatPercent, getPnlColor } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  MOCK_POSITIONS,
  MOCK_PORTFOLIO_SUMMARY,
} from "@/lib/mock-data";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  const summary = MOCK_PORTFOLIO_SUMMARY;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Valor Total con botones adentro */}
        <Card className="col-span-2 lg:col-span-1 bg-card border-primary/30 kiwi-glow">
          <CardContent className="p-5 space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Valor Total</p>
              <p className="text-2xl font-bold text-foreground tabular-nums mb-1">
                {formatCurrency(summary.totalValue)}
              </p>
              <div className="flex items-center gap-1.5">
                {summary.dayPnl > 0 ? <TrendingUp className="h-3 w-3 text-emerald-400" /> : summary.dayPnl < 0 ? <TrendingDown className="h-3 w-3 text-red-400" /> : <Minus className="h-3 w-3 text-zinc-400" />}
                <span className={`text-xs font-medium tabular-nums ${getPnlColor(summary.dayPnl)}`}>
                  {formatCurrency(Math.abs(summary.dayPnl))} ({formatPercent(summary.dayPnlPercent)})
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Hoy</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/explore"
                className="flex items-center justify-center py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors"
              >
                Comprar
              </Link>
              <Link
                href="/explore"
                className="flex items-center justify-center py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
              >
                Vender
              </Link>
            </div>
          </CardContent>
        </Card>
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
      </div>

      {/* Chart */}
      <PortfolioChart />

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
