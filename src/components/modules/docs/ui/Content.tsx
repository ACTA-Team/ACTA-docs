"use client";

import { Copy, ChevronDown, Check, Download } from "lucide-react";
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

  return (
    <main
      className="flex-1 min-w-0 scroll-smooth overflow-x-hidden overflow-y-auto"
      data-docs-scroll
    >
      <div className="mx-auto w-full max-w-3xl px-5 py-10 md:px-10 md:py-14 lg:max-w-176 xl:max-w-3xl">
        {/* Breadcrumb & Actions */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 md:mb-12">
          <span className="text-xs font-medium tracking-wide text-muted-foreground/75 md:text-[13px]">
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
            <Button
              variant="ghost"
              size="sm"
              className="h-9 rounded-lg px-3 text-[13px] text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              onClick={() => window.print()}
            >
              <Download className="mr-2 size-4 opacity-70" />
              {t.downloadPdf}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-neutral max-w-none wrap-break-word overflow-x-hidden text-[17px] leading-[1.75] md:text-lg md:leading-[1.8] dark:prose-invert prose-headings:scroll-mt-24 prose-headings:font-medium prose-headings:tracking-tight prose-h1:text-3xl prose-h1:md:text-4xl prose-h1:mb-3 prose-h1:mt-0 prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-xl prose-h2:md:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-muted-foreground prose-li:text-muted-foreground prose-headings:text-foreground prose-hr:border-border/60 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:text-[0.92em] [&_code]:wrap-break-word">
          <MarkdownContent content={page.content} onNavigate={onNavigate} />
        </div>
      </div>
    </main>
  );
}
