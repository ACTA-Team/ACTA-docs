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
  compact?: boolean;
}

export function CodeBlock({
  code,
  language = "text",
  compact = false,
}: CodeBlockProps) {
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
    <div className={cn("group relative max-w-full", compact ? "mb-3" : "mb-8")}>
      <div
        className={cn(
          "overflow-hidden border border-white/8 bg-[#0b0e14]",
          compact ? "rounded-lg" : "rounded-xl shadow-sm"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between border-b border-white/6 bg-white/3",
            compact ? "px-3 py-1.5" : "px-4 py-2"
          )}
        >
          {language && (
            <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
              {language}
            </span>
          )}
          <button
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1 text-xs transition-colors",
              "text-zinc-500 hover:bg-white/5 hover:text-zinc-200",
              copied && "text-emerald-400"
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
              padding: compact ? "0.75rem" : "1rem",
              background: "transparent",
              fontSize: compact ? "0.8125rem" : "0.875rem",
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
