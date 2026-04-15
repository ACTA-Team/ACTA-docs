"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/layouts/sidebar/Sidebar";
import { Header } from "@/layouts/header/Header";
import { Content } from "@/components/modules/docs/ui/Content";
import { TableOfContents } from "@/components/modules/docs/ui/TableOfContents";
import { AISearch } from "@/components/modules/docs/ui/AISearch";
import { FAQ } from "@/components/modules/docs/ui/FAQ";
import { Support } from "@/components/modules/docs/ui/Support";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { docsDataEn, docsDataEs } from "@/content/docs";

function DocsPageContent() {
  const [currentSlug, setCurrentSlug] = useState("introduction");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { locale } = useI18n();
  const docsData = locale === "es" ? docsDataEs : docsDataEn;
  const currentPage = docsData[currentSlug];

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        currentSlug={currentSlug}
        onNavigate={setCurrentSlug}
        isOpen={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          onSearchOpen={() => setIsSearchOpen(true)}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          {currentSlug === "faq" ? (
            <main className="flex-1 overflow-y-auto">
              <FAQ onNavigate={setCurrentSlug} />
            </main>
          ) : currentSlug === "support" ? (
            <main className="flex-1 overflow-y-auto">
              <Support />
            </main>
          ) : (
            <>
              <Content page={currentPage} onNavigate={setCurrentSlug} />
              {/* Table of Contents */}
              <TableOfContents items={currentPage?.tocItems || []} />
            </>
          )}
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
  );
}

export default function DocsPage() {
  return (
    <I18nProvider>
      <DocsPageContent />
    </I18nProvider>
  );
}
