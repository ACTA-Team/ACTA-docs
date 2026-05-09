"use client";

import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import type { SidebarNavGroup } from "./shared";

interface NavGroupProps {
  label: string;
  items: SidebarNavGroup["items"];
  onNavigate: (slug: string) => void;
}

export function NavGroup({ label, items, onNavigate }: NavGroupProps) {
  return (
    <SidebarGroup className="gap-1.5 px-1.5 py-2">
      {label ? (
        <SidebarGroupLabel className="h-7 px-1.5 text-[11px] font-medium uppercase tracking-widest text-sidebar-foreground/50">
          {label}
        </SidebarGroupLabel>
      ) : null}
      <SidebarMenu className="gap-0.5">
        {items.map(item => {
          const hasSub = !!item.subItems?.length;
          const isWelcomeSection = item.key === "welcome";
          const defaultOpen =
            isWelcomeSection ||
            !!item.isActive ||
            !!item.subItems?.some(sub => sub.isActive);

          return (
            <Collapsible
              key={item.key ?? item.slug ?? item.title}
              asChild
              className="group/collapsible"
              defaultOpen={defaultOpen}
            >
              <SidebarMenuItem>
                {hasSub ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={item.isActive}
                        size="default"
                        className="h-8 gap-2 px-2 text-[13px] leading-snug [&>svg:first-child]:size-4 [&>svg:first-child]:text-sidebar-foreground/80"
                      >
                        {item.icon}
                        <span className="font-medium">{item.title}</span>
                        <ChevronRight className="ml-auto size-4 shrink-0 opacity-60 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="mt-1 border-sidebar-border/50 py-0.5 pl-2">
                        {item.subItems?.map(subItem => (
                          <SidebarMenuSubItem
                            key={subItem.slug ?? subItem.title}
                          >
                            {subItem.externalUrl ? (
                              <SidebarMenuSubButton
                                size="sm"
                                className="mx-0.5 min-h-8 px-2 text-[13px] leading-snug"
                                href={subItem.externalUrl}
                                isActive={false}
                              >
                                {subItem.icon}
                                <span>{subItem.title}</span>
                              </SidebarMenuSubButton>
                            ) : (
                              <SidebarMenuSubButton
                                asChild
                                size="sm"
                                className="mx-0.5 min-h-8 px-2 text-[13px] leading-snug"
                                isActive={subItem.isActive}
                              >
                                <button
                                  type="button"
                                  className="flex w-full min-w-0 items-center gap-2"
                                  onClick={() =>
                                    subItem.slug && onNavigate(subItem.slug)
                                  }
                                >
                                  {subItem.icon}
                                  <span className="truncate text-left">
                                    {subItem.title}
                                  </span>
                                </button>
                              </SidebarMenuSubButton>
                            )}
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : (
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    tooltip={item.title}
                    size="default"
                    className="h-8 gap-2 px-2 text-[13px] [&>svg]:size-4"
                  >
                    <button
                      type="button"
                      onClick={() => item.slug && onNavigate(item.slug)}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
