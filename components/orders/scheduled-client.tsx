"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import {
  Plus,
  Pause,
  Play,
  Trash2,
  Loader2,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { ScheduledOrderRecord, ScheduleFrequency } from "@/types";

const FREQUENCY_LABELS: Record<ScheduleFrequency, string> = {
  DAILY: "Diario",
  WEEKLY: "Semanal",
  BIWEEKLY: "Quincenal",
  MONTHLY: "Mensual",
};

const scheduledSchema = z.object({
  symbol: z.string().min(1, "Ingresá un ticker").max(5).toUpperCase(),
  notional: z.number().min(1, "Mínimo $1"),
  frequency: z.enum(["DAILY", "WEEKLY", "BIWEEKLY", "MONTHLY"]),
});

type ScheduledFormValues = z.infer<typeof scheduledSchema>;

const MOCK_SCHEDULED: ScheduledOrderRecord[] = [
  {
    id: "sched_1",
    symbol: "AAPL",
    companyName: "Apple Inc.",
    side: "BUY",
    notional: 25,
    frequency: "WEEKLY",
    active: true,
    nextRunAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    lastRunAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    totalExecuted: 8,
    totalInvested: 200,
  },
  {
    id: "sched_2",
    symbol: "MSFT",
    companyName: "Microsoft Corporation",
    side: "BUY",
    notional: 50,
    frequency: "MONTHLY",
    active: true,
    nextRunAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    lastRunAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    totalExecuted: 3,
    totalInvested: 150,
  },
  {
    id: "sched_3",
    symbol: "NVDA",
    companyName: "NVIDIA Corporation",
    side: "BUY",
    notional: 10,
    frequency: "DAILY",
    active: false,
    nextRunAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    lastRunAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    totalExecuted: 12,
    totalInvested: 120,
  },
];

export function ScheduledClient() {
  const [orders, setOrders] = useState<ScheduledOrderRecord[]>(MOCK_SCHEDULED);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ScheduledFormValues>({
    resolver: zodResolver(scheduledSchema),
    defaultValues: { frequency: "WEEKLY", notional: 25 },
  });

  const frequency = watch("frequency");

  const onSubmit = async (values: ScheduledFormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/scheduled-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, side: "BUY" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Optimistic UI
      const newOrder: ScheduledOrderRecord = {
        id: data.id || `temp_${Date.now()}`,
        symbol: values.symbol,
        companyName: null,
        side: "BUY",
        notional: values.notional,
        frequency: values.frequency as ScheduleFrequency,
        active: true,
        nextRunAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        lastRunAt: null,
        totalExecuted: 0,
        totalInvested: 0,
      };
      setOrders((prev) => [newOrder, ...prev]);

      toast.success("Orden programada creada", {
        description: `${values.symbol} — ${formatCurrency(values.notional)} ${FREQUENCY_LABELS[values.frequency as ScheduleFrequency]}`,
      });
      reset();
      setDialogOpen(false);
    } catch (err: unknown) {
      toast.error("Error al crear la orden", {
        description: err instanceof Error ? err.message : "Intentá de nuevo",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, active: !o.active } : o))
    );
    toast.success(currentActive ? "Orden pausada" : "Orden activada");
  };

  const deleteOrder = async (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    toast.success("Orden eliminada");
  };

  const totalMonthly = orders
    .filter((o) => o.active)
    .reduce((sum, o) => {
      const multiplier =
        o.frequency === "DAILY"
          ? 30
          : o.frequency === "WEEKLY"
          ? 4.3
          : o.frequency === "BIWEEKLY"
          ? 2.15
          : 1;
      return sum + o.notional * multiplier;
    }, 0);

  return (
    <div className="space-y-6">
      {/* Stats + Create button */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-4 flex-wrap">
          <div className="bg-card border border-border rounded-xl px-4 py-3">
            <p className="text-xs text-muted-foreground">Órdenes activas</p>
            <p className="text-xl font-bold text-foreground">
              {orders.filter((o) => o.active).length}
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl px-4 py-3">
            <p className="text-xs text-muted-foreground">Inversión mensual estimada</p>
            <p className="text-xl font-bold text-foreground tabular-nums">
              {formatCurrency(totalMonthly)}
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl px-4 py-3">
            <p className="text-xs text-muted-foreground">Total invertido</p>
            <p className="text-xl font-bold text-foreground tabular-nums">
              {formatCurrency(orders.reduce((sum, o) => sum + o.totalInvested, 0))}
            </p>
          </div>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Nueva orden DCA
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                Crear orden programada
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Ticker</Label>
                <Input
                  {...register("symbol")}
                  placeholder="AAPL"
                  className="bg-accent border-border uppercase"
                  onChange={(e) =>
                    setValue("symbol", e.target.value.toUpperCase())
                  }
                />
                {errors.symbol && (
                  <p className="text-xs text-red-400">{errors.symbol.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Monto (USD)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    $
                  </span>
                  <Input
                    type="number"
                    step="0.01"
                    min="1"
                    {...register("notional", { valueAsNumber: true })}
                    className="pl-7 bg-accent border-border tabular-nums"
                    placeholder="25.00"
                  />
                </div>
                {errors.notional && (
                  <p className="text-xs text-red-400">
                    {errors.notional.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Frecuencia
                </Label>
                <Select
                  value={frequency}
                  onValueChange={(v) =>
                    setValue("frequency", v as ScheduleFrequency)
                  }
                >
                  <SelectTrigger className="bg-accent border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {Object.entries(FREQUENCY_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-primary-foreground"
              >
                {submitting && (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                )}
                Crear orden programada
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Orders list */}
      {orders.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Clock className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-sm">No tenés órdenes programadas</p>
          <p className="text-xs mt-1">
            Creá tu primera orden DCA para automatizar tus inversiones
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card
              key={order.id}
              className={`bg-card border-border transition-all ${
                !order.active ? "opacity-60" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  {/* Left */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                      <span className="text-sm font-bold text-foreground">
                        {order.symbol.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-foreground">{order.symbol}</p>
                        <Badge
                          variant="secondary"
                          className={
                            order.active
                              ? "bg-emerald-400/10 text-emerald-400 text-xs"
                              : "bg-zinc-400/10 text-zinc-400 text-xs"
                          }
                        >
                          {order.active ? "Activa" : "Pausada"}
                        </Badge>
                      </div>
                      {order.companyName && (
                        <p className="text-xs text-muted-foreground">
                          {order.companyName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: controls */}
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={order.active}
                      onCheckedChange={() => toggleActive(order.id, order.active)}
                      className="data-[state=checked]:bg-primary"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-red-400"
                      onClick={() => deleteOrder(order.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Details grid */}
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Monto</p>
                    <p className="text-sm font-semibold text-foreground tabular-nums">
                      {formatCurrency(order.notional)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Frecuencia</p>
                    <p className="text-sm font-semibold text-foreground">
                      {FREQUENCY_LABELS[order.frequency]}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Próxima ejecución</p>
                    <p className="text-sm font-semibold text-foreground">
                      {format(new Date(order.nextRunAt), "dd/MM/yyyy", { locale: es })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total invertido</p>
                    <p className="text-sm font-semibold text-foreground tabular-nums">
                      {formatCurrency(order.totalInvested)}
                    </p>
                  </div>
                </div>

                {/* Progress bar: executions */}
                {order.totalExecuted > 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-primary" />
                    <p className="text-xs text-muted-foreground">
                      {order.totalExecuted} ejecuciones completadas
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
