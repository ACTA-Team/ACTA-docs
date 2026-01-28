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
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4 md:px-6">
      {/* Mobile Menu Button */}
      {onMenuClick && (
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-9 w-9 mr-2 shrink-0"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </Button>
      )}

      {/* Search */}
      <div className="flex-1 max-w-xl">
        <button
          onClick={onSearchOpen}
          className="w-full relative flex items-center"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <div className="w-full bg-input border border-border rounded-lg pl-10 pr-16 py-2 text-sm text-muted-foreground text-left cursor-pointer hover:border-primary/50 transition-colors">
            {t.askOrSearch}
          </div>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="px-2 py-0.5 text-xs bg-secondary rounded text-muted-foreground">
              Ctrl
            </kbd>
            <kbd className="px-2 py-0.5 text-xs bg-secondary rounded text-muted-foreground">
              K
            </kbd>
          </div>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 ml-6">
        <Button
          variant="outline"
          size="icon"
          className="bg-secondary border-border text-foreground hover:bg-muted h-9 w-9"
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
          className="bg-[#5865F2] text-white hover:bg-[#4752c4] h-9 w-9"
          asChild
        >
          <a
            href="https://discord.gg/DsUSE3aMDZ"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.discord}
          >
            <DiscordIcon className="w-5 h-5" />
          </a>
        </Button>
        <Button
          size="icon"
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 w-9"
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

        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-secondary border-border text-foreground hover:bg-muted"
            >
              <Globe className="w-4 h-4 mr-2" />
              {locale === "en" ? t.english : t.spanish}
              <ChevronDown className="w-4 h-4 ml-2" />
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
