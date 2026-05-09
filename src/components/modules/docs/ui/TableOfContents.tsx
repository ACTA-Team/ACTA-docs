"use client";

import { List } from "lucide-react";
import { slugifyHeading, cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { useTocScrollSpy } from "../hooks/useTocScrollSpy";

interface TableOfContentsProps {
  items: string[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const { t } = useI18n();
  const activeId = useTocScrollSpy(items);

  if (!items.length) {
    return null;
  }

  return (
    <aside className="hidden w-70 shrink-0 border-l border-border/40 py-10 pl-8 pr-5 xl:block">
      <nav className="sticky top-24" aria-label={t.onThisPage}>
        <div className="mb-5 flex items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground">
            <List className="size-4" aria-hidden />
          </span>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/80">
            {t.onThisPage}
          </p>
        </div>
        <ul className="flex flex-col gap-1">
          {items.map(item => {
            const id = slugifyHeading(item);
            const isActive = activeId === id;

            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-[14px] leading-snug transition-colors md:text-[15px]",
                    isActive
                      ? "bg-primary/12 font-medium text-primary shadow-sm dark:bg-primary/18 dark:text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <span className="line-clamp-4">{item}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
