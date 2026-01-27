"use client"

import { useState } from "react"
import { Copy, ChevronDown, ThumbsUp, ThumbsDown, Minus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MarkdownContent } from "@/components/docs/markdown-content"
import { slugifyHeading } from "@/lib/utils"
import { useI18n } from "@/lib/i18n"
import type { DocPage } from "@/lib/docs-data"

interface ContentProps {
  page: DocPage
}

export function Content({ page }: ContentProps) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)

  // Map section keys from docs data to localized labels
  const sectionLabel = (() => {
    switch (page.section) {
      case "Welcome":
        return t.welcome
      case "React SDK":
        return t.reactSdk
      default:
        return page.section
    }
  })()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(page.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-8 py-8">
        {/* Breadcrumb & Actions */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            {sectionLabel}
          </span>
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
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <MarkdownContent content={page.content} />
        </div>
      </div>
    </main>
  )
}

interface TableOfContentsProps {
  items: string[]
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const { t } = useI18n()
  const [feedback, setFeedback] = useState<"up" | "neutral" | "down" | null>(null)

  const baseBtn =
    "p-2 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
  const selected =
    "bg-secondary text-foreground"
  const unselected = "hover:bg-secondary"

  return (
    <aside className="w-64 border-l border-border p-6 hidden xl:block">
      <nav className="sticky top-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">
          {t.onThisPage}
        </p>
        <ul className="space-y-3">
          {items.map((item, idx) => (
            <li key={idx}>
              <a
                href={`#${slugifyHeading(item)}`}
                className={`text-sm ${
                  idx === 0
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        {/* Feedback */}
        <div className="mt-12 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">{t.wasThisHelpful}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFeedback("up")}
              className={cn(
                baseBtn,
                feedback === "up" ? selected : unselected
              )}
              aria-label="Helpful"
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => setFeedback("neutral")}
              className={cn(
                baseBtn,
                feedback === "neutral" ? selected : unselected
              )}
              aria-label="Neutral"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setFeedback("down")}
              className={cn(
                baseBtn,
                feedback === "down" ? selected : unselected
              )}
              aria-label="Not helpful"
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
          </div>
          {feedback && (
            <p className="mt-3 text-xs text-muted-foreground">
              {feedback === "up"
                ? "Thanks for your feedback."
                : "Thanks, we'll use your feedback to improve."}
            </p>
          )}
        </div>
      </nav>
    </aside>
  )
}
