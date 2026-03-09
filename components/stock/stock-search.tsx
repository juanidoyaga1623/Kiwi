"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchResult {
  ticker: string;
  name: string;
  market?: string;
  type?: string;
}

export function StockSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const debouncedSearch = useDebounce(async (q: string) => {
    if (!q || q.length < 1) {
      setResults([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`/api/stocks/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, 400);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setOpen(true);
    if (val.trim()) {
      setLoading(true);
      debouncedSearch(val.trim());
    } else {
      setResults([]);
      setLoading(false);
    }
  };

  const handleSelect = (ticker: string) => {
    setQuery("");
    setOpen(false);
    setResults([]);
    router.push(`/explore/${ticker}`);
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={query}
          onChange={handleChange}
          onFocus={() => query && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Buscá acciones — AAPL, TSLA..."
          className="pl-9 pr-9 bg-accent border-border focus-visible:ring-primary"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (query || loading) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
          {loading ? (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Buscando...
            </div>
          ) : results.length > 0 ? (
            <ul className="max-h-64 overflow-y-auto">
              {results.map((r) => (
                <li key={r.ticker}>
                  <button
                    onMouseDown={() => handleSelect(r.ticker)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent transition-colors text-left"
                  >
                    <div>
                      <span className="text-sm font-semibold text-foreground">
                        {r.ticker}
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground truncate max-w-[200px]">
                        {r.name}
                      </span>
                    </div>
                    {r.market && (
                      <span className="text-[10px] text-muted-foreground bg-accent px-1.5 py-0.5 rounded">
                        {r.market}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : query.length > 1 ? (
            <div className="px-4 py-3 text-sm text-muted-foreground">
              Sin resultados para &quot;{query}&quot;
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
