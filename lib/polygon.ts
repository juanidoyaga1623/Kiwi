import axios from "axios";

const polygonClient = axios.create({
  baseURL: "https://api.polygon.io",
  params: {
    apiKey: process.env.POLYGON_API_KEY,
  },
});

export interface PolygonBar {
  o: number; // open
  h: number; // high
  l: number; // low
  c: number; // close
  v: number; // volume
  t: number; // timestamp (ms)
  vw?: number; // volume weighted avg
  n?: number; // num transactions
}

export interface PolygonTickerDetails {
  ticker: string;
  name: string;
  market: string;
  locale: string;
  type: string;
  currency_name: string;
  description?: string;
  market_cap?: number;
  employees?: number;
  homepage_url?: string;
  logo_url?: string;
  icon_url?: string;
  list_date?: string;
  share_class_shares_outstanding?: number;
  weighted_shares_outstanding?: number;
}

export interface PolygonSnapshot {
  ticker: string;
  todaysChangePerc: number;
  todaysChange: number;
  updated: number;
  day: {
    o: number;
    h: number;
    l: number;
    c: number;
    v: number;
    vw: number;
  };
  lastTrade: {
    p: number;
    s: number;
    t: number;
  };
  prevDay: {
    o: number;
    h: number;
    l: number;
    c: number;
    v: number;
  };
}

export const polygonApi = {
  async getAggregates(
    ticker: string,
    multiplier: number,
    timespan: "minute" | "hour" | "day" | "week" | "month" | "quarter" | "year",
    from: string,
    to: string,
    adjusted = true
  ) {
    const { data } = await polygonClient.get(
      `/v2/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${from}/${to}`,
      { params: { adjusted, sort: "asc", limit: 5000 } }
    );
    return data.results as PolygonBar[];
  },

  async getTickerDetails(ticker: string): Promise<PolygonTickerDetails> {
    const { data } = await polygonClient.get(`/v3/reference/tickers/${ticker}`);
    return data.results;
  },

  async getSnapshot(ticker: string): Promise<PolygonSnapshot> {
    const { data } = await polygonClient.get(
      `/v2/snapshot/locale/us/markets/stocks/tickers/${ticker}`
    );
    return data.ticker;
  },

  async searchTickers(query: string, limit = 10) {
    const { data } = await polygonClient.get("/v3/reference/tickers", {
      params: {
        search: query,
        market: "stocks",
        active: true,
        limit,
      },
    });
    return data.results || [];
  },

  async getPreviousClose(ticker: string) {
    const { data } = await polygonClient.get(`/v2/aggs/ticker/${ticker}/prev`);
    return data.results?.[0];
  },

  async getMultipleSnapshots(tickers: string[]) {
    const { data } = await polygonClient.get(
      "/v2/snapshot/locale/us/markets/stocks/tickers",
      { params: { tickers: tickers.join(",") } }
    );
    return data.tickers as PolygonSnapshot[];
  },
};

// Timeframe helper to compute date ranges
export function getDateRange(timeframe: "1D" | "1W" | "1M" | "3M" | "1Y") {
  const now = new Date();
  const to = now.toISOString().split("T")[0];
  let from: string;
  let multiplier: number;
  let timespan: "minute" | "hour" | "day" | "week" | "month";

  switch (timeframe) {
    case "1D":
      from = to;
      multiplier = 5;
      timespan = "minute";
      break;
    case "1W":
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      from = oneWeekAgo.toISOString().split("T")[0];
      multiplier = 1;
      timespan = "hour";
      break;
    case "1M":
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      from = oneMonthAgo.toISOString().split("T")[0];
      multiplier = 1;
      timespan = "day";
      break;
    case "3M":
      const threeMonthsAgo = new Date(now);
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      from = threeMonthsAgo.toISOString().split("T")[0];
      multiplier = 1;
      timespan = "day";
      break;
    case "1Y":
      const oneYearAgo = new Date(now);
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      from = oneYearAgo.toISOString().split("T")[0];
      multiplier = 1;
      timespan = "week";
      break;
    default:
      from = to;
      multiplier = 5;
      timespan = "minute";
  }

  return { from, to, multiplier, timespan };
}

export default polygonApi;
