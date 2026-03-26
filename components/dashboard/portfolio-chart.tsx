"use client";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

type Period = "1D" | "1W" | "1M" | "1Y" | "5Y";

const PERIODS: Period[] = ["1D", "1W", "1M", "1Y", "5Y"];

function generateData(period: Period) {
  const now = Date.now();
  const points: { date: number; value: number }[] = [];
  let value = 10000;

  const configs: Record<Period, { count: number; stepMs: number; volatility: number }> = {
    "1D": { count: 48, stepMs: 30 * 60 * 1000, volatility: 30 },
    "1W": { count: 56, stepMs: 3 * 60 * 60 * 1000, volatility: 80 },
    "1M": { count: 30, stepMs: 24 * 60 * 60 * 1000, volatility: 150 },
    "1Y": { count: 52, stepMs: 7 * 24 * 60 * 60 * 1000, volatility: 300 },
    "5Y": { count: 60, stepMs: 30 * 24 * 60 * 60 * 1000, volatility: 600 },
  };

  const { count, stepMs, volatility } = configs[period];
  const start = now - count * stepMs;

  for (let i = 0; i <= count; i++) {
    const change = (Math.random() - 0.42) * volatility;
    value = Math.max(8000, value + change);
    points.push({ date: start + i * stepMs, value: Math.round(value * 100) / 100 });
  }

  return points;
}

function formatDate(ts: number, period: Period) {
  const d = new Date(ts);
  switch (period) {
    case "1D": return format(d, "HH:mm");
    case "1W": return format(d, "EEE dd");
    case "1M": return format(d, "dd/MM");
    case "1Y": return format(d, "MMM yy");
    case "5Y": return format(d, "MMM yy");
  }
}

function CustomTooltip({ active, payload, period }: {
  active?: boolean;
  payload?: { value: number; payload: { date: number } }[];
  period: Period;
}) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-muted-foreground mb-1">
        {formatDate(payload[0].payload.date, period)}
      </p>
      <p className="text-sm font-bold text-foreground tabular-nums">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

interface PortfolioChartProps {
  title?: string;
}

export function PortfolioChart({ title = "Evolución del Portfolio" }: PortfolioChartProps) {
  const [period, setPeriod] = useState<Period>("1M");

  const data = useMemo(() => generateData(period), [period]);

  const isPositive = data[data.length - 1].value >= data[0].value;
  const color = isPositive ? "#34d399" : "#f87171";
  const gradientId = `grad-${period}`;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex gap-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                period === p
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
                tickFormatter={(v) => formatDate(v, period)}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={65}
                tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
              />
              <Tooltip content={<CustomTooltip period={period} />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
