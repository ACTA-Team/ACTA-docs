"use client";

import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = "text" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { t } = useI18n();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="group relative mb-8 max-w-full">
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-[#1e1e1e] shadow-sm">
        <div className="flex items-center justify-between border-b border-border/50 bg-[#252526] px-4 py-2.5">
          {language && (
            <span className="text-xs text-muted-foreground font-mono">
              {language}
            </span>
          )}
          <button
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-2 px-2 py-1 text-xs rounded transition-colors",
              "text-muted-foreground hover:text-foreground hover:bg-[#2d2d30]",
              copied && "text-green-400"
            )}
            title={copied ? t.copied : t.copy}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{t.copied}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{t.copy}</span>
              </>
            )}
          </button>
        </div>
        <div className="max-w-full overflow-x-auto">
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: "1rem",
              background: "#1e1e1e",
              fontSize: "0.875rem",
              lineHeight: "1.5",
              minWidth: "100%",
              width: "max-content",
            }}
            codeTagProps={{
              style: {
                fontFamily:
                  "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
              },
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}
