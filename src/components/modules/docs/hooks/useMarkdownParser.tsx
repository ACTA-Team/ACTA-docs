import React from "react";
import Image from "next/image";
import { CodeBlock } from "../ui/CodeBlock";
import { DappOpenCta } from "../ui/DappOpenCta";
import { WelcomeTryItLinks } from "../ui/WelcomeTryItLinks";
import { HealthTryLive } from "../ui/HealthTryLive";
import { InstallCommandTabs } from "../ui/InstallCommandTabs";
import { slugifyHeading } from "@/lib/utils";

const ACTA_LINKS_HUB = "https://links.acta.build";

// Map topic names to in-app slugs
const topicToSlug: Record<string, string> = {
  Architecture: "architecture",
  "Getting Started": "getting-started",
  "Credentials SDK": "sdk-overview",
  "React SDK": "sdk-overview",
  "API Reference": "api-overview",
  "did:stellar": "did-overview",
  Arquitectura: "architecture",
  "Primeros Pasos": "getting-started",
  "SDK de credenciales": "sdk-overview",
  "Referencia API": "api-overview",
};

// Topics that leave the docs site (no doc page)
const topicToExternalUrl: Record<string, string> = {
  Links: ACTA_LINKS_HUB,
  Enlaces: ACTA_LINKS_HUB,
};

export function useMarkdownParser(
  content: string,
  onNavigate?: (slug: string) => void,
  variant: "default" | "compact" = "default"
) {
  const isCompact = variant === "compact";
  const renderContent = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let codeBlock: string[] = [];
    let inCodeBlock = false;
    let codeLanguage = "";
    let listItems: Array<{ content: string; indent: number }> = [];
    let inList = false;
    let listType: "ul" | "ol" = "ul";
    let inDappCtaFence = false;
    let inWelcomeTryCtaFence = false;
    let inHealthTryFence = false;

    const processInlineFormatting = (line: string): React.ReactNode => {
      // Process inline code, bold, links
      const parts: React.ReactNode[] = [];
      let remaining = line;
      let key = 0;

      while (remaining.length > 0) {
        // Check for inline code
        const codeMatch = remaining.match(/^`([^`]+)`/);
        if (codeMatch) {
          parts.push(
            <code
              key={key++}
              className="rounded-md border border-border/60 bg-muted/50 px-2 py-0.5 font-mono text-[0.88em] text-foreground/90"
            >
              {codeMatch[1]}
            </code>
          );
          remaining = remaining.slice(codeMatch[0].length);
          continue;
        }

        // Check for bold link **[text](url)** - also supports doc: links
        const boldLinkMatch = remaining.match(
          /^\*\*\[([^\]]+)\]\(([^)]+)\)\*\*/
        );
        if (boldLinkMatch) {
          const boldHref = boldLinkMatch[2];
          const boldLabel = boldLinkMatch[1];
          if (boldHref.startsWith("doc:")) {
            const slug = boldHref.slice(4);
            parts.push(
              <strong key={key++} className="font-medium text-foreground">
                {onNavigate ? (
                  <button
                    type="button"
                    onClick={() => onNavigate(slug)}
                    className="cursor-pointer border-0 bg-transparent p-0 font-inherit text-primary underline decoration-primary/30 underline-offset-[3px] transition-colors hover:decoration-primary"
                  >
                    {boldLabel}
                  </button>
                ) : (
                  <span className="text-foreground underline decoration-border underline-offset-[3px]">
                    {boldLabel}
                  </span>
                )}
              </strong>
            );
          } else {
            parts.push(
              <strong key={key++} className="font-medium text-foreground">
                <a
                  href={boldHref}
                  className="text-primary underline decoration-primary/30 underline-offset-[3px] transition-colors hover:decoration-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {boldLabel}
                </a>
              </strong>
            );
          }
          remaining = remaining.slice(boldLinkMatch[0].length);
          continue;
        }

        // Check for links [text](url) - before bold to avoid conflicts
        const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          const href = linkMatch[2];
          const label = linkMatch[1];
          if (href.startsWith("doc:")) {
            const slug = href.slice(4);
            if (onNavigate) {
              parts.push(
                <button
                  type="button"
                  key={key++}
                  onClick={() => onNavigate(slug)}
                  className="cursor-pointer border-0 bg-transparent p-0 font-inherit text-primary underline decoration-primary/30 underline-offset-[3px] transition-colors hover:decoration-primary"
                >
                  {label}
                </button>
              );
            } else {
              parts.push(
                <span
                  key={key++}
                  className="font-medium text-foreground underline decoration-border underline-offset-[3px]"
                >
                  {label}
                </span>
              );
            }
          } else {
            parts.push(
              <a
                key={key++}
                href={href}
                className="text-primary underline decoration-primary/30 underline-offset-[3px] transition-colors hover:decoration-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                {label}
              </a>
            );
          }
          remaining = remaining.slice(linkMatch[0].length);
          continue;
        }

        // Check for bold with **
        const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
        if (boldMatch) {
          parts.push(
            <strong key={key++} className="font-medium text-foreground">
              {boldMatch[1]}
            </strong>
          );
          remaining = remaining.slice(boldMatch[0].length);
          continue;
        }

        // Regular character
        const nextSpecial = remaining.search(/[`*\[]/);
        if (nextSpecial === -1) {
          parts.push(remaining);
          break;
        } else if (nextSpecial === 0) {
          parts.push(remaining[0]);
          remaining = remaining.slice(1);
        } else {
          parts.push(remaining.slice(0, nextSpecial));
          remaining = remaining.slice(nextSpecial);
        }
      }

      return parts.length === 1 ? parts[0] : <>{parts}</>;
    };

    const flushList = () => {
      if (listItems.length > 0) {
        const ListTag = listType;
        const renderNestedList = (
          items: Array<{ content: string; indent: number }>
        ): React.ReactNode[] => {
          const result: React.ReactNode[] = [];
          let i = 0;

          while (i < items.length) {
            const currentIndent = items[i].indent;
            const currentLevelItems: Array<{
              content: string;
              indent: number;
            }> = [];

            // Collect all items at current indent level
            while (i < items.length && items[i].indent === currentIndent) {
              currentLevelItems.push(items[i]);
              i++;
            }

            // Check if there are nested items following
            if (i < items.length && items[i].indent > currentIndent) {
              const nestedIndent = items[i].indent;
              const nestedItems: Array<{ content: string; indent: number }> =
                [];

              // Collect all nested items at the same nested indent level
              while (i < items.length && items[i].indent === nestedIndent) {
                nestedItems.push(items[i]);
                i++;
              }

              // Render parent items with nested list attached to the last one
              currentLevelItems.forEach((item, idx) => {
                const isLastParent = idx === currentLevelItems.length - 1;
                result.push(
                  <li key={`${i}-${idx}`} className="pl-1">
                    {processInlineFormatting(item.content)}
                    {isLastParent && nestedItems.length > 0 && (
                      <ListTag
                        className={`${listType === "ul" ? "list-[circle]" : "list-decimal"} mt-2 ml-4 space-y-1.5`}
                      >
                        {nestedItems.map((nestedItem, nestedIdx) => (
                          <li
                            key={`${i}-${idx}-nested-${nestedIdx}`}
                            className="pl-1"
                          >
                            {processInlineFormatting(nestedItem.content)}
                          </li>
                        ))}
                      </ListTag>
                    )}
                  </li>
                );
              });
            } else {
              // Render items without nesting
              currentLevelItems.forEach((item, idx) => {
                result.push(
                  <li key={`${i}-${idx}`} className="pl-1">
                    {processInlineFormatting(item.content)}
                  </li>
                );
              });
            }
          }

          return result;
        };

        // Flat bullet lists with several short items flow into two columns
        // on md+ so they use the page width instead of one tall column.
        // Length is measured on the visible text (links/bold/code stripped).
        const visibleLength = (s: string) =>
          s
            .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
            .replace(/\*\*/g, "")
            .replace(/`/g, "").length;
        const isFlat = listItems.every(
          item => item.indent === listItems[0].indent
        );
        const columnize =
          !isCompact &&
          listType === "ul" &&
          isFlat &&
          listItems.length >= 5 &&
          listItems.every(item => visibleLength(item.content) <= 90);

        elements.push(
          <ListTag
            key={elements.length}
            className={
              isCompact
                ? `${listType === "ul" ? "list-disc" : "list-decimal"} mb-4 ml-4 space-y-2 text-sm text-foreground/85 marker:text-muted-foreground/50`
                : `${listType === "ul" ? "list-disc" : "list-decimal"} mb-8 ml-5 text-[15px] leading-relaxed text-muted-foreground marker:text-muted-foreground/70 md:text-base md:leading-7 ${
                    columnize
                      ? "space-y-2.5 md:grid md:grid-cols-2 md:gap-x-14 md:gap-y-2.5 md:space-y-0"
                      : "space-y-2.5"
                  }`
            }
          >
            {renderNestedList(listItems)}
          </ListTag>
        );
        listItems = [];
        inList = false;
      }
    };

    // Blockquote support: consecutive "> " lines become a callout card
    let quoteLines: string[] = [];

    const flushQuote = () => {
      if (quoteLines.length === 0) return;
      const linesToRender = [...quoteLines];
      quoteLines = [];
      elements.push(
        <div
          key={elements.length}
          className={
            isCompact
              ? "mb-3 rounded-lg border border-primary/25 bg-primary/5 px-3 py-2 text-sm leading-relaxed text-foreground/85"
              : "mb-8 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3.5 dark:border-primary/20 dark:bg-primary/6"
          }
        >
          {linesToRender.map((quoteLine, idx) => (
            <p
              key={idx}
              className={
                isCompact
                  ? "text-sm leading-relaxed text-foreground/85"
                  : "text-[15px] leading-relaxed text-foreground/85 not-last:mb-2"
              }
            >
              {processInlineFormatting(quoteLine)}
            </p>
          ))}
        </div>
      );
    };

    // Pipe-table support: "Topic | Description" renders as a card grid
    // (welcome page); every other table renders as a real styled table.
    let tableRows: string[] = [];
    let inTable = false;

    const CARD_GRID_HEADERS = new Set(["topic", "tema"]);

    const renderRealTable = (headerCells: string[], dataLines: string[]) => {
      const rows = dataLines
        .map(line =>
          line
            .split("|")
            .map(c => c.trim())
            .filter(Boolean)
        )
        .filter(cells => cells.length > 0);

      if (rows.length === 0) return;

      elements.push(
        <div
          key={elements.length}
          className={
            isCompact
              ? "mb-4 overflow-hidden rounded-lg border border-border"
              : "mb-10 overflow-hidden rounded-xl border border-border"
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {headerCells.map((h, idx) => (
                    <th
                      key={idx}
                      className="whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      {processInlineFormatting(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {rows.map((cells, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className="align-top transition-colors hover:bg-muted/20"
                  >
                    {cells.map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        className={
                          isCompact
                            ? "px-4 py-2.5 text-sm leading-relaxed text-muted-foreground"
                            : "px-4 py-3 text-[14px] leading-relaxed text-muted-foreground md:text-[15px]"
                        }
                      >
                        {processInlineFormatting(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    };

    const flushTable = () => {
      if (!inTable || tableRows.length === 0) return;

      // Expect a header + separator + data rows
      const [headerLine, , ...dataLines] = tableRows;
      const headerCells = headerLine
        .split("|")
        .map(c => c.trim())
        .filter(Boolean);

      // Any table that is not the welcome "Topic | Description" grid renders
      // as a real table (3+ columns included).
      if (
        dataLines.length > 0 &&
        !(
          headerCells.length === 2 &&
          CARD_GRID_HEADERS.has(headerCells[0].toLowerCase())
        )
      ) {
        renderRealTable(headerCells, dataLines);
        tableRows = [];
        inTable = false;
        return;
      }

      if (headerCells.length === 2 && dataLines.length > 0) {
        const cards = dataLines
          .map(line =>
            line
              .split("|")
              .map(c => c.trim())
              .filter(Boolean)
          )
          .filter(cells => cells.length === 2)
          .map(([topic, description]) => ({ topic, description }));

        if (cards.length > 0) {
          elements.push(
            <section key={elements.length} className="mb-12 mt-8">
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {cards.map((card, idx) => {
                  // Extract plain text from topic (remove markdown formatting)
                  const topicText = card.topic.replace(/\*\*/g, "").trim();
                  const externalUrl = topicToExternalUrl[topicText];
                  const slug = topicToSlug[topicText];
                  const isExternal = Boolean(externalUrl);
                  const isInternal = Boolean(slug && onNavigate);

                  const cardContent = (
                    <>
                      <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/80">
                        {headerCells[0]}
                      </p>
                      <div className="mb-2 text-[15px] font-medium leading-snug text-foreground md:text-base">
                        {processInlineFormatting(card.topic)}
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {processInlineFormatting(card.description)}
                      </p>
                    </>
                  );

                  const cardClassName =
                    "group w-full rounded-2xl border border-border bg-card/60 px-5 py-5 text-left shadow-none transition-all duration-200 hover:border-primary/40 hover:bg-card";

                  if (isExternal) {
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => window.location.assign(externalUrl)}
                        className={`${cardClassName} cursor-pointer`}
                      >
                        {cardContent}
                      </button>
                    );
                  }

                  if (isInternal) {
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onNavigate!(slug)}
                        className={`${cardClassName} cursor-pointer`}
                      >
                        {cardContent}
                      </button>
                    );
                  }

                  return (
                    <div key={idx} className={cardClassName}>
                      {cardContent}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        }
      }

      tableRows = [];
      inTable = false;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code block start/end
      if (line.startsWith("```")) {
        flushTable();
        if (inCodeBlock) {
          // End code block
          const codeContent = codeBlock.join("\n");
          const language = codeLanguage || "text";

          // Check if it's an install command with package name
          // Match: npm install package, yarn add package, pnpm add package
          const installMatch = codeContent
            .trim()
            .match(/^(npm|yarn|pnpm)\s+(install|add)\s+(.+)$/m);
          if (installMatch && installMatch[3]) {
            const packageName = installMatch[3].trim().replace(/['"]/g, "");
            elements.push(
              <InstallCommandTabs
                key={elements.length}
                packageName={packageName}
              />
            );
          } else {
            elements.push(
              <CodeBlock
                key={elements.length}
                code={codeContent}
                language={language}
                compact={isCompact}
              />
            );
          }
          codeBlock = [];
          inCodeBlock = false;
          codeLanguage = "";
        } else {
          // Start code block
          flushList();
          inCodeBlock = true;
          codeLanguage = line.slice(3).trim();
        }
        continue;
      }

      if (inCodeBlock) {
        codeBlock.push(line);
        continue;
      }

      if (inDappCtaFence) {
        if (line.trim() === ":::") {
          flushTable();
          flushList();
          elements.push(<DappOpenCta key={elements.length} />);
          inDappCtaFence = false;
        }
        continue;
      }

      if (inWelcomeTryCtaFence) {
        if (line.trim() === ":::") {
          flushTable();
          flushList();
          elements.push(<WelcomeTryItLinks key={elements.length} />);
          inWelcomeTryCtaFence = false;
        }
        continue;
      }

      if (inHealthTryFence) {
        if (line.trim() === ":::") {
          flushTable();
          flushList();
          elements.push(<HealthTryLive key={elements.length} />);
          inHealthTryFence = false;
        }
        continue;
      }

      const ctaLine = line.trim();
      if (ctaLine === ":::dapp-open-cta:::") {
        flushTable();
        flushList();
        elements.push(<DappOpenCta key={elements.length} />);
        continue;
      }
      if (ctaLine === ":::dapp-open-cta") {
        flushTable();
        flushList();
        inDappCtaFence = true;
        continue;
      }

      if (ctaLine === ":::welcome-try-cta:::") {
        flushTable();
        flushList();
        elements.push(<WelcomeTryItLinks key={elements.length} />);
        continue;
      }
      if (ctaLine === ":::welcome-try-cta") {
        flushTable();
        flushList();
        inWelcomeTryCtaFence = true;
        continue;
      }

      if (ctaLine === ":::health-try:::") {
        flushTable();
        flushList();
        elements.push(<HealthTryLive key={elements.length} />);
        continue;
      }
      if (ctaLine === ":::health-try") {
        flushTable();
        flushList();
        inHealthTryFence = true;
        continue;
      }

      // Blockquote line ("> text")
      const quoteMatch = line.match(/^>\s?(.*)$/);
      if (quoteMatch) {
        flushTable();
        flushList();
        quoteLines.push(quoteMatch[1]);
        continue;
      }
      // Any non-quote line ends a pending blockquote
      flushQuote();

      // Empty line
      if (line.trim() === "") {
        flushTable();
        flushList();
        continue;
      }

      // Pipe table rows (e.g. "| Topic | Description |")
      if (line.trim().startsWith("|") && line.includes("|")) {
        if (!inTable) {
          flushList();
          inTable = true;
          tableRows = [];
        }
        tableRows.push(line);
        continue;
      } else if (inTable) {
        // End of table block
        flushTable();
      }

      // Headers
      if (line.startsWith("# ")) {
        flushTable();
        flushList();
        const text = line.slice(2);
        elements.push(
          <h1
            key={elements.length}
            id={slugifyHeading(text)}
            className={
              isCompact
                ? "mb-3 mt-0 text-base font-semibold tracking-tight text-foreground"
                : "mb-8 mt-0 scroll-mt-24 text-3xl font-bold tracking-tight text-foreground md:text-4xl md:leading-tight"
            }
          >
            {text}
          </h1>
        );
        continue;
      }

      if (line.startsWith("## ")) {
        flushTable();
        flushList();
        const text = line.slice(3);
        elements.push(
          <h2
            key={elements.length}
            id={slugifyHeading(text)}
            className={
              isCompact
                ? "mb-2 mt-4 text-sm font-semibold tracking-tight text-foreground"
                : "mb-5 mt-14 scroll-mt-24 text-xl font-semibold tracking-tight text-foreground md:text-2xl [&+h3]:mt-8"
            }
          >
            {text}
          </h2>
        );
        continue;
      }

      if (line.startsWith("### ")) {
        flushTable();
        flushList();
        const text = line.slice(4);
        elements.push(
          <h3
            key={elements.length}
            id={slugifyHeading(text)}
            className={
              isCompact
                ? "mb-2 mt-3 text-sm font-semibold tracking-tight text-foreground"
                : "mb-3 mt-10 scroll-mt-24 text-lg font-semibold tracking-tight text-foreground md:text-xl"
            }
          >
            {text}
          </h3>
        );
        continue;
      }

      if (line.startsWith("#### ")) {
        flushTable();
        flushList();
        const text = line.slice(5);
        elements.push(
          <h4
            key={elements.length}
            id={slugifyHeading(text)}
            className="mb-2 mt-8 scroll-mt-24 text-base font-semibold tracking-tight text-foreground"
          >
            {text}
          </h4>
        );
        continue;
      }

      // Unordered list - handle indentation
      const ulMatch = line.match(/^(\s*)[-*]\s(.+)$/);
      if (ulMatch) {
        flushTable();
        if (!inList || listType !== "ul") {
          flushList();
          inList = true;
          listType = "ul";
        }
        const indent = ulMatch[1].length;
        const content = ulMatch[2];
        listItems.push({ content, indent });
        continue;
      }

      // Ordered list - handle indentation
      const olMatch = line.match(/^(\s*)\d+\.\s(.+)$/);
      if (olMatch) {
        flushTable();
        if (!inList || listType !== "ol") {
          flushList();
          inList = true;
          listType = "ol";
        }
        const indent = olMatch[1].length;
        const content = olMatch[2];
        listItems.push({ content, indent });
        continue;
      }

      // Images: ![alt text](url)
      const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (imageMatch) {
        flushTable();
        flushList();
        const [, alt, src] = imageMatch;
        elements.push(
          <div key={elements.length} className="my-10 flex justify-center">
            <Image
              src={src}
              alt={alt || ""}
              width={1024}
              height={576}
              className="h-auto w-full max-w-2xl rounded-2xl border border-border/60"
            />
          </div>
        );
        continue;
      }

      // Regular paragraph
      flushTable();
      flushList();
      elements.push(
        <p
          key={elements.length}
          className={
            isCompact
              ? "mb-3 text-sm leading-relaxed text-foreground/90"
              : "mb-5 text-[15px] leading-relaxed text-muted-foreground md:text-base md:leading-7"
          }
        >
          {processInlineFormatting(line)}
        </p>
      );
    }

    flushTable();
    flushList();
    flushQuote();
    return elements;
  };

  return renderContent(content);
}
