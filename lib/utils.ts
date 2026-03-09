import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(
  value: number,
  currency = "USD",
  decimals = 2
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number, decimals = 2): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatShares(quantity: number): string {
  if (quantity === Math.floor(quantity)) {
    return quantity.toString();
  }
  return quantity.toFixed(6).replace(/\.?0+$/, "");
}

export function getPnlColor(value: number): string {
  if (value > 0) return "text-emerald-400";
  if (value < 0) return "text-red-400";
  return "text-zinc-400";
}

export function getPnlBg(value: number): string {
  if (value > 0) return "bg-emerald-400/10 text-emerald-400";
  if (value < 0) return "bg-red-400/10 text-red-400";
  return "bg-zinc-700 text-zinc-400";
}

export function calculatePnl(
  currentPrice: number,
  avgCost: number,
  quantity: number
) {
  const currentValue = currentPrice * quantity;
  const costBasis = avgCost * quantity;
  const pnl = currentValue - costBasis;
  const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
  return { pnl, pnlPercent, currentValue, costBasis };
}

export function getNextRunDate(
  frequency: "DAILY" | "WEEKLY" | "BIWEEKLY" | "MONTHLY"
): Date {
  const now = new Date();
  const next = new Date(now);
  switch (frequency) {
    case "DAILY":
      next.setDate(next.getDate() + 1);
      break;
    case "WEEKLY":
      next.setDate(next.getDate() + 7);
      break;
    case "BIWEEKLY":
      next.setDate(next.getDate() + 14);
      break;
    case "MONTHLY":
      next.setMonth(next.getMonth() + 1);
      break;
  }
  next.setHours(9, 30, 0, 0);
  return next;
}

export function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((h) => {
          const val = row[h];
          const str = val == null ? "" : String(val);
          return str.includes(",") ? `"${str}"` : str;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
}
