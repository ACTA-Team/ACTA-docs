"use client"

import React from "react"
import { useMarkdownParser } from "../hooks/useMarkdownParser"

interface MarkdownContentProps {
  content: string
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const parsedContent = useMarkdownParser(content)

  return <div className="prose-custom">{parsedContent}</div>
}
