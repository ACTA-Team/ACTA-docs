"use client";

import React, { useState } from "react";
import Image from "next/image";
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
  ShieldCheck,
  HelpCircle,
  Headphones,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { navigationItemsEn, navigationItemsEs } from "@/content/docs";
import { useI18n } from "@/lib/i18n";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface SidebarProps {
  currentSlug: string;
  onNavigate: (slug: string) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  introduction: <FileText className="w-3.5 h-3.5" />,
  architecture: <Layers className="w-3.5 h-3.5" />,
  "getting-started": <Zap className="w-3.5 h-3.5" />,
  links: <Link className="w-3.5 h-3.5" />,
  "sdk-overview": <BookOpen className="w-3.5 h-3.5" />,
  useCredential: <Code className="w-3.5 h-3.5" />,
  useVault: <Database className="w-3.5 h-3.5" />,
  useVaultRead: <Globe className="w-3.5 h-3.5" />,
  "api-overview": <BookOpen className="w-3.5 h-3.5" />,
  "api-health-status": <Zap className="w-3.5 h-3.5" />,
  "api-keys": <Link className="w-3.5 h-3.5" />,
  "api-contract-info": <FileText className="w-3.5 h-3.5" />,
  "api-vault-read": <Database className="w-3.5 h-3.5" />,
  "api-vault-write": <Database className="w-3.5 h-3.5" />,
  "api-credentials": <Code className="w-3.5 h-3.5" />,
  "dapp-overview": <BookOpen className="w-3.5 h-3.5" />,
  "dapp-getting-started": <Zap className="w-3.5 h-3.5" />,
  "dapp-features": <Layers className="w-3.5 h-3.5" />,
  "zk-overview": <ShieldCheck className="w-3.5 h-3.5" />,
  "zk-circuits": <Code className="w-3.5 h-3.5" />,
  "zk-generation": <Zap className="w-3.5 h-3.5" />,
  "zk-verification": <ShieldCheck className="w-3.5 h-3.5" />,
  "scf-42": <FileText className="w-3.5 h-3.5" />,
  faq: <HelpCircle className="w-3.5 h-3.5" />,
  support: <Headphones className="w-3.5 h-3.5" />,
};

interface CollapsibleSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function CollapsibleSection({
  title,
  isExpanded,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70 hover:text-muted-foreground transition-colors min-w-0"
      >
        <span className="truncate">{title}</span>
        <ChevronRight
          className={cn(
            "w-3 h-3 transition-transform duration-150 shrink-0 ml-2",
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
        <nav className="space-y-px">{children}</nav>
      </div>
    </div>
  );
}

interface NavItemProps {
  item: { slug: string; title: string };
  isActive: boolean;
  onClick: () => void;
}

function NavItem({ item, isActive, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-2.5 px-3 py-1.5 text-[13px] rounded-md",
        "transition-colors duration-100",
        isActive
          ? "bg-sidebar-primary/15 text-sidebar-primary font-medium"
          : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/40"
      )}
    >
      <span
        className={cn(
          "transition-colors shrink-0 mt-0.5",
          isActive ? "text-sidebar-primary" : "text-muted-foreground/50"
        )}
      >
        {iconMap[item.slug]}
      </span>
      <span className="text-left wrap-break-word leading-relaxed">
        {item.title}
      </span>
    </button>
  );
}

export function Sidebar({
  currentSlug,
  onNavigate,
  isOpen,
  onOpenChange,
}: SidebarProps) {
  const { t, locale } = useI18n();
  const nav = locale === "es" ? navigationItemsEs : navigationItemsEn;
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    welcome: true,
    sdk: true,
    "api-reference": true,
    dapp: true,
    "zk-proofs": true,
    help: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleNavigate = (slug: string) => {
    onNavigate(slug);
    // Cerrar el sidebar en móvil después de navegar
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const sidebarContent = (
    <>
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
          <span className="font-semibold text-sidebar-foreground text-sm">
            ACTA Docs
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-2 pt-2">
        <CollapsibleSection
          title={t.welcome}
          isExpanded={expandedSections.welcome}
          onToggle={() => toggleSection("welcome")}
        >
          {nav.welcome.map(item => (
            <NavItem
              key={item.slug}
              item={item}
              isActive={currentSlug === item.slug}
              onClick={() => handleNavigate(item.slug)}
            />
          ))}
        </CollapsibleSection>

        <CollapsibleSection
          title={t.reactSdk}
          isExpanded={expandedSections.sdk}
          onToggle={() => toggleSection("sdk")}
        >
          {nav.sdk.map(item => (
            <NavItem
              key={item.slug}
              item={item}
              isActive={currentSlug === item.slug}
              onClick={() => handleNavigate(item.slug)}
            />
          ))}
        </CollapsibleSection>

        <CollapsibleSection
          title={t.apiReference}
          isExpanded={expandedSections["api-reference"]}
          onToggle={() => toggleSection("api-reference")}
        >
          {nav["api-reference"].map(item => (
            <NavItem
              key={item.slug}
              item={item}
              isActive={currentSlug === item.slug}
              onClick={() => handleNavigate(item.slug)}
            />
          ))}
        </CollapsibleSection>

        <CollapsibleSection
          title={t.dApp}
          isExpanded={expandedSections.dapp}
          onToggle={() => toggleSection("dapp")}
        >
          {nav.dapp.map(item => (
            <NavItem
              key={item.slug}
              item={item}
              isActive={currentSlug === item.slug}
              onClick={() => handleNavigate(item.slug)}
            />
          ))}
        </CollapsibleSection>

        <CollapsibleSection
          title={t.zkProofs}
          isExpanded={expandedSections["zk-proofs"]}
          onToggle={() => toggleSection("zk-proofs")}
        >
          {nav["zk-proofs"].map(item => (
            <NavItem
              key={item.slug}
              item={item}
              isActive={currentSlug === item.slug}
              onClick={() => handleNavigate(item.slug)}
            />
          ))}
        </CollapsibleSection>

        <CollapsibleSection
          title={t.support}
          isExpanded={expandedSections.help}
          onToggle={() => toggleSection("help")}
        >
          {nav.help?.map(item => (
            <NavItem
              key={item.slug}
              item={item}
              isActive={currentSlug === item.slug}
              onClick={() => handleNavigate(item.slug)}
            />
          ))}
        </CollapsibleSection>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-sidebar-border/50">
        <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">
          {t.poweredBy}
        </span>
      </div>
    </>
  );

  return (
    <>
      {/* Sidebar Desktop - siempre visible en md y superior */}
      <aside className="hidden md:flex w-60 h-screen bg-sidebar flex-col shrink-0">
        {sidebarContent}
      </aside>

      {/* Sidebar Mobile - Sheet/Drawer */}
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent
          side="left"
          className="w-60 p-0 bg-sidebar border-sidebar-border"
        >
          <div className="w-full h-full flex flex-col">{sidebarContent}</div>
        </SheetContent>
      </Sheet>
    </>
  );
}
