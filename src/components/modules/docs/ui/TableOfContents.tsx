"use client";

import { ThumbsUp, ThumbsDown, Minus } from "lucide-react";
import { slugifyHeading, cn } from "@/lib/utils";
import { useTableOfContents } from "../hooks/useTableOfContents";

interface TableOfContentsProps {
  items: string[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const { feedback, setFeedback, t } = useTableOfContents();

  const baseBtn =
    "p-2 rounded-lg transition-colors text-muted-foreground hover:text-foreground";
  const selected = "bg-secondary text-foreground";
  const unselected = "hover:bg-secondary";

  return (
    <aside className="hidden w-52 shrink-0 border-l border-border/50 py-8 pl-6 pr-4 2xl:block">
      <nav className="sticky top-20">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
          {t.onThisPage}
        </p>
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li key={idx}>
              <a
                href={`#${slugifyHeading(item)}`}
                className={`block truncate text-[13px] leading-snug transition-colors ${
                  idx === 0
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        {/* Feedback */}
        <div className="mt-10 border-t border-border/50 pt-5">
          <p className="mb-3 text-xs text-muted-foreground">
            {t.wasThisHelpful}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFeedback("up")}
              className={cn(baseBtn, feedback === "up" ? selected : unselected)}
              aria-label="Helpful"
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => setFeedback("neutral")}
              className={cn(
                baseBtn,
                feedback === "neutral" ? selected : unselected
              )}
              aria-label="Neutral"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setFeedback("down")}
              className={cn(
                baseBtn,
                feedback === "down" ? selected : unselected
              )}
              aria-label="Not helpful"
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
          </div>
          {feedback && (
            <p className="mt-3 text-xs text-muted-foreground">
              {feedback === "up"
                ? "Thanks for your feedback."
                : "Thanks, we'll use your feedback to improve."}
            </p>
          )}
        </div>
      </nav>
    </aside>
  );
}
