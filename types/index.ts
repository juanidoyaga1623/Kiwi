// ============================================
// Kiwi — Global TypeScript Types
// ============================================

export type OrderSide = "BUY" | "SELL";
export type OrderType = "MARKET" | "LIMIT" | "STOP" | "STOP_LIMIT";
export type OrderStatus =
  | "PENDING"
  | "ACCEPTED"
  | "PARTIALLY_FILLED"
  | "FILLED"
  | "CANCELED"
  | "EXPIRED"
  | "REJECTED";
export type ScheduleFrequency = "DAILY" | "WEEKLY" | "BIWEEKLY" | "MONTHLY";
export type ArticleCategory = "BASICS" | "STRATEGIES" | "FAQ" | "ADVANCED";

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  volume: number;
  marketCap?: number;
  logoUrl?: string;
}

export interface PortfolioPosition {
  id: string;
  symbol: string;
  companyName: string | null;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  currentValue: number;
  costBasis: number;
  pnl: number;
  pnlPercent: number;
}

export interface PortfolioSummary {
  totalValue: number;
  cashBalance: number;
  investedValue: number;
  totalPnl: number;
  totalPnlPercent: number;
  dayPnl: number;
  dayPnlPercent: number;
  positions: PortfolioPosition[];
  bestPosition: PortfolioPosition | null;
  worstPosition: PortfolioPosition | null;
}

export interface OrderRecord {
  id: string;
  symbol: string;
  companyName: string | null;
  side: OrderSide;
  type: OrderType;
  status: OrderStatus;
  quantity: number | null;
  notional: number | null;
  filledQty: number | null;
  filledAvgPrice: number | null;
  createdAt: Date;
  filledAt: Date | null;
}

export interface ScheduledOrderRecord {
  id: string;
  symbol: string;
  companyName: string | null;
  side: OrderSide;
  notional: number;
  frequency: ScheduleFrequency;
  active: boolean;
  nextRunAt: Date;
  lastRunAt: Date | null;
  totalExecuted: number;
  totalInvested: number;
}

export interface CandlestickBar {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface ArticleMeta {
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  tags: string[];
  readTime: number;
  publishedAt: string;
}

export interface SearchResult {
  symbol: string;
  name: string;
  type?: string;
  market?: string;
}

export type Timeframe = "1D" | "1W" | "1M" | "3M" | "1Y";

export interface TradeFormValues {
  side: OrderSide;
  orderMode: "amount" | "shares";
  amount: number;
  shares: number;
}

// Mock data types for development
export interface MockPortfolioSnapshot {
  date: string;
  value: number;
}
