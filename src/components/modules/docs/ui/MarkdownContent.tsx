"use client";

import React from "react";
import { useMarkdownParser } from "../hooks/useMarkdownParser";

interface MarkdownContentProps {
  content: string;
  onNavigate?: (slug: string) => void;
}

export function MarkdownContent({ content, onNavigate }: MarkdownContentProps) {
  const parsedContent = useMarkdownParser(content, onNavigate);

  return (
    <div className="docs-markdown space-y-0 [&>*:last-child]:mb-0">
      {parsedContent}
    </div>
  );
}
