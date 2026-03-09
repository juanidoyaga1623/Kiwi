import type { Metadata } from "next";
import { PriceChart } from "@/components/stock/price-chart";
import { TradeForm } from "@/components/stock/trade-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import { TrendingUp, TrendingDown, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: { symbol: string };
}

async function getStockData(symbol: string) {
  // In production this will call real APIs
  // For now return mock data
  const mockData: Record<string, {
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
    marketCap: number;
    description: string;
  }> = {
    AAPL: {
      symbol: "AAPL",
      name: "Apple Inc.",
      price: 189.84,
      change: 2.34,
      changePercent: 1.25,
      open: 187.5,
      high: 190.54,
      low: 187.18,
      previousClose: 187.5,
      volume: 54_230_000,
      marketCap: 2_950_000_000_000,
      description:
        "Apple Inc. diseña, fabrica y comercializa smartphones, computadoras personales, tablets, wearables y accesorios. La compañía es conocida por el iPhone, iPad, Mac, y servicios como iCloud y Apple Music.",
    },
    TSLA: {
      symbol: "TSLA",
      name: "Tesla, Inc.",
      price: 178.79,
      change: -4.52,
      changePercent: -2.46,
      open: 183.31,
      high: 184.2,
      low: 177.8,
      previousClose: 183.31,
      volume: 112_450_000,
      marketCap: 569_000_000_000,
      description:
        "Tesla, Inc. diseña, desarrolla, fabrica, arrienda y vende vehículos eléctricos, sistemas de almacenamiento de energía y paneles solares. Sus productos incluyen el Model 3, Model S, Model X y Model Y.",
    },
    NVDA: {
      symbol: "NVDA",
      name: "NVIDIA Corporation",
      price: 875.39,
      change: 15.82,
      changePercent: 1.84,
      open: 859.57,
      high: 878.12,
      low: 857.3,
      previousClose: 859.57,
      volume: 42_100_000,
      marketCap: 2_150_000_000_000,
      description:
        "NVIDIA Corporation diseña y fabrica GPUs y sistemas-en-chip para gaming, centros de datos, automoción y visualización profesional. Es líder en chips para inteligencia artificial.",
    },
    MSFT: {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      price: 415.8,
      change: 3.1,
      changePercent: 0.75,
      open: 412.7,
      high: 417.23,
      low: 411.8,
      previousClose: 412.7,
      volume: 20_300_000,
      marketCap: 3_090_000_000_000,
      description:
        "Microsoft Corporation desarrolla y licencia software, hardware y servicios en la nube. Sus productos incluyen Windows, Office, Azure, Xbox y LinkedIn.",
    },
  };

  return mockData[symbol.toUpperCase()] || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return { title: `${params.symbol.toUpperCase()} — Detalle` };
}

export default async function StockDetailPage({ params }: PageProps) {
  const symbol = params.symbol.toUpperCase();
  const stock = await getStockData(symbol);

  if (!stock && !["GOOGL", "AMZN", "META", "NFLX"].includes(symbol)) {
    // Allow other symbols to load with generic data
  }

  const stockData = stock || {
    symbol,
    name: symbol,
    price: 100.0,
    change: 0,
    changePercent: 0,
    open: 100,
    high: 101,
    low: 99,
    previousClose: 100,
    volume: 1_000_000,
    marketCap: 10_000_000_000,
    description: "Datos en tiempo real disponibles con la API de Polygon.io.",
  };

  const isPositive = stockData.change >= 0;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Back */}
      <Button variant="ghost" size="sm" asChild className="text-muted-foreground -ml-2">
        <Link href="/explore">
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Explorar
        </Link>
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center">
            <span className="text-xl font-black text-foreground">
              {symbol.slice(0, 2)}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-foreground">{symbol}</h1>
              <Badge variant="secondary" className="text-xs">NYSE</Badge>
            </div>
            <p className="text-muted-foreground text-sm">{stockData.name}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-3xl font-black text-foreground tabular-nums">
            {formatCurrency(stockData.price)}
          </p>
          <div className="flex items-center gap-1.5 justify-end mt-1">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
            <span
              className={`text-sm font-semibold tabular-nums ${
                isPositive ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {isPositive ? "+" : ""}{formatCurrency(Math.abs(stockData.change))} (
              {formatPercent(stockData.changePercent)})
            </span>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart — 2/3 */}
        <div className="lg:col-span-2 space-y-4">
          <PriceChart symbol={symbol} />

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Apertura", value: formatCurrency(stockData.open) },
              { label: "Máximo", value: formatCurrency(stockData.high) },
              { label: "Mínimo", value: formatCurrency(stockData.low) },
              { label: "Cierre ant.", value: formatCurrency(stockData.previousClose) },
              {
                label: "Volumen",
                value: formatNumber(stockData.volume / 1_000_000, 2) + "M",
              },
              {
                label: "Market Cap",
                value: stockData.marketCap > 1e12
                  ? `$${(stockData.marketCap / 1e12).toFixed(2)}T`
                  : `$${(stockData.marketCap / 1e9).toFixed(0)}B`,
              },
              {
                label: "Fraccionable",
                value: "Sí",
              },
              {
                label: "Mercado",
                value: "NASDAQ / NYSE",
              },
            ].map((stat) => (
              <Card key={stat.label} className="bg-card border-border">
                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-sm font-semibold text-foreground tabular-nums mt-0.5">
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Description */}
          {stockData.description && (
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Acerca de {stockData.name}
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {stockData.description}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Trade form — 1/3 */}
        <div className="space-y-4">
          <TradeForm
            symbol={symbol}
            companyName={stockData.name}
            currentPrice={stockData.price}
            availableCash={10000}
          />

          {/* DCA suggestion */}
          <Card className="bg-card border-primary/20 border">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-primary mb-1.5">
                Automatizá tu inversión
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                Configurá compras automáticas de {symbol} con Dollar-Cost Averaging.
              </p>
              <Button variant="outline" size="sm" className="w-full text-xs border-primary/30 text-primary hover:bg-primary/10" asChild>
                <Link href="/scheduled">
                  Crear DCA para {symbol}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
