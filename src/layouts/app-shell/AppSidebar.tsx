"use client";

import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useI18n } from "@/lib/i18n";
import { navigationItemsEn, navigationItemsEs } from "@/content/docs";
import { NavGroup } from "./NavGroup";
import { LatestChange } from "./LatestChange";
import { buildFooterNav, buildNavGroups } from "./shared";

interface AppSidebarProps {
  currentSlug: string;
  onNavigate: (slug: string) => void;
}

export function AppSidebar({ currentSlug, onNavigate }: AppSidebarProps) {
  const { t, locale } = useI18n();
  const nav = locale === "es" ? navigationItemsEs : navigationItemsEn;
  const groups = buildNavGroups(nav, currentSlug, t, locale);
  const footerNav = buildFooterNav(nav, currentSlug);

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="h-12 justify-center px-1">
        <SidebarMenuButton
          asChild
          tooltip="ACTA Docs"
          size="sm"
          className="h-7 px-1.5"
        >
          <button
            type="button"
            onClick={() => onNavigate("introduction")}
            className="flex items-center gap-1.5"
          >
            <Image
              src="/acta-logo.png"
              alt="ACTA"
              width={20}
              height={20}
              className="size-5 shrink-0 rounded"
            />
            <span className="text-sm font-semibold tracking-wide">
              ACTA
              <span className="ml-1.5 text-[10px] font-medium uppercase tracking-widest text-sidebar-foreground/50">
                Docs
              </span>
            </span>
          </button>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent>
        {groups.map(group => (
          <NavGroup
            key={group.key}
            label={group.label}
            items={group.items}
            onNavigate={onNavigate}
          />
        ))}
      </SidebarContent>

      <SidebarFooter>
        <LatestChange onNavigate={onNavigate} />
        <SidebarMenu className="mt-2 gap-0.5">
          {footerNav.map(item => (
            <SidebarMenuItem key={item.slug ?? item.title}>
              <SidebarMenuButton
                asChild
                className="h-7 text-[12px] text-muted-foreground"
                isActive={item.isActive}
                size="sm"
                tooltip={item.title}
              >
                <button
                  type="button"
                  onClick={() => item.slug && onNavigate(item.slug)}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
