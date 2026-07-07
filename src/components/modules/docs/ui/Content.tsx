"use client";

import { Copy, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarkdownContent } from "./MarkdownContent";
import { useContent } from "../hooks/useContent";
import type { DocPage } from "@/@types/docs";

interface ContentProps {
  page: DocPage;
  onNavigate?: (slug: string) => void;
}

export function Content({ page, onNavigate }: ContentProps) {
  const { sectionLabel, copied, handleCopy, t } = useContent({ page });

  // The page header renders a standardized title from page.title, so the
  // leading markdown H1 is stripped to avoid a duplicated heading.
  const body = page?.content?.replace(/^\s*# .*$/m, "") ?? "";

  return (
    <main
      className="flex-1 min-w-0 scroll-smooth overflow-x-hidden overflow-y-auto"
      data-docs-scroll
    >
      <div className="mx-auto w-full max-w-6xl px-5 py-10 md:px-10 md:py-12 lg:px-14">
        {/* Breadcrumb & Actions */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/75">
            {sectionLabel}
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 rounded-lg px-3 text-[13px] text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="mr-2 size-4 text-green-600 dark:text-green-500" />
                  {t.copied}
                </>
              ) : (
                <>
                  <Copy className="mr-2 size-4 opacity-70" />
                  {t.copy}
                  <ChevronDown className="ml-1 size-4 opacity-50" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Standardized page title */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl md:leading-tight">
            {page?.title}
          </h1>
        </header>

        {/* Content */}
        <div className="prose prose-neutral max-w-none wrap-break-word overflow-x-hidden text-[15px] leading-relaxed md:text-base md:leading-7 dark:prose-invert prose-headings:scroll-mt-24 prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-3xl prose-h1:md:text-4xl prose-h1:mb-3 prose-h1:mt-0 prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-xl prose-h2:md:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-muted-foreground prose-li:text-muted-foreground prose-headings:text-foreground prose-hr:border-border/60 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:text-[0.92em] [&_code]:wrap-break-word">
          <MarkdownContent content={body} onNavigate={onNavigate} />
        </div>
      </div>
    </main>
  );
}
