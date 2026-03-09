"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatShares, exportToCSV } from "@/lib/utils";
import type { OrderRecord, OrderStatus } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pendiente",
  ACCEPTED: "Aceptada",
  PARTIALLY_FILLED: "Parcial",
  FILLED: "Ejecutada",
  CANCELED: "Cancelada",
  EXPIRED: "Expirada",
  REJECTED: "Rechazada",
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-400/10 text-yellow-400",
  ACCEPTED: "bg-blue-400/10 text-blue-400",
  PARTIALLY_FILLED: "bg-orange-400/10 text-orange-400",
  FILLED: "bg-emerald-400/10 text-emerald-400",
  CANCELED: "bg-zinc-400/10 text-zinc-400",
  EXPIRED: "bg-zinc-400/10 text-zinc-400",
  REJECTED: "bg-red-400/10 text-red-400",
};

interface HistoryClientProps {
  initialOrders: OrderRecord[];
}

export function HistoryClient({ initialOrders }: HistoryClientProps) {
  const [search, setSearch] = useState("");
  const [sideFilter, setSideFilter] = useState<"ALL" | "BUY" | "SELL">("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filtered = useMemo(() => {
    return initialOrders.filter((o) => {
      const matchSearch =
        !search ||
        o.symbol.toLowerCase().includes(search.toLowerCase()) ||
        (o.companyName?.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchSide = sideFilter === "ALL" || o.side === sideFilter;
      const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
      return matchSearch && matchSide && matchStatus;
    });
  }, [initialOrders, search, sideFilter, statusFilter]);

  const handleExport = () => {
    const csvData = filtered.map((o) => ({
      Fecha: format(new Date(o.createdAt), "dd/MM/yyyy HH:mm"),
      Ticker: o.symbol,
      Empresa: o.companyName || "",
      Tipo: o.side === "BUY" ? "Compra" : "Venta",
      "Modo orden": o.type,
      Estado: STATUS_LABELS[o.status],
      "Cantidad (acc)": o.filledQty ?? o.quantity ?? "",
      "Monto USD": o.notional ?? "",
      "Precio ejecutado": o.filledAvgPrice ?? "",
      "Total ejecutado": o.filledQty && o.filledAvgPrice
        ? (o.filledQty * o.filledAvgPrice).toFixed(2)
        : "",
    }));
    exportToCSV(csvData, `kiwi-historial-${format(new Date(), "yyyy-MM-dd")}`);
  };

  const stats = useMemo(() => {
    const filled = initialOrders.filter((o) => o.status === "FILLED");
    const buys = filled.filter((o) => o.side === "BUY");
    const sells = filled.filter((o) => o.side === "SELL");
    const totalInvested = buys.reduce(
      (sum, o) => sum + (o.notional ?? (o.filledQty ?? 0) * (o.filledAvgPrice ?? 0)),
      0
    );
    return { total: filled.length, buys: buys.length, sells: sells.length, totalInvested };
  }, [initialOrders]);

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Órdenes ejecutadas", value: stats.total.toString() },
          { label: "Compras", value: stats.buys.toString() },
          { label: "Ventas", value: stats.sells.toString() },
          { label: "Total invertido", value: formatCurrency(stats.totalInvested) },
        ].map((s) => (
          <Card key={s.label} className="bg-card border-border">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold text-foreground tabular-nums mt-1">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Buscar por ticker..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 bg-accent border-border h-9 text-sm"
          />
        </div>

        <Select
          value={sideFilter}
          onValueChange={(v) => setSideFilter(v as "ALL" | "BUY" | "SELL")}
        >
          <SelectTrigger className="w-32 bg-accent border-border h-9 text-sm">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="ALL">Todos</SelectItem>
            <SelectItem value="BUY">Compras</SelectItem>
            <SelectItem value="SELL">Ventas</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 bg-accent border-border h-9 text-sm">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="ALL">Todos los estados</SelectItem>
            <SelectItem value="FILLED">Ejecutadas</SelectItem>
            <SelectItem value="PENDING">Pendientes</SelectItem>
            <SelectItem value="CANCELED">Canceladas</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="border-border text-muted-foreground hover:text-foreground h-9"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="bg-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground text-xs">Fecha</TableHead>
                <TableHead className="text-muted-foreground text-xs">Ticker</TableHead>
                <TableHead className="text-muted-foreground text-xs">Tipo</TableHead>
                <TableHead className="text-muted-foreground text-xs">Monto</TableHead>
                <TableHead className="text-muted-foreground text-xs">Cantidad</TableHead>
                <TableHead className="text-muted-foreground text-xs">Precio</TableHead>
                <TableHead className="text-muted-foreground text-xs">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-sm">
                    Sin órdenes para los filtros seleccionados
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((order) => (
                  <TableRow
                    key={order.id}
                    className="border-border hover:bg-accent/50 transition-colors"
                  >
                    <TableCell className="text-xs text-muted-foreground tabular-nums">
                      {format(new Date(order.createdAt), "dd/MM/yy HH:mm", { locale: es })}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{order.symbol}</p>
                        {order.companyName && (
                          <p className="text-[10px] text-muted-foreground truncate max-w-[100px]">
                            {order.companyName}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs font-medium",
                          order.side === "BUY"
                            ? "bg-emerald-400/10 text-emerald-400"
                            : "bg-red-400/10 text-red-400"
                        )}
                      >
                        {order.side === "BUY" ? "Compra" : "Venta"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm tabular-nums text-foreground">
                      {order.notional
                        ? formatCurrency(order.notional)
                        : order.filledQty && order.filledAvgPrice
                        ? formatCurrency(order.filledQty * order.filledAvgPrice)
                        : "—"}
                    </TableCell>
                    <TableCell className="text-sm tabular-nums text-muted-foreground">
                      {order.filledQty
                        ? formatShares(order.filledQty) + " acc."
                        : order.quantity
                        ? formatShares(order.quantity) + " acc."
                        : "—"}
                    </TableCell>
                    <TableCell className="text-sm tabular-nums text-muted-foreground">
                      {order.filledAvgPrice
                        ? formatCurrency(order.filledAvgPrice)
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${STATUS_STYLES[order.status]}`}
                      >
                        {STATUS_LABELS[order.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
