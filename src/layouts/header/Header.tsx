"use client";

import { Search, Globe, ChevronDown, Code, Menu } from "lucide-react";
import { DiscordIcon } from "@/components/ui/discord-icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/lib/i18n";
import type { Locale } from "@/@types/i18n";

interface HeaderProps {
  onSearchOpen: () => void;
  onMenuClick?: () => void;
}

export function Header({ onSearchOpen, onMenuClick }: HeaderProps) {
  const { locale, setLocale, t } = useI18n();

  return (
    <header className="h-14 md:h-16 border-b border-border bg-background flex items-center justify-between px-2 md:px-4 lg:px-6 gap-2">
      {/* Mobile Menu Button */}
      {onMenuClick && (
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-8 w-8 shrink-0"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </Button>
      )}

      {/* Search */}
      <div className="flex-1 min-w-0">
        <button
          onClick={onSearchOpen}
          className="w-full relative flex items-center"
        >
          <Search className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground shrink-0" />
          <div className="w-full bg-input border border-border rounded-lg pl-8 md:pl-10 pr-2 md:pr-16 py-1.5 md:py-2 text-xs md:text-sm text-muted-foreground text-left cursor-pointer hover:border-primary/50 transition-colors truncate">
            <span className="hidden sm:inline">{t.askOrSearch}</span>
            <span className="sm:hidden">Search...</span>
          </div>
          <div className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 text-xs bg-secondary rounded text-muted-foreground">
              Ctrl
            </kbd>
            <kbd className="px-1.5 py-0.5 text-xs bg-secondary rounded text-muted-foreground">
              K
            </kbd>
          </div>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1 md:gap-2 shrink-0">
        {/* Desktop buttons - ocultos en móvil */}
        <Button
          variant="outline"
          size="icon"
          className="hidden md:flex bg-secondary border-border text-foreground hover:bg-muted h-8 w-8 md:h-9 md:w-9"
          asChild
        >
          <a
            href="https://dapp.acta.build/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.dApp}
          >
            <Code className="w-4 h-4" />
          </a>
        </Button>
        <Button
          size="icon"
          className="hidden md:flex bg-[#5865F2] text-white hover:bg-[#4752c4] h-8 w-8 md:h-9 md:w-9"
          asChild
        >
          <a
            href="https://discord.gg/DsUSE3aMDZ"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.discord}
          >
            <DiscordIcon className="w-4 h-4 md:w-5 md:h-5" />
          </a>
        </Button>
        <Button
          size="icon"
          className="hidden md:flex bg-primary text-primary-foreground hover:bg-primary/90 h-8 w-8 md:h-9 md:w-9"
          asChild
        >
          <a
            href="https://acta.build"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.website}
          >
            <Globe className="w-4 h-4" />
          </a>
        </Button>

        {/* Language Selector - más compacto en móvil */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-secondary border-border text-foreground hover:bg-muted h-8 md:h-9 px-2 md:px-3"
            >
              <Globe className="w-3.5 h-3.5 md:w-4 md:h-4 md:mr-2" />
              <span className="hidden sm:inline">
                {locale === "en" ? t.english : t.spanish}
              </span>
              <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4 ml-1 md:ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLocale("en" as Locale)}>
              {t.english}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLocale("es" as Locale)}>
              {t.spanish}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
