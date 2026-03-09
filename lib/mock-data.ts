// Mock data for development / demo purposes
import type { PortfolioPosition, OrderRecord, MockPortfolioSnapshot } from "@/types";

export const MOCK_POSITIONS: PortfolioPosition[] = [
  {
    id: "pos_1",
    symbol: "AAPL",
    companyName: "Apple Inc.",
    quantity: 2.453,
    avgCost: 165.2,
    currentPrice: 189.84,
    currentValue: 465.63,
    costBasis: 405.24,
    pnl: 60.39,
    pnlPercent: 14.9,
  },
  {
    id: "pos_2",
    symbol: "TSLA",
    companyName: "Tesla, Inc.",
    quantity: 0.85,
    avgCost: 240.0,
    currentPrice: 178.79,
    currentValue: 151.97,
    costBasis: 204.0,
    pnl: -52.03,
    pnlPercent: -25.5,
  },
  {
    id: "pos_3",
    symbol: "NVDA",
    companyName: "NVIDIA Corporation",
    quantity: 0.32,
    avgCost: 420.5,
    currentPrice: 875.39,
    currentValue: 280.12,
    costBasis: 134.56,
    pnl: 145.56,
    pnlPercent: 108.2,
  },
  {
    id: "pos_4",
    symbol: "MSFT",
    companyName: "Microsoft Corporation",
    quantity: 1.1,
    avgCost: 330.0,
    currentPrice: 415.8,
    currentValue: 457.38,
    costBasis: 363.0,
    pnl: 94.38,
    pnlPercent: 26.0,
  },
  {
    id: "pos_5",
    symbol: "GOOGL",
    companyName: "Alphabet Inc.",
    quantity: 0.75,
    avgCost: 145.3,
    currentPrice: 172.63,
    currentValue: 129.47,
    costBasis: 108.98,
    pnl: 20.49,
    pnlPercent: 18.8,
  },
];

export const MOCK_PORTFOLIO_SUMMARY = {
  totalValue: 12584.57,
  cashBalance: 11100.0,
  investedValue: 1484.57,
  totalPnl: 268.79,
  totalPnlPercent: 22.1,
  dayPnl: 43.21,
  dayPnlPercent: 0.34,
};

export function generatePortfolioSnapshots(days = 30): MockPortfolioSnapshot[] {
  const snapshots: MockPortfolioSnapshot[] = [];
  const baseValue = 10000;
  let value = baseValue;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const change = (Math.random() - 0.4) * 200;
    value = Math.max(9000, value + change);
    snapshots.push({
      date: date.toISOString().split("T")[0],
      value: Math.round(value * 100) / 100,
    });
  }

  return snapshots;
}

export const MOCK_ORDERS: OrderRecord[] = [
  {
    id: "ord_1",
    symbol: "AAPL",
    companyName: "Apple Inc.",
    side: "BUY",
    type: "MARKET",
    status: "FILLED",
    quantity: null,
    notional: 100,
    filledQty: 0.527,
    filledAvgPrice: 189.75,
    createdAt: new Date("2024-03-01T14:32:00"),
    filledAt: new Date("2024-03-01T14:32:01"),
  },
  {
    id: "ord_2",
    symbol: "TSLA",
    companyName: "Tesla, Inc.",
    side: "BUY",
    type: "MARKET",
    status: "FILLED",
    quantity: null,
    notional: 200,
    filledQty: 1.12,
    filledAvgPrice: 178.57,
    createdAt: new Date("2024-02-28T10:15:00"),
    filledAt: new Date("2024-02-28T10:15:02"),
  },
  {
    id: "ord_3",
    symbol: "NVDA",
    companyName: "NVIDIA Corporation",
    side: "BUY",
    type: "MARKET",
    status: "FILLED",
    quantity: null,
    notional: 50,
    filledQty: 0.057,
    filledAvgPrice: 877.19,
    createdAt: new Date("2024-02-25T09:35:00"),
    filledAt: new Date("2024-02-25T09:35:01"),
  },
  {
    id: "ord_4",
    symbol: "TSLA",
    companyName: "Tesla, Inc.",
    side: "SELL",
    type: "MARKET",
    status: "FILLED",
    quantity: 0.27,
    notional: null,
    filledQty: 0.27,
    filledAvgPrice: 182.3,
    createdAt: new Date("2024-02-20T11:22:00"),
    filledAt: new Date("2024-02-20T11:22:02"),
  },
  {
    id: "ord_5",
    symbol: "MSFT",
    companyName: "Microsoft Corporation",
    side: "BUY",
    type: "MARKET",
    status: "FILLED",
    quantity: null,
    notional: 150,
    filledQty: 0.36,
    filledAvgPrice: 416.67,
    createdAt: new Date("2024-02-15T15:45:00"),
    filledAt: new Date("2024-02-15T15:45:01"),
  },
];

export const POPULAR_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc.", price: 189.84, change: 1.23 },
  { symbol: "TSLA", name: "Tesla, Inc.", price: 178.79, change: -2.45 },
  { symbol: "NVDA", name: "NVIDIA Corporation", price: 875.39, change: 15.82 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 415.8, change: 3.1 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 172.63, change: 0.87 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 185.07, change: 2.34 },
  { symbol: "META", name: "Meta Platforms Inc.", price: 509.58, change: 8.67 },
  { symbol: "NFLX", name: "Netflix Inc.", price: 628.7, change: -5.2 },
];
