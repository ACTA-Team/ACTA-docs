"use client";

import { useEffect, useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Content } from "@/components/modules/docs/ui/Content";
import { TableOfContents } from "@/components/modules/docs/ui/TableOfContents";
import { AISearch } from "@/components/modules/docs/ui/AISearch";
import { FAQ } from "@/components/modules/docs/ui/FAQ";
import { Support } from "@/components/modules/docs/ui/Support";
import { docsDataEn, docsDataEs } from "@/content/docs";
import { useI18n } from "@/lib/i18n";
import { Footer } from "@/components/modules/docs/ui/Footer";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

export function AppShell() {
  const [currentSlug, setCurrentSlug] = useState("introduction");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { locale } = useI18n();
  const docsData = locale === "es" ? docsDataEs : docsDataEn;
  const currentPage = docsData[currentSlug];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    document.querySelectorAll("[data-docs-scroll]").forEach(el => {
      if (el instanceof HTMLElement) el.scrollTop = 0;
    });
  }, [currentSlug]);

  const handleNavigate = (slug: string) => {
    setCurrentSlug(slug);
  };

  return (
    <SidebarProvider>
      <AppSidebar currentSlug={currentSlug} onNavigate={handleNavigate} />
      <SidebarInset className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden md:peer-data-[variant=inset]:m-1.5 md:peer-data-[variant=inset]:rounded-lg md:peer-data-[variant=inset]:shadow-none">
        <AppHeader
          currentSlug={currentSlug}
          onSearchOpen={() => setIsSearchOpen(true)}
        />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background">
          <div className="flex min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-hidden">
            {currentSlug === "faq" ? (
              <main
                className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto"
                data-docs-scroll
              >
                <FAQ onNavigate={handleNavigate} />
              </main>
            ) : currentSlug === "support" ? (
              <main
                className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto"
                data-docs-scroll
              >
                <Support onNavigate={handleNavigate} />
              </main>
            ) : (
              <>
                <Content page={currentPage} onNavigate={handleNavigate} />
                <TableOfContents items={currentPage?.tocItems || []} />
              </>
            )}
          </div>
          <Footer onNavigate={handleNavigate} />
        </div>
      </SidebarInset>

      {isSearchOpen && (
        <AISearch
          onNavigate={handleNavigate}
          onClose={() => setIsSearchOpen(false)}
        />
      )}
    </SidebarProvider>
  );
}
