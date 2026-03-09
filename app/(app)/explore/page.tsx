import type { Metadata } from "next";
import Link from "next/link";
import { StockSearch } from "@/components/stock/stock-search";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getPnlBg, formatPercent } from "@/lib/utils";
import { POPULAR_STOCKS } from "@/lib/mock-data";
import { TrendingUp, TrendingDown } from "lucide-react";

export const metadata: Metadata = { title: "Explorar" };

export default function ExplorePage() {
  const gainers = [...POPULAR_STOCKS].filter((s) => s.change > 0).sort((a, b) => b.change / b.price - a.change / a.price);
  const losers = [...POPULAR_STOCKS].filter((s) => s.change < 0).sort((a, b) => a.change / a.price - b.change / b.price);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Explorar</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Buscá y comprá acciones fraccionadas
        </p>
      </div>

      {/* Search */}
      <StockSearch className="max-w-xl" />

      {/* Popular */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Acciones populares
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {POPULAR_STOCKS.map((stock) => {
            const changePercent = (stock.change / stock.price) * 100;
            const isPositive = stock.change >= 0;
            return (
              <Link key={stock.symbol} href={`/explore/${stock.symbol}`}>
                <Card className="bg-card border-border hover:border-primary/30 transition-all cursor-pointer h-full">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                        <span className="text-sm font-bold">{stock.symbol.slice(0, 2)}</span>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-xs tabular-nums ${getPnlBg(stock.change)}`}
                      >
                        {isPositive ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {formatPercent(changePercent)}
                      </Badge>
                    </div>
                    <p className="font-bold text-foreground">{stock.symbol}</p>
                    <p className="text-xs text-muted-foreground truncate">{stock.name}</p>
                    <p className="text-lg font-bold text-foreground tabular-nums mt-2">
                      {formatCurrency(stock.price)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Gainers / Losers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            Mayores subidas
          </h2>
          <div className="space-y-2">
            {gainers.map((s) => (
              <Link key={s.symbol} href={`/explore/${s.symbol}`}>
                <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:border-emerald-400/30 transition-all">
                  <div>
                    <p className="text-sm font-bold text-foreground">{s.symbol}</p>
                    <p className="text-xs text-muted-foreground">{s.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold tabular-nums text-foreground">{formatCurrency(s.price)}</p>
                    <p className="text-xs text-emerald-400 tabular-nums">+{formatPercent((s.change / s.price) * 100)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-red-400" />
            Mayores bajas
          </h2>
          <div className="space-y-2">
            {losers.map((s) => (
              <Link key={s.symbol} href={`/explore/${s.symbol}`}>
                <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:border-red-400/30 transition-all">
                  <div>
                    <p className="text-sm font-bold text-foreground">{s.symbol}</p>
                    <p className="text-xs text-muted-foreground">{s.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold tabular-nums text-foreground">{formatCurrency(s.price)}</p>
                    <p className="text-xs text-red-400 tabular-nums">{formatPercent((s.change / s.price) * 100)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
