import axios from "axios";

const alpacaClient = axios.create({
  baseURL: process.env.ALPACA_BASE_URL || "https://paper-api.alpaca.markets",
  headers: {
    "APCA-API-KEY-ID": process.env.ALPACA_API_KEY,
    "APCA-API-SECRET-KEY": process.env.ALPACA_SECRET_KEY,
    "Content-Type": "application/json",
  },
});

const alpacaDataClient = axios.create({
  baseURL: process.env.ALPACA_DATA_URL || "https://data.alpaca.markets",
  headers: {
    "APCA-API-KEY-ID": process.env.ALPACA_API_KEY,
    "APCA-API-SECRET-KEY": process.env.ALPACA_SECRET_KEY,
  },
});

export interface AlpacaOrder {
  id: string;
  client_order_id: string;
  symbol: string;
  side: "buy" | "sell";
  type: string;
  status: string;
  qty: string | null;
  notional: string | null;
  filled_qty: string | null;
  filled_avg_price: string | null;
  limit_price: string | null;
  created_at: string;
  updated_at: string;
  filled_at: string | null;
}

export interface AlpacaPosition {
  symbol: string;
  qty: string;
  avg_entry_price: string;
  market_value: string;
  current_price: string;
  unrealized_pl: string;
  unrealized_plpc: string;
  cost_basis: string;
}

export interface AlpacaAccount {
  id: string;
  status: string;
  currency: string;
  cash: string;
  portfolio_value: string;
  buying_power: string;
  equity: string;
}

export const alpacaApi = {
  // Account
  async getAccount(): Promise<AlpacaAccount> {
    const { data } = await alpacaClient.get("/v2/account");
    return data;
  },

  // Orders
  async createOrder(params: {
    symbol: string;
    side: "buy" | "sell";
    type?: string;
    time_in_force?: string;
    qty?: number;
    notional?: number;
    limit_price?: number;
  }): Promise<AlpacaOrder> {
    const { data } = await alpacaClient.post("/v2/orders", {
      ...params,
      type: params.type || "market",
      time_in_force: params.time_in_force || "day",
    });
    return data;
  },

  async getOrders(status?: string): Promise<AlpacaOrder[]> {
    const { data } = await alpacaClient.get("/v2/orders", {
      params: { status: status || "all", limit: 500 },
    });
    return data;
  },

  async getOrder(orderId: string): Promise<AlpacaOrder> {
    const { data } = await alpacaClient.get(`/v2/orders/${orderId}`);
    return data;
  },

  async cancelOrder(orderId: string): Promise<void> {
    await alpacaClient.delete(`/v2/orders/${orderId}`);
  },

  // Positions
  async getPositions(): Promise<AlpacaPosition[]> {
    const { data } = await alpacaClient.get("/v2/positions");
    return data;
  },

  async getPosition(symbol: string): Promise<AlpacaPosition> {
    const { data } = await alpacaClient.get(`/v2/positions/${symbol}`);
    return data;
  },

  async closePosition(symbol: string): Promise<AlpacaOrder> {
    const { data } = await alpacaClient.delete(`/v2/positions/${symbol}`);
    return data;
  },

  // Market data
  async getBars(
    symbol: string,
    timeframe: string,
    start: string,
    end?: string
  ) {
    const { data } = await alpacaDataClient.get(`/v2/stocks/${symbol}/bars`, {
      params: { timeframe, start, end, limit: 1000 },
    });
    return data;
  },

  async getLatestTrade(symbol: string) {
    const { data } = await alpacaDataClient.get(
      `/v2/stocks/${symbol}/trades/latest`
    );
    return data;
  },

  async getSnapshot(symbol: string) {
    const { data } = await alpacaDataClient.get(
      `/v2/stocks/${symbol}/snapshot`
    );
    return data;
  },

  async searchAssets(query: string) {
    const { data } = await alpacaClient.get("/v2/assets", {
      params: { status: "active", asset_class: "us_equity" },
    });
    return data.filter(
      (a: { symbol: string; name: string; tradable: boolean; fractionable: boolean }) =>
        (a.symbol.toLowerCase().includes(query.toLowerCase()) ||
          a.name.toLowerCase().includes(query.toLowerCase())) &&
        a.tradable &&
        a.fractionable
    );
  },
};

export default alpacaApi;
