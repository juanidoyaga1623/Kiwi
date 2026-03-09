"use client";

import { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  CrosshairMode,
  CandlestickSeries,
  LineSeries,
  ISeriesApi,
  SeriesType,
} from "lightweight-charts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Timeframe } from "@/types";

const TIMEFRAMES: Timeframe[] = ["1D", "1W", "1M", "3M", "1Y"];

interface PriceChartProps {
  symbol: string;
}

interface Bar {
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
}

export function PriceChart({ symbol }: PriceChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
  // Track active series so we can remove them before re-drawing
  const seriesRef = useRef<ISeriesApi<SeriesType>[]>([]);
  const [timeframe, setTimeframe] = useState<Timeframe>("1M");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "hsl(222, 47%, 5%)" },
        textColor: "hsl(215, 20%, 50%)",
      },
      grid: {
        vertLines: { color: "hsl(222, 47%, 13%)" },
        horzLines: { color: "hsl(222, 47%, 13%)" },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: {
        borderColor: "hsl(222, 47%, 13%)",
      },
      timeScale: {
        borderColor: "hsl(222, 47%, 13%)",
        timeVisible: true,
        secondsVisible: false,
      },
      width: containerRef.current.clientWidth,
      height: 320,
    });

    chartRef.current = chart;

    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = chartRef.current;

    // Remove all previously tracked series
    for (const s of seriesRef.current) {
      chart.removeSeries(s);
    }
    seriesRef.current = [];

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/stocks/${symbol}/bars?timeframe=${timeframe}`
        );
        if (!res.ok) throw new Error("Error al cargar datos");
        const { bars } = await res.json();

        if (!bars || bars.length === 0) {
          setError("Sin datos para este período");
          return;
        }

        // lightweight-charts v5: use addSeries() with a series descriptor
        const candleSeries = chart.addSeries(CandlestickSeries, {
          upColor: "#34d399",
          downColor: "#f87171",
          borderUpColor: "#34d399",
          borderDownColor: "#f87171",
          wickUpColor: "#34d399",
          wickDownColor: "#f87171",
        });
        seriesRef.current.push(candleSeries);

        candleSeries.setData(
          bars.map((b: Bar) => ({
            time: Math.floor(b.t / 1000) as unknown as import("lightweight-charts").Time,
            open: b.o,
            high: b.h,
            low: b.l,
            close: b.c,
          }))
        );

        // SMA 20
        const sma20Series = chart.addSeries(LineSeries, {
          color: "#60a5fa",
          lineWidth: 1,
          title: "SMA 20",
        });
        seriesRef.current.push(sma20Series);

        const sma20Data = bars
          .slice(19)
          .map((b: Bar, i: number) => ({
            time: Math.floor(b.t / 1000) as unknown as import("lightweight-charts").Time,
            value:
              bars
                .slice(i, i + 20)
                .reduce((sum: number, x: Bar) => sum + x.c, 0) / 20,
          }));
        sma20Series.setData(sma20Data);

        // SMA 50
        if (bars.length >= 50) {
          const sma50Series = chart.addSeries(LineSeries, {
            color: "#f59e0b",
            lineWidth: 1,
            title: "SMA 50",
          });
          seriesRef.current.push(sma50Series);

          const sma50Data = bars
            .slice(49)
            .map((b: Bar, i: number) => ({
              time: Math.floor(b.t / 1000) as unknown as import("lightweight-charts").Time,
              value:
                bars
                  .slice(i, i + 50)
                  .reduce((sum: number, x: Bar) => sum + x.c, 0) / 50,
            }));
          sma50Series.setData(sma50Data);
        }

        chart.timeScale().fitContent();
      } catch (err) {
        setError("No se pudo cargar el gráfico");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, timeframe]);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-1.5">
          {TIMEFRAMES.map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? "default" : "ghost"}
              size="sm"
              className={cn(
                "h-7 px-2.5 text-xs",
                timeframe === tf
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              )}
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-blue-400" /> SMA 20
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-amber-400" /> SMA 50
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/80 z-10 rounded-b-xl">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        {error && !loading && (
          <div className="h-80 flex items-center justify-center text-sm text-muted-foreground">
            {error}
          </div>
        )}
        <div ref={containerRef} className="w-full" />
      </CardContent>
    </Card>
  );
}
