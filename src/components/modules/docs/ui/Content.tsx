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
      className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto"
      data-docs-scroll
    >
      <div className="mx-auto w-full max-w-4xl px-4 py-8 md:px-10 md:py-10 xl:max-w-5xl">
        {/* Breadcrumb & Actions */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
            {sectionLabel}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-border/60 bg-transparent text-foreground shadow-none hover:bg-muted/50"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  {t.copied}
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  {t.copy}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-border/60 bg-transparent text-foreground shadow-none hover:bg-muted/50"
              onClick={() => window.print()}
            >
              <Download className="w-4 h-4 mr-2" />
              {t.downloadPdf}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-neutral max-w-none wrap-break-word overflow-x-hidden text-[15px] leading-[1.65] md:text-base dark:prose-invert prose-headings:scroll-mt-20 prose-headings:font-semibold prose-headings:tracking-tight prose-p:text-muted-foreground prose-li:text-muted-foreground prose-headings:text-foreground [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_code]:wrap-break-word">
          <MarkdownContent content={page.content} onNavigate={onNavigate} />
        </div>
      </div>
    </main>
  );
}
