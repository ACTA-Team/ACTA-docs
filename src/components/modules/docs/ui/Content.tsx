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
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-8 py-8">
        {/* Breadcrumb & Actions */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            {sectionLabel}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-secondary border-border text-foreground hover:bg-muted"
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
              className="bg-secondary border-border text-foreground hover:bg-muted"
              onClick={() => window.print()}
            >
              <Download className="w-4 h-4 mr-2" />
              {t.downloadPdf}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <MarkdownContent content={page.content} onNavigate={onNavigate} />
        </div>
      </div>
    </main>
  );
}
