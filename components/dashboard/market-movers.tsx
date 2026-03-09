"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getPnlBg, formatPercent } from "@/lib/utils";
import { POPULAR_STOCKS } from "@/lib/mock-data";
import { TrendingUp } from "lucide-react";

export function MarketMovers() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3 flex flex-row items-center gap-2">
        <TrendingUp className="h-4 w-4 text-primary" />
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Mercado Hoy
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-1">
        {POPULAR_STOCKS.map((stock) => (
          <Link
            key={stock.symbol}
            href={`/explore/${stock.symbol}`}
            className="flex items-center justify-between p-2.5 rounded-lg hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center">
                <span className="text-[10px] font-bold text-foreground">
                  {stock.symbol.slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {stock.symbol}
                </p>
                <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                  {stock.name}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold tabular-nums text-foreground">
                {formatCurrency(stock.price)}
              </p>
              <Badge
                variant="secondary"
                className={`text-[10px] tabular-nums ${getPnlBg(stock.change)}`}
              >
                {formatPercent((stock.change / stock.price) * 100)}
              </Badge>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
