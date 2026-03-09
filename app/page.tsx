import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TrendingUp, Shield, Zap, Clock } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-black text-sm">K</span>
            </div>
            <span className="font-bold text-lg text-foreground">Kiwi</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="text-muted-foreground">
              <Link href="/sign-in">Iniciar sesión</Link>
            </Button>
            <Button asChild className="bg-primary text-primary-foreground">
              <Link href="/sign-up">Empezar gratis</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Paper Trading — Sin riesgo real
        </div>

        <h1 className="text-5xl font-black text-foreground leading-tight mb-6">
          Invertí en las mejores
          <br />
          <span className="text-primary">acciones del mundo</span>
          <br />
          desde $1 USD
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Apple, Tesla, NVIDIA y más. Con Kiwi podés comprar fracciones de acciones
          americanas con cualquier monto. Sin mínimos. Sin complicaciones.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Button size="lg" asChild className="bg-primary text-primary-foreground px-8 h-12">
            <Link href="/sign-up">Comenzar ahora — es gratis</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="border-border h-12">
            <Link href="/education">Aprender primero</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: TrendingUp,
              title: "Acciones fraccionadas",
              desc: "Comprá $10 de AAPL o $5 de NVDA. Sin necesitar el precio completo.",
            },
            {
              icon: Clock,
              title: "DCA automático",
              desc: "Configurá compras recurrentes diarias, semanales o mensuales.",
            },
            {
              icon: Zap,
              title: "Precios en tiempo real",
              desc: "Datos live via Polygon.io y gráficos de velas interactivos.",
            },
            {
              icon: Shield,
              title: "Paper Trading seguro",
              desc: "Aprendé sin arriesgar dinero real. $10.000 USD simulados para empezar.",
            },
          ].map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="p-5 rounded-2xl bg-card border border-border"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-1.5">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-foreground mb-3">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="text-muted-foreground">
            Miles de argentinos ya invierten en el mercado americano con Kiwi
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              name: "Lucía M.",
              role: "Diseñadora, 28 años",
              avatar: "LM",
              quote:
                "Empecé con $20 en Apple y hoy tengo un portfolio diversificado. Kiwi me dio confianza para dar el primer paso sin miedo a perder todo.",
            },
            {
              name: "Matías R.",
              role: "Desarrollador, 32 años",
              avatar: "MR",
              quote:
                "El DCA automático es un golazo. Configuro $50 semanales en NVIDIA y no tengo que estar mirando el mercado todo el día. Funciona solo.",
            },
            {
              name: "Valentina G.",
              role: "Contadora, 25 años",
              avatar: "VG",
              quote:
                "Los gráficos y datos en tiempo real son increíbles para aprender. Empecé en paper trading y ya me siento lista para invertir dinero real.",
            },
          ].map((t) => (
            <div
              key={t.name}
              className="p-6 rounded-2xl bg-card border border-border flex flex-col gap-4"
            >
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">{t.avatar}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between text-sm text-muted-foreground">
          <span>© 2024 Kiwi. Paper trading — sin dinero real.</span>
          <Link href="/education" className="hover:text-foreground transition-colors">
            Centro educativo
          </Link>
        </div>
      </footer>
    </div>
  );
}
