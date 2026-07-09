"use client";

import React from "react";
import { X, Bot, ArrowRight, CornerDownLeft } from "lucide-react";
import { useAISearch } from "../hooks/useAISearch";
import { MarkdownContent } from "./MarkdownContent";

interface AISearchProps {
  onNavigate: (slug: string) => void;
  onClose: () => void;
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
    handleKeyDown,
    handlePageClick,
  } = useAISearch({ onNavigate, onClose });

  const examples = [t.aiExample1, t.aiExample2, t.aiExample3];

  const runExample = (example: string) => {
    setQuery(example);
    handleSearch(example);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-md animate-in fade-in-0 duration-200"
      onClick={onClose}
    >
      <div
        className="relative mt-[10vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-card shadow-[0_24px_80px_-12px_rgba(0,0,0,0.6)] animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200 dark:bg-[#0d1017]"
        onClick={e => e.stopPropagation()}
      >
        {/* Subtle gold glow behind the header */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(255,210,31,0.07),transparent_70%)]"
        />

        {/* Search Input */}
        <div className="relative flex items-center gap-3 border-b border-white/6 px-4 py-4">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Bot className="size-4 text-primary" />
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.searchPlaceholder}
            className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            aria-label={t.toClose}
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="relative max-h-[60vh] overflow-y-auto px-5 py-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                <Bot className="size-5 animate-pulse text-primary" />
              </span>
              <span className="text-sm text-muted-foreground">
                {t.searching}
              </span>
            </div>
          ) : response ? (
            <div className="space-y-5">
              <MarkdownContent
                content={response}
                onNavigate={onNavigate}
                variant="compact"
              />

              {suggestedPages.length > 0 && (
                <div className="border-t border-white/6 pt-4">
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
                          className="group inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/3 px-3 py-1.5 text-xs text-foreground/90 transition-colors hover:border-primary/40 hover:text-primary"
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
                    onClick={() => runExample(example)}
                    className="rounded-full border border-white/10 bg-white/3 px-3.5 py-1.5 text-xs text-foreground/85 transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="relative flex items-center justify-between border-t border-white/6 bg-white/2 px-4 py-2.5">
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground/80">
            <Bot className="size-3 text-primary/70" />
            {t.poweredByAI}
          </span>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground/70">
            <kbd className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-sans text-[10px]">
              <CornerDownLeft className="size-2.5" />
              Enter
            </kbd>
            <span>{t.toSearch}</span>
            <kbd className="ml-1 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-sans text-[10px]">
              Esc
            </kbd>
            <span>{t.toClose}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
