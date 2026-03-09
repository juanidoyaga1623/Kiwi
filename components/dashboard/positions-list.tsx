"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercent, formatShares, getPnlBg } from "@/lib/utils";
import type { PortfolioPosition } from "@/types";
import { ChevronRight } from "lucide-react";

interface PositionsListProps {
  positions: PortfolioPosition[];
  limit?: number;
}

export function PositionsList({ positions, limit }: PositionsListProps) {
  const displayPositions = limit ? positions.slice(0, limit) : positions;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Mis Posiciones
        </CardTitle>
        {limit && positions.length > limit && (
          <Link
            href="/portfolio"
            className="text-xs text-primary hover:underline flex items-center gap-0.5"
          >
            Ver todas <ChevronRight className="h-3 w-3" />
          </Link>
        )}
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {displayPositions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Sin posiciones todavía</p>
            <p className="text-xs mt-1">
              <Link href="/explore" className="text-primary hover:underline">
                Explorá acciones
              </Link>{" "}
              para empezar
            </p>
          </div>
        ) : (
          displayPositions.map((pos) => (
            <Link
              key={pos.id}
              href={`/explore/${pos.symbol}`}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-foreground">
                    {pos.symbol.slice(0, 2)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {pos.symbol}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {formatShares(pos.quantity)} acciones
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0 ml-3">
                <p className="text-sm font-semibold text-foreground tabular-nums">
                  {formatCurrency(pos.currentValue)}
                </p>
                <Badge
                  variant="secondary"
                  className={`text-xs tabular-nums ${getPnlBg(pos.pnl)}`}
                >
                  {formatPercent(pos.pnlPercent)}
                </Badge>
              </div>

              <ChevronRight className="h-4 w-4 text-muted-foreground ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
