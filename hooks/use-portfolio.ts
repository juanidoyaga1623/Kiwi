"use client";

import { useState, useEffect, useCallback } from "react";
import type { PortfolioSummary } from "@/types";

interface UsePortfolioReturn {
  portfolio: PortfolioSummary | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePortfolio(): UsePortfolioReturn {
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/portfolio");
      if (!res.ok) throw new Error("Failed to fetch portfolio");
      const data = await res.json();
      setPortfolio(data.portfolio);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolio();
    // Refresh every 30 seconds
    const interval = setInterval(fetchPortfolio, 30_000);
    return () => clearInterval(interval);
  }, [fetchPortfolio]);

  return { portfolio, loading, error, refetch: fetchPortfolio };
}
