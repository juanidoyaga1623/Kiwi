"use client";

import { useState, useEffect, useCallback } from "react";
import type { OrderRecord } from "@/types";

interface UseOrdersReturn {
  orders: OrderRecord[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useOrders(filters?: {
  symbol?: string;
  side?: "BUY" | "SELL";
  status?: string;
  limit?: number;
}): UseOrdersReturn {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters?.symbol) params.set("symbol", filters.symbol);
      if (filters?.side) params.set("side", filters.side);
      if (filters?.status) params.set("status", filters.status);
      if (filters?.limit) params.set("limit", filters.limit.toString());

      const res = await fetch(`/api/orders?${params}`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [filters?.symbol, filters?.side, filters?.status, filters?.limit]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
}
