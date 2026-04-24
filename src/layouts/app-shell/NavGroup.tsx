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
    <SidebarGroup className="gap-0 px-1 py-1">
      {label ? (
        <SidebarGroupLabel className="h-6 px-1 text-[10px] font-medium uppercase tracking-[0.12em] text-sidebar-foreground/45">
          {label}
        </SidebarGroupLabel>
      ) : null}
      <SidebarMenu>
        {items.map(item => {
          const hasSub = !!item.subItems?.length;
          const isWelcomeSection = item.key === "welcome";
          const defaultOpen =
            isWelcomeSection ||
            !!item.isActive ||
            !!item.subItems?.some(sub => sub.isActive);

          return (
            <Collapsible
              key={item.slug ?? item.title}
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
                        size="sm"
                        className="h-7 gap-1.5 px-1.5 text-xs [&>svg]:size-3.5"
                      >
                        {item.icon}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto size-3.5 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="mt-0.5 border-sidebar-border/40 pl-2">
                        {item.subItems?.map(subItem => (
                          <SidebarMenuSubItem
                            key={subItem.slug ?? subItem.title}
                          >
                            {subItem.externalUrl ? (
                              <SidebarMenuSubButton
                                size="sm"
                                className="mx-0.5 h-6 px-1.5 text-[11px] leading-tight"
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
                                className="mx-0.5 h-6 px-1.5 text-[11px] leading-tight"
                                isActive={subItem.isActive}
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    subItem.slug && onNavigate(subItem.slug)
                                  }
                                >
                                  {subItem.icon}
                                  <span>{subItem.title}</span>
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
                    size="sm"
                    className="h-7 gap-1.5 px-1.5 text-xs [&>svg]:size-3.5"
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
