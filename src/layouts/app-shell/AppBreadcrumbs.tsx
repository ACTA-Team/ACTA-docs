import type { ReactNode } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface AppBreadcrumbPage {
  title: string;
  icon?: ReactNode;
}

interface AppBreadcrumbsProps {
  section?: string | null;
  page?: AppBreadcrumbPage | null;
}

export function AppBreadcrumbs({ section, page }: AppBreadcrumbsProps) {
  if (!page?.title && !section) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList className="gap-1 text-xs text-muted-foreground sm:gap-1.5">
        {section ? (
          <>
            <BreadcrumbItem className="hidden md:flex">
              <BreadcrumbLink asChild>
                <span className="font-normal text-muted-foreground/80">
                  {section}
                </span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {page?.title ? (
              <BreadcrumbSeparator className="hidden md:block [&>svg]:size-3 opacity-50" />
            ) : null}
          </>
        ) : null}
        {page?.title ? (
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-1.5 text-sm font-medium tracking-tight text-foreground [&>svg]:size-3.5 [&>svg]:opacity-70">
              {page.icon}
              {page.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        ) : null}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
