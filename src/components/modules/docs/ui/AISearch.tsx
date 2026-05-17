"use client";

import React from "react";
import { Search, X, Sparkles, Loader2, ArrowRight } from "lucide-react";
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
    handleKeyDown,
    handlePageClick,
  } = useAISearch({ onNavigate, onClose });

  return (
    <div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="fixed left-1/2 top-[10%] -translate-x-1/2 w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <Sparkles className="w-4 h-4 text-primary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.searchPlaceholder}
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
          />
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-secondary rounded-md transition-colors"
            aria-label={t.toClose}
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2.5 py-14">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
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
                <div className="pt-4 border-t border-border/60">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70 mb-2.5">
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
                          className="group inline-flex items-center gap-1 px-2.5 py-1 text-xs text-foreground/90 border border-border/80 hover:border-primary/40 hover:text-primary rounded-md transition-colors"
                        >
                          {page.title}
                          <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-14 text-center">
              <Search className="w-10 h-10 text-muted-foreground/25 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">{t.askAnything}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-border bg-secondary/20 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground/80 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-primary/70" />
            {t.poweredByClaude}
          </span>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground/70">
            <kbd className="px-1.5 py-0.5 bg-secondary/80 rounded text-[10px]">
              Enter
            </kbd>
            <span>{t.toSearch}</span>
            <kbd className="px-1.5 py-0.5 bg-secondary/80 rounded text-[10px] ml-1">
              Esc
            </kbd>
            <span>{t.toClose}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
