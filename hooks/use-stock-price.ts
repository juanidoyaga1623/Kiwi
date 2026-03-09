"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface StockPrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: Date;
}

interface UseStockPriceReturn {
  data: StockPrice | null;
  loading: boolean;
  connected: boolean;
}

// Uses Polygon.io WebSocket for real-time price streaming
export function useStockPrice(symbol: string): UseStockPriceReturn {
  const [data, setData] = useState<StockPrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSnapshot = useCallback(async () => {
    try {
      const res = await fetch(`/api/stocks/${symbol}/snapshot`);
      if (!res.ok) return;
      const snap = await res.json();
      setData({
        symbol: snap.symbol,
        price: snap.price,
        change: snap.change,
        changePercent: snap.changePercent,
        lastUpdated: new Date(),
      });
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  const connectWebSocket = useCallback(() => {
    const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
    if (!apiKey) return;

    const ws = new WebSocket("wss://socket.polygon.io/stocks");
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ action: "auth", params: apiKey }));
    };

    ws.onmessage = (event) => {
      const messages = JSON.parse(event.data);
      for (const msg of messages) {
        if (msg.ev === "status" && msg.status === "auth_success") {
          ws.send(
            JSON.stringify({ action: "subscribe", params: `T.${symbol}` })
          );
          setConnected(true);
        }

        if (msg.ev === "T" && msg.sym === symbol) {
          setData((prev) => ({
            symbol,
            price: msg.p,
            change: prev ? msg.p - (prev.price - prev.change) : 0,
            changePercent: prev
              ? ((msg.p - (prev.price - prev.change)) /
                  (prev.price - prev.change)) *
                100
              : 0,
            lastUpdated: new Date(msg.t),
          }));
          setLoading(false);
        }
      }
    };

    ws.onerror = () => {
      setConnected(false);
    };

    ws.onclose = () => {
      setConnected(false);
      // Reconnect after 5 seconds
      reconnectRef.current = setTimeout(connectWebSocket, 5000);
    };
  }, [symbol]);

  useEffect(() => {
    // First fetch snapshot for immediate data
    fetchSnapshot();

    // Then try WebSocket for real-time
    connectWebSocket();

    // Poll every 10s as fallback
    const pollInterval = setInterval(fetchSnapshot, 10_000);

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current);
      }
      clearInterval(pollInterval);
    };
  }, [symbol, fetchSnapshot, connectWebSocket]);

  return { data, loading, connected };
}
