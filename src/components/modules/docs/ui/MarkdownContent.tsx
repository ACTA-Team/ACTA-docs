"use client";

import React from "react";
import { useMarkdownParser } from "../hooks/useMarkdownParser";

interface MarkdownContentProps {
  content: string;
  onNavigate?: (slug: string) => void;
  variant?: "default" | "compact";
}

export function MarkdownContent({
  content,
  onNavigate,
  variant = "default",
}: MarkdownContentProps) {
  const parsedContent = useMarkdownParser(content, onNavigate, variant);

  return (
    <div
      className={
        variant === "compact"
          ? "docs-markdown-compact space-y-0 [&>*:last-child]:mb-0"
          : "docs-markdown space-y-0 [&>*:last-child]:mb-0"
      }
    >
      {parsedContent}
    </div>
  );
}
