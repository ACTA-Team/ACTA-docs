"use client";

import { ChevronDown, Code, Globe, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { DiscordIcon } from "@/components/ui/discord-icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/lib/i18n";
import { navigationByLocale } from "@/content/docs";
import type { Locale } from "@/@types/i18n";
import { CustomSidebarTrigger } from "./CustomSidebarTrigger";
import { AppBreadcrumbs } from "./AppBreadcrumbs";
import { findActivePage, findSectionLabel } from "./shared";

interface AppHeaderProps {
  currentSlug: string;
  onSearchOpen: () => void;
}

export function AppHeader({ currentSlug, onSearchOpen }: AppHeaderProps) {
  const { t, locale, setLocale } = useI18n();
  const nav = navigationByLocale[locale];
  const activePage = findActivePage(nav, currentSlug);
  const section = findSectionLabel(nav, currentSlug, t);

  return (
    <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center gap-3 border-b border-border/50 bg-background/70 px-4 backdrop-blur-xl supports-backdrop-filter:bg-background/60 md:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <CustomSidebarTrigger />
        <Separator
          orientation="vertical"
          className="mr-0.5 h-3.5 data-[orientation=vertical]:self-center opacity-60"
        />
        <AppBreadcrumbs section={section} page={activePage} />
      </div>

      <div className="flex flex-1 items-center justify-end gap-1 md:gap-1.5">
        <button
          type="button"
          onClick={onSearchOpen}
          className="group hidden h-8 w-full max-w-md items-center gap-2 rounded-lg border border-border/60 bg-muted/20 px-3 text-[13px] text-muted-foreground shadow-none transition-colors hover:bg-muted/40 lg:max-w-lg md:flex"
          aria-label={t.askOrSearch}
        >
          <Search className="size-3.5 shrink-0 opacity-70" />
          <span className="flex-1 truncate text-left">{t.askOrSearch}</span>
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onSearchOpen}
          className="size-8 rounded-lg md:hidden"
          aria-label={t.askOrSearch}
        >
          <Search />
        </Button>

        <Separator
          orientation="vertical"
          className="mx-0.5 hidden h-3.5 data-[orientation=vertical]:self-center opacity-60 md:block"
        />

        <AnimatedThemeToggler className="hidden h-8 w-8 rounded-lg border-0 bg-transparent hover:bg-muted/40 md:inline-flex md:h-8 md:w-8" />

        <Button
          variant="ghost"
          size="icon"
          asChild
          className="hidden size-8 rounded-lg text-muted-foreground hover:text-foreground md:inline-flex"
          aria-label={t.dApp}
        >
          <a
            href="https://dapp.acta.build/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Code />
          </a>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          asChild
          className="hidden size-8 rounded-lg text-muted-foreground hover:text-foreground md:inline-flex"
          aria-label={t.discord}
        >
          <a
            href="https://discord.gg/DsUSE3aMDZ"
            target="_blank"
            rel="noopener noreferrer"
          >
            <DiscordIcon className="size-4" />
          </a>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          asChild
          className="hidden size-8 rounded-lg text-muted-foreground hover:text-foreground md:inline-flex"
          aria-label={t.website}
        >
          <a
            href="https://acta.build"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Globe />
          </a>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 rounded-lg border-border/60 bg-transparent font-normal shadow-none"
            >
              <Globe className="size-3.5 opacity-70" />
              <span className="hidden sm:inline">{locale.toUpperCase()}</span>
              <ChevronDown className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLocale("en" as Locale)}>
              {t.english}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLocale("es" as Locale)}>
              {t.spanish}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLocale("fr" as Locale)}>
              {t.french}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
