"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  formatCurrency,
  formatPercent,
  formatShares,
  getPnlBg,
  getPnlColor,
} from "@/lib/utils";
import type { PortfolioPosition } from "@/types";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PositionCardProps {
  position: PortfolioPosition;
}

export function PositionCard({ position: pos }: PositionCardProps) {
  const isPositive = pos.pnl >= 0;

  return (
    <Link href={`/explore/${pos.symbol}`}>
      <Card className="bg-card border-border hover:border-primary/30 transition-all cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <span className="text-sm font-bold text-foreground">
                  {pos.symbol.slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="font-bold text-foreground">{pos.symbol}</p>
                <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                  {pos.companyName}
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className={`${getPnlBg(pos.pnl)} flex items-center gap-1`}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {formatPercent(pos.pnlPercent)}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Valor actual</p>
              <p className="text-sm font-semibold text-foreground tabular-nums">
                {formatCurrency(pos.currentValue)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">P&L</p>
              <p
                className={`text-sm font-semibold tabular-nums ${getPnlColor(pos.pnl)}`}
              >
                {pos.pnl >= 0 ? "+" : ""}
                {formatCurrency(pos.pnl)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Cantidad</p>
              <p className="text-sm text-foreground tabular-nums">
                {formatShares(pos.quantity)} acc.
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Precio prom.</p>
              <p className="text-sm text-foreground tabular-nums">
                {formatCurrency(pos.avgCost)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
