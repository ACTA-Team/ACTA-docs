"use client"

import React, { useState } from "react"
import Image from "next/image"
import { 
  BookOpen, 
  Code, 
  Layers, 
  FileText, 
  Zap, 
  Database, 
  Globe, 
  Link,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { navigationItemsEn, navigationItemsEs } from "@/lib/docs-data"
import { useI18n } from "@/lib/i18n"

interface SidebarProps {
  currentSlug: string
  onNavigate: (slug: string) => void
}

const iconMap: Record<string, React.ReactNode> = {
  "introduction": <FileText className="w-3.5 h-3.5" />,
  "architecture": <Layers className="w-3.5 h-3.5" />,
  "getting-started": <Zap className="w-3.5 h-3.5" />,
  "links": <Link className="w-3.5 h-3.5" />,
  "sdk-overview": <BookOpen className="w-3.5 h-3.5" />,
  "useCredential": <Code className="w-3.5 h-3.5" />,
  "useVault": <Database className="w-3.5 h-3.5" />,
  "useVaultRead": <Globe className="w-3.5 h-3.5" />,
}

interface CollapsibleSectionProps {
  title: string
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

function CollapsibleSection({ title, isExpanded, onToggle, children }: CollapsibleSectionProps) {
  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70 hover:text-muted-foreground transition-colors"
      >
        <span>{title}</span>
        <ChevronRight 
          className={cn(
            "w-3 h-3 transition-transform duration-150",
            isExpanded && "rotate-90"
          )} 
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-150",
          isExpanded ? "max-h-[500px] opacity-100 mt-1" : "max-h-0 opacity-0"
        )}
      >
        <nav className="space-y-px">
          {children}
        </nav>
      </div>
    </div>
  )
}

interface NavItemProps {
  item: { slug: string; title: string }
  isActive: boolean
  onClick: () => void
}

function NavItem({ item, isActive, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2.5 px-3 py-1.5 text-[13px] rounded-md",
        "transition-colors duration-100",
        isActive 
          ? "bg-sidebar-primary/15 text-sidebar-primary font-medium" 
          : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/40"
      )}
    >
      <span className={cn(
        "transition-colors",
        isActive ? "text-sidebar-primary" : "text-muted-foreground/50"
      )}>
        {iconMap[item.slug]}
      </span>
      <span>{item.title}</span>
    </button>
  )
}

export function Sidebar({ currentSlug, onNavigate }: SidebarProps) {
  const { t, locale } = useI18n()
  const nav = locale === "es" ? navigationItemsEs : navigationItemsEn
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    welcome: true,
    sdk: true,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <aside className="w-60 h-screen bg-sidebar flex flex-col">
      {/* Logo */}
      <div className="px-4 py-5">
        <div className="flex items-center gap-2.5">
          <Image 
            src="/acta-logo.png" 
            alt="ACTA Logo" 
            width={28} 
            height={28}
            className="w-7 h-7"
          />
          <span className="font-semibold text-sidebar-foreground text-sm">ACTA Docs</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-2 pt-2">
        <CollapsibleSection
          title={t.welcome}
          isExpanded={expandedSections.welcome}
          onToggle={() => toggleSection("welcome")}
        >
          {nav.welcome.map((item) => (
            <NavItem
              key={item.slug}
              item={item}
              isActive={currentSlug === item.slug}
              onClick={() => onNavigate(item.slug)}
            />
          ))}
        </CollapsibleSection>

        <CollapsibleSection
          title={t.reactSdk}
          isExpanded={expandedSections.sdk}
          onToggle={() => toggleSection("sdk")}
        >
          {nav.sdk.map((item) => (
            <NavItem
              key={item.slug}
              item={item}
              isActive={currentSlug === item.slug}
              onClick={() => onNavigate(item.slug)}
            />
          ))}
        </CollapsibleSection>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-sidebar-border/50">
        <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">{t.poweredBy}</span>
      </div>
    </aside>
  )
}
