"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface LatestChangeProps {
  onNavigate?: (slug: string) => void;
}

const latestChange = {
  badge: "NEW",
  title: "@acta-team/credentials",
  description: "Build with verifiable credentials.",
  readMore: { slug: "sdk-overview", label: "Read more" },
} as const;

export function LatestChange({ onNavigate }: LatestChangeProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "group/latest-change relative flex size-full min-h-27 flex-col justify-center gap-1 overflow-hidden rounded-lg border border-border/50 bg-muted/15 px-3 pt-3 pb-1 *:text-nowrap",
        "transition-opacity group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0"
      )}
    >
      <span className="font-mono text-[10px] font-light text-muted-foreground">
        {latestChange.badge}
      </span>
      <p className="text-xs font-medium">{latestChange.title}</p>
      <span className="text-[10px] text-muted-foreground">
        {latestChange.description}
      </span>
      <Button
        className="w-max px-0 font-light text-xs"
        size="sm"
        variant="link"
        onClick={() => onNavigate?.(latestChange.readMore.slug)}
      >
        {latestChange.readMore.label}
      </Button>
      <Button
        className="absolute top-2 right-2 z-10 size-6 rounded-full opacity-0 transition-opacity group-hover/latest-change:opacity-100"
        onClick={() => setIsOpen(false)}
        size="icon-sm"
        variant="ghost"
        aria-label="Dismiss"
      >
        <X className="size-3.5 text-muted-foreground" />
      </Button>
    </div>
  );
}
