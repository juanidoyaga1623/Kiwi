import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Bell, CreditCard, User } from "lucide-react";

export const metadata: Metadata = { title: "Ajustes" };

export default function SettingsPage() {

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Ajustes</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Configurá tu cuenta y preferencias
        </p>
      </div>

      {/* Profile */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <User className="h-4 w-4" />
            Perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Usuario Demo</p>
              <p className="text-sm text-muted-foreground">demo@kiwi.app</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-emerald-400/10 text-emerald-400">
            Activo
          </Badge>
        </CardContent>
      </Card>

      {/* Trading mode */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Modo de trading
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <div>
              <p className="text-sm font-medium text-foreground">Paper Trading</p>
              <p className="text-xs text-muted-foreground">
                Operás con $10.000 USD simulados — sin riesgo real
              </p>
            </div>
            <Badge className="bg-primary text-primary-foreground">Activo</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Las órdenes se ejecutan en Alpaca Paper Trading. Los datos de precios son reales,
            pero el dinero es simulado.
          </p>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              label: "Órdenes ejecutadas",
              desc: "Recibí un email cuando se ejecuta una orden",
              enabled: true,
            },
            {
              label: "DCA automático",
              desc: "Notificación de compras programadas",
              enabled: true,
            },
            {
              label: "Resumen semanal",
              desc: "Resumen del rendimiento de tu portfolio",
              enabled: false,
            },
          ].map((notif) => (
            <div key={notif.label} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-foreground">{notif.label}</p>
                <p className="text-xs text-muted-foreground">{notif.desc}</p>
              </div>
              <Badge
                variant="secondary"
                className={
                  notif.enabled
                    ? "bg-emerald-400/10 text-emerald-400"
                    : "bg-zinc-700 text-zinc-400"
                }
              >
                {notif.enabled ? "Activado" : "Desactivado"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            La autenticación es gestionada por{" "}
            <span className="text-foreground font-medium">Clerk</span>.
            Podés cambiar tu contraseña y configurar 2FA desde el menú de perfil.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
