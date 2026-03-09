"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn, formatCurrency, formatPercent, getPnlColor } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change?: number;
  changePercent?: number;
  subtitle?: string;
  className?: string;
  highlight?: boolean;
}

export function StatsCard({
  title,
  value,
  change,
  changePercent,
  subtitle,
  className,
  highlight,
}: StatsCardProps) {
  const isPositive = (change ?? 0) > 0;
  const isNegative = (change ?? 0) < 0;
  const isNeutral = (change ?? 0) === 0;

  return (
    <Card
      className={cn(
        "bg-card border-border",
        highlight && "kiwi-glow border-primary/30",
        className
      )}
    >
      <CardContent className="p-5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          {title}
        </p>
        <p className="text-2xl font-bold text-foreground tabular-nums mb-1">
          {value}
        </p>
        {(change !== undefined || changePercent !== undefined) && (
          <div className="flex items-center gap-1.5">
            {isPositive && <TrendingUp className="h-3 w-3 text-emerald-400" />}
            {isNegative && <TrendingDown className="h-3 w-3 text-red-400" />}
            {isNeutral && <Minus className="h-3 w-3 text-zinc-400" />}
            <span
              className={cn(
                "text-xs font-medium tabular-nums",
                getPnlColor(change ?? 0)
              )}
            >
              {change !== undefined && formatCurrency(Math.abs(change))}
              {changePercent !== undefined && (
                <span className="ml-1">({formatPercent(changePercent)})</span>
              )}
            </span>
          </div>
        )}
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
