"use client";

import { useCallback, useState } from "react";
import { Loader2, Play } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const runBtnClass =
  "inline-flex w-fit max-w-full shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60";

export function HealthTryLive() {
  const { t } = useI18n();
  const [status, setStatus] = useState<number | null>(null);
  const [body, setBody] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const run = useCallback(async () => {
    setLoading(true);
    setBody(null);
    setStatus(null);
    try {
      const res = await fetch("/api/acta-health", { cache: "no-store" });
      const text = await res.text();
      setStatus(res.status);
      let display = text;
      try {
        display = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        // keep raw text
      }
      setBody(display);
    } catch (e) {
      setStatus(0);
      setBody(e instanceof Error ? e.message : t.healthTryUnexpectedError);
    } finally {
      setLoading(false);
    }
  }, [t.healthTryUnexpectedError]);

  return (
    <div
      className="my-8 flex max-w-2xl flex-col gap-4 rounded-2xl border border-border/70 bg-card/30 px-5 py-5"
      data-health-try-live
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-x-6">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground/80">
            {t.healthTryBadge}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t.healthTryDescription}
          </p>
        </div>
        <button
          type="button"
          className={cn(runBtnClass, "self-start sm:mt-0.5")}
          onClick={run}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="size-3.5 shrink-0 animate-spin" aria-hidden />
          ) : (
            <Play className="size-3.5 shrink-0 opacity-90" aria-hidden />
          )}
          {loading ? t.healthTryLoading : t.healthTryButton}
        </button>
      </div>
      {status !== null && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            {t.healthTryHttpLabel}:{" "}
            <span className="tabular-nums text-foreground">{status}</span>
          </p>
          {body !== null && (
            <pre className="max-h-64 overflow-auto rounded-xl border border-border/60 bg-muted/40 p-4 text-left text-[13px] leading-relaxed text-foreground">
              {body}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
