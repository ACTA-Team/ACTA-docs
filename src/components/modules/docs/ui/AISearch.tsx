"use client";

import React, { useMemo, useState } from "react";
import {
  X,
  Bot,
  ArrowRight,
  CornerDownLeft,
  FileText,
  ChevronsUpDown,
} from "lucide-react";
import { useAISearch } from "../hooks/useAISearch";
import { MarkdownContent } from "./MarkdownContent";
import { cn } from "@/lib/utils";

interface AISearchProps {
  onNavigate: (slug: string) => void;
  onClose: () => void;
}

interface PageResult {
  slug: string;
  title: string;
  section: string;
}

export function AISearch({ onNavigate, onClose }: AISearchProps) {
  const {
    query,
    setQuery,
    isLoading,
    response,
    suggestedPages,
    inputRef,
    docsData,
    t,
    handleSearch,
    handlePageClick,
  } = useAISearch({ onNavigate, onClose });

  const [askedQuery, setAskedQuery] = useState<string | null>(null);
  const [highlight, setHighlight] = useState(0);

  const examples = [t.aiExample1, t.aiExample2, t.aiExample3];

  // Instant page results while typing: title first, then section/toc matches.
  const results = useMemo<PageResult[]>(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];

    const shellPages: PageResult[] = [
      { slug: "faq", title: t.faq, section: t.support },
      { slug: "support", title: t.support, section: t.support },
    ];

    const scored: Array<PageResult & { score: number }> = [];
    const candidates: PageResult[] = [
      ...Object.values(docsData).map(page => ({
        slug: page.slug,
        title: page.title,
        section: page.section,
      })),
      ...shellPages.filter(page => !docsData[page.slug]),
    ];

    for (const page of candidates) {
      const title = page.title.toLowerCase();
      const section = page.section.toLowerCase();
      const haystack = `${title} ${section} ${page.slug.toLowerCase()} ${
        docsData[page.slug]?.tocItems.join(" ").toLowerCase() ?? ""
      }`;
      let score = 0;
      if (title.startsWith(term)) score = 4;
      else if (title.includes(term)) score = 3;
      else if (section.includes(term)) score = 2;
      else if (haystack.includes(term)) score = 1;
      if (score > 0) scored.push({ ...page, score });
    }

    return scored.sort((a, b) => b.score - a.score).slice(0, 8);
  }, [query, docsData, t]);

  // The "Ask AI" row is always the last option when there is a query.
  const rowCount = query.trim() ? results.length + 1 : 0;
  const showAnswer = askedQuery !== null && query === askedQuery;

  const runAI = (text: string) => {
    if (!text.trim()) return;
    setAskedQuery(text);
    handleSearch(text);
  };

  const activateRow = (index: number) => {
    if (index < results.length) {
      handlePageClick(results[index].slug);
    } else {
      runAI(query);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (showAnswer || rowCount === 0) {
      if (e.key === "Enter") runAI(query);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight(h => (h + 1) % rowCount);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight(h => (h - 1 + rowCount) % rowCount);
    } else if (e.key === "Enter") {
      e.preventDefault();
      activateRow(highlight);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-md animate-in fade-in-0 duration-200"
      onClick={onClose}
    >
      <div
        className="relative mt-[10vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card dark:border-white/10 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.6)] animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200 dark:bg-[#0d1017]"
        onClick={e => e.stopPropagation()}
      >
        {/* Subtle gold glow behind the header */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(255,210,31,0.07),transparent_70%)]"
        />

        {/* Search Input */}
        <div className="relative flex items-center gap-3 border-b border-border/60 px-4 py-4 dark:border-white/6">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Bot className="size-4 text-primary" />
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setHighlight(0);
            }}
            onKeyDown={onKeyDown}
            placeholder={t.searchPlaceholder}
            className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground dark:hover:bg-white/5"
            aria-label={t.toClose}
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="relative max-h-[60vh] overflow-y-auto px-3 py-3">
          {showAnswer && isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                <Bot className="size-5 animate-pulse text-primary" />
              </span>
              <span className="text-sm text-muted-foreground">
                {t.searching}
              </span>
            </div>
          ) : showAnswer && response ? (
            <div className="space-y-5 px-2 py-1">
              <MarkdownContent
                content={response}
                onNavigate={onNavigate}
                variant="compact"
              />

              {suggestedPages.length > 0 && (
                <div className="border-t border-border/60 pt-4 dark:border-white/6">
                  <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                    {t.relatedPages}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedPages.map(slug => {
                      const page = docsData[slug];
                      if (!page) return null;
                      return (
                        <button
                          key={slug}
                          onClick={() => handlePageClick(slug)}
                          className="group inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-3 py-1.5 dark:border-white/10 dark:bg-white/3 text-xs text-foreground/90 transition-colors hover:border-primary/40 hover:text-primary"
                        >
                          {page.title}
                          <ArrowRight className="size-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-60" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : rowCount > 0 ? (
            <div>
              {results.length > 0 && (
                <p className="px-3 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  {t.searchPagesLabel}
                </p>
              )}
              <div className="flex flex-col gap-0.5">
                {results.map((page, index) => (
                  <button
                    key={page.slug}
                    type="button"
                    onClick={() => activateRow(index)}
                    onMouseEnter={() => setHighlight(index)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                      highlight === index
                        ? "bg-muted/70 dark:bg-white/5"
                        : "hover:bg-muted/40 dark:hover:bg-white/3"
                    )}
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted/50 text-muted-foreground">
                      <FileText className="size-3.5" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                      {page.title}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground/70">
                      {page.section}
                    </span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => activateRow(results.length)}
                  onMouseEnter={() => setHighlight(results.length)}
                  className={cn(
                    "mt-1 flex items-center gap-3 rounded-lg border-t border-border/60 px-3 pb-2.5 pt-3 text-left transition-colors dark:border-white/6",
                    highlight === results.length
                      ? "bg-muted/70 dark:bg-white/5"
                      : "hover:bg-muted/40 dark:hover:bg-white/3"
                  )}
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Bot className="size-3.5" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                    {t.askAiPrefix}{" "}
                    <span className="text-muted-foreground">
                      &ldquo;{query}&rdquo;
                    </span>
                  </span>
                  <CornerDownLeft className="size-3.5 shrink-0 text-muted-foreground/60" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-10 text-center">
              <span className="mb-4 flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                <Bot className="size-5 text-primary" />
              </span>
              <p className="mb-8 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {t.askAnything}
              </p>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                {t.aiSuggestionsLabel}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {examples.map(example => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => {
                      setQuery(example);
                      runAI(example);
                    }}
                    className="rounded-full border border-border bg-muted/40 px-3.5 py-1.5 dark:border-white/10 dark:bg-white/3 text-xs text-foreground/85 transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="relative flex items-center justify-between border-t border-border/60 bg-muted/30 px-4 py-2.5 dark:border-white/6 dark:bg-white/2">
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground/80">
            <Bot className="size-3 text-primary/70" />
            {t.poweredByAI}
          </span>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground/70">
            <kbd className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/60 px-1.5 dark:border-white/10 dark:bg-white/5 py-0.5 font-sans text-[10px]">
              <ChevronsUpDown className="size-2.5" />
            </kbd>
            <span>{t.toNavigate}</span>
            <kbd className="ml-1 inline-flex items-center gap-1 rounded-md border border-border bg-muted/60 px-1.5 dark:border-white/10 dark:bg-white/5 py-0.5 font-sans text-[10px]">
              <CornerDownLeft className="size-2.5" />
              Enter
            </kbd>
            <span>{t.toSearch}</span>
            <kbd className="ml-1 rounded-md border border-border bg-muted/60 px-1.5 dark:border-white/10 dark:bg-white/5 py-0.5 font-sans text-[10px]">
              Esc
            </kbd>
            <span>{t.toClose}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
