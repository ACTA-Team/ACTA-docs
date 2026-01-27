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
    <aside className="w-64 border-l border-border p-6 hidden xl:block">
      <nav className="sticky top-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">
          {t.onThisPage}
        </p>
        <ul className="space-y-3">
          {items.map((item, idx) => (
            <li key={idx}>
              <a
                href={`#${slugifyHeading(item)}`}
                className={`text-sm ${
                  idx === 0
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        {/* Feedback */}
        <div className="mt-12 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">
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
