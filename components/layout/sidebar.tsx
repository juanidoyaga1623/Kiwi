"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Search,
  History,
  BookOpen,
  Clock,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Portfolio",
    href: "/portfolio",
    icon: TrendingUp,
  },
  {
    label: "Explorar",
    href: "/explore",
    icon: Search,
  },
  {
    label: "Historial",
    href: "/history",
    icon: History,
  },
  {
    label: "Educación",
    href: "/education",
    icon: BookOpen,
  },
  {
    label: "Programadas",
    href: "/scheduled",
    icon: Clock,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative flex flex-col h-screen bg-card border-r border-border transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-border shrink-0">
        <Link href="/dashboard" className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-sm">K</span>
          </div>
          {!collapsed && (
            <span className="font-bold text-lg text-foreground tracking-tight">
              Kiwi
            </span>
          )}
        </Link>
      </div>

      {/* Toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 z-10 h-6 w-6 rounded-full border border-border bg-card hover:bg-accent"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon
                className={cn(
                  "shrink-0",
                  collapsed ? "h-5 w-5" : "h-4 w-4",
                  isActive ? "text-primary" : ""
                )}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-border p-3 space-y-2">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-muted-foreground hover:text-foreground hover:bg-accent",
            pathname === "/settings" && "bg-primary/15 text-primary"
          )}
        >
          <Settings className={cn("shrink-0", collapsed ? "h-5 w-5" : "h-4 w-4")} />
          {!collapsed && <span>Ajustes</span>}
        </Link>

        <div
          className={cn(
            "flex items-center gap-3 px-3 py-2",
            collapsed && "justify-center"
          )}
        >
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-primary">D</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs text-foreground font-medium truncate">Demo</p>
              <p className="text-xs text-muted-foreground truncate">Cuenta</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
