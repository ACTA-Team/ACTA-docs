"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/docs/sidebar"
import { Header } from "@/components/docs/header"
import { Content, TableOfContents } from "@/components/docs/content"
import { AISearch } from "@/components/docs/ai-search"
import { I18nProvider, useI18n } from "@/lib/i18n"
import { docsDataEn, docsDataEs } from "@/lib/docs-data"

function DocsPageContent() {
  const [currentSlug, setCurrentSlug] = useState("introduction")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { locale } = useI18n()
  const docsData = locale === "es" ? docsDataEs : docsDataEn
  const currentPage = docsData[currentSlug]

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar currentSlug={currentSlug} onNavigate={setCurrentSlug} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onSearchOpen={() => setIsSearchOpen(true)} />

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <Content page={currentPage} />

          {/* Table of Contents */}
          <TableOfContents items={currentPage.tocItems} />
        </div>
      </div>

      {/* AI Search Modal */}
      {isSearchOpen && (
        <AISearch 
          onNavigate={setCurrentSlug} 
          onClose={() => setIsSearchOpen(false)} 
        />
      )}
    </div>
  )
}

export default function DocsPage() {
  return (
    <I18nProvider>
      <DocsPageContent />
    </I18nProvider>
  )
}
