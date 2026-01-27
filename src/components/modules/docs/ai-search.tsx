"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X, Sparkles, Loader2 } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { docsDataEn, docsDataEs } from "@/lib/docs-data"

interface AISearchProps {
  onNavigate: (slug: string) => void
  onClose: () => void
}

export function AISearch({ onNavigate, onClose }: AISearchProps) {
  const { t, locale } = useI18n()
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<string | null>(null)
  const [suggestedPages, setSuggestedPages] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const docsData = locale === "es" ? docsDataEs : docsDataEn

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  const handleSearch = async () => {
    if (!query.trim()) return
    
    setIsLoading(true)
    setResponse(null)
    setSuggestedPages([])

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })

      if (!res.ok) throw new Error("Search failed")

      const data = await res.json()
      setResponse(data.answer)
      setSuggestedPages(data.suggestedPages || [])
    } catch {
      setResponse(t.noResults)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handlePageClick = (slug: string) => {
    onNavigate(slug)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="fixed left-1/2 top-[10%] -translate-x-1/2 w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
          <Sparkles className="w-5 h-5 text-primary" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.searchPlaceholder}
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-lg"
          />
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded-md transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
              <span className="ml-3 text-muted-foreground">{t.searching}</span>
            </div>
          ) : response ? (
            <div className="space-y-4">
              {/* AI Response */}
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs text-primary font-medium">{t.aiPowered}</span>
                </div>
                <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{response}</p>
              </div>

              {/* Suggested Pages */}
              {suggestedPages.length > 0 && (
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-3">
                    {t.relatedPages}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedPages.map((slug) => {
                      const page = docsData[slug]
                      if (!page) return null
                      return (
                        <button
                          key={slug}
                          onClick={() => handlePageClick(slug)}
                          className="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 text-foreground rounded-md transition-colors"
                        >
                          {page.title}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-sm">
                {t.askAnything}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border bg-secondary/30 flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {t.poweredByGemini}
          </span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <kbd className="px-1.5 py-0.5 bg-secondary rounded">Enter</kbd>
            <span>{t.toSearch}</span>
            <kbd className="px-1.5 py-0.5 bg-secondary rounded ml-2">Esc</kbd>
            <span>{t.toClose}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
