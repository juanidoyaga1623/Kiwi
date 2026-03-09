import type { Metadata } from "next";
import { PositionCard } from "@/components/portfolio/position-card";
import { StatsCard } from "@/components/dashboard/stats-card";
import { PortfolioChart } from "@/components/dashboard/portfolio-chart";
import { formatCurrency, formatPercent } from "@/lib/utils";
import {
  MOCK_POSITIONS,
  MOCK_PORTFOLIO_SUMMARY,
  generatePortfolioSnapshots,
} from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, Award } from "lucide-react";

export const metadata: Metadata = { title: "Portfolio" };

export default function PortfolioPage() {
  const snapshots = generatePortfolioSnapshots(90);
  const summary = MOCK_PORTFOLIO_SUMMARY;
  const positions = MOCK_POSITIONS;

  const bestPosition = [...positions].sort((a, b) => b.pnlPercent - a.pnlPercent)[0];
  const worstPosition = [...positions].sort((a, b) => a.pnlPercent - b.pnlPercent)[0];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mi Portfolio</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Rendimiento y posiciones
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Valor Total"
          value={formatCurrency(summary.totalValue)}
          change={summary.dayPnl}
          changePercent={summary.dayPnlPercent}
          subtitle="Variación hoy"
          highlight
          className="col-span-2 lg:col-span-1"
        />
        <StatsCard
          title="Invertido"
          value={formatCurrency(summary.investedValue)}
          change={summary.totalPnl}
          changePercent={summary.totalPnlPercent}
          subtitle="P&L total"
        />
        <StatsCard
          title="Efectivo"
          value={formatCurrency(summary.cashBalance)}
          subtitle="Disponible"
        />
        <StatsCard
          title="Posiciones"
          value={positions.length.toString()}
          subtitle="Activas"
        />
      </div>

      {/* Chart */}
      <PortfolioChart data={snapshots} title="Evolución del Portfolio (90 días)" />

      {/* Best / Worst */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bestPosition && (
          <Card className="bg-card border-emerald-400/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                <Award className="h-3.5 w-3.5 text-emerald-400" />
                Mejor posición
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-foreground">{bestPosition.symbol}</p>
                <p className="text-xs text-muted-foreground">{bestPosition.companyName}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-emerald-400 tabular-nums">
                  {formatPercent(bestPosition.pnlPercent)}
                </p>
                <p className="text-xs text-emerald-400/70 tabular-nums">
                  +{formatCurrency(bestPosition.pnl)}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {worstPosition && (
          <Card className="bg-card border-red-400/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                Peor posición
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-foreground">{worstPosition.symbol}</p>
                <p className="text-xs text-muted-foreground">{worstPosition.companyName}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-red-400 tabular-nums">
                  {formatPercent(worstPosition.pnlPercent)}
                </p>
                <p className="text-xs text-red-400/70 tabular-nums">
                  {formatCurrency(worstPosition.pnl)}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Positions grid */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">
          Todas las posiciones ({positions.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {positions.map((pos) => (
            <PositionCard key={pos.id} position={pos} />
          ))}
        </div>
      </div>
    </div>
  );
}
