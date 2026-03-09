"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCurrency, formatShares } from "@/lib/utils";
import type { OrderSide } from "@/types";

const tradeSchema = z.object({
  amount: z.number().positive("El monto debe ser mayor a 0").min(1, "Mínimo $1"),
  shares: z.number().positive().optional(),
});

type TradeFormValues = z.infer<typeof tradeSchema>;

interface TradeFormProps {
  symbol: string;
  companyName: string;
  currentPrice: number;
  availableCash: number;
}

export function TradeForm({
  symbol,
  companyName,
  currentPrice,
  availableCash,
}: TradeFormProps) {
  const [side, setSide] = useState<OrderSide>("BUY");
  const [orderMode, setOrderMode] = useState<"amount" | "shares">("amount");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TradeFormValues>({
    resolver: zodResolver(tradeSchema),
    defaultValues: { amount: 10 },
  });

  const amount = watch("amount") || 0;
  const estimatedShares = currentPrice > 0 ? amount / currentPrice : 0;
  const estimatedAmount = orderMode === "shares" ? (watch("shares") || 0) * currentPrice : amount;

  const quickAmounts = [10, 25, 50, 100, 250];

  const onSubmit = async (values: TradeFormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        symbol,
        side,
        ...(orderMode === "amount"
          ? { notional: values.amount }
          : { qty: values.shares }),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al ejecutar la orden");
      }

      toast.success(
        `Orden de ${side === "BUY" ? "compra" : "venta"} enviada`,
        {
          description: `${symbol} — ${orderMode === "amount" ? formatCurrency(values.amount) : formatShares(values.shares || 0) + " acc."}`,
        }
      );
      reset({ amount: 10 });
    } catch (err: unknown) {
      toast.error("Error al ejecutar la orden", {
        description: err instanceof Error ? err.message : "Intentá de nuevo",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Operar {symbol}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Buy / Sell tabs */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={side === "BUY" ? "default" : "outline"}
            className={cn(
              side === "BUY"
                ? "bg-emerald-500 hover:bg-emerald-600 text-white border-0"
                : "border-border text-muted-foreground"
            )}
            onClick={() => setSide("BUY")}
          >
            Comprar
          </Button>
          <Button
            type="button"
            variant={side === "SELL" ? "default" : "outline"}
            className={cn(
              side === "SELL"
                ? "bg-red-500 hover:bg-red-600 text-white border-0"
                : "border-border text-muted-foreground"
            )}
            onClick={() => setSide("SELL")}
          >
            Vender
          </Button>
        </div>

        {/* Order mode */}
        <Tabs
          value={orderMode}
          onValueChange={(v) => setOrderMode(v as "amount" | "shares")}
        >
          <TabsList className="w-full bg-accent">
            <TabsTrigger value="amount" className="flex-1 text-xs">
              En USD
            </TabsTrigger>
            <TabsTrigger value="shares" className="flex-1 text-xs">
              En acciones
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Amount input */}
          {orderMode === "amount" ? (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Monto (USD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  $
                </span>
                <Input
                  type="number"
                  step="0.01"
                  min="1"
                  {...register("amount", { valueAsNumber: true })}
                  className="pl-7 bg-accent border-border focus-visible:ring-primary tabular-nums"
                  placeholder="10.00"
                />
              </div>
              {errors.amount && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.amount.message}
                </p>
              )}

              {/* Quick amounts */}
              <div className="flex gap-1.5 flex-wrap">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setValue("amount", q)}
                    className="text-xs px-2 py-1 rounded-md bg-accent hover:bg-accent/80 text-muted-foreground hover:text-foreground transition-colors tabular-nums"
                  >
                    ${q}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setValue("amount", Math.floor(availableCash))}
                  className="text-xs px-2 py-1 rounded-md bg-accent hover:bg-accent/80 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Máx
                </button>
              </div>

              {/* Estimate */}
              <p className="text-xs text-muted-foreground">
                ≈ {formatShares(estimatedShares)} acciones a{" "}
                {formatCurrency(currentPrice)}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Cantidad de acciones
              </Label>
              <Input
                type="number"
                step="0.000001"
                min="0.000001"
                {...register("shares", { valueAsNumber: true })}
                className="bg-accent border-border focus-visible:ring-primary tabular-nums"
                placeholder="0.000000"
              />
              <p className="text-xs text-muted-foreground">
                ≈ {formatCurrency(estimatedAmount)} USD
              </p>
            </div>
          )}

          {/* Cash balance */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Efectivo disponible</span>
            <span className="text-foreground tabular-nums font-medium">
              {formatCurrency(availableCash)}
            </span>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={submitting}
            className={cn(
              "w-full font-semibold",
              side === "BUY"
                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            )}
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {side === "BUY" ? "Comprar" : "Vender"} {symbol}
          </Button>

          <p className="text-[10px] text-muted-foreground text-center">
            Paper trading — sin dinero real
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
