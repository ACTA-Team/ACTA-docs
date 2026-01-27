import React from "react";
import { slugifyHeading } from "@/lib/utils";

// Map topic names to slugs
const topicToSlug: Record<string, string> = {
  Architecture: "architecture",
  "Getting Started": "getting-started",
  "React SDK": "sdk-overview",
  Arquitectura: "architecture",
  "Primeros Pasos": "getting-started",
  "React SDK": "sdk-overview",
};

export function useMarkdownParser(
  content: string,
  onNavigate?: (slug: string) => void
) {
  const renderContent = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let codeBlock: string[] = [];
    let inCodeBlock = false;
    let codeLanguage = "";
    let listItems: string[] = [];
    let inList = false;
    let listType: "ul" | "ol" = "ul";

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
              className="px-1.5 py-0.5 bg-secondary rounded text-sm font-mono text-primary"
            >
              {codeMatch[1]}
            </code>
          );
          remaining = remaining.slice(codeMatch[0].length);
          continue;
        }

        // Check for bold with **
        const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
        if (boldMatch) {
          parts.push(
            <strong key={key++} className="font-semibold text-foreground">
              {boldMatch[1]}
            </strong>
          );
          remaining = remaining.slice(boldMatch[0].length);
          continue;
        }

        // Check for links [text](url)
        const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          parts.push(
            <a
              key={key++}
              href={linkMatch[2]}
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {linkMatch[1]}
            </a>
          );
          remaining = remaining.slice(linkMatch[0].length);
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
        elements.push(
          <ListTag
            key={elements.length}
            className={`${listType === "ul" ? "list-disc" : "list-decimal"} list-inside text-foreground/80 space-y-2 mb-6 ml-4`}
          >
            {listItems.map((item, idx) => (
              <li key={idx}>{processInlineFormatting(item)}</li>
            ))}
          </ListTag>
        );
        listItems = [];
        inList = false;
      }
    };

    // Simple pipe-table support (used for the "Start here" grid)
    let tableRows: string[] = [];
    let inTable = false;

    const flushTable = () => {
      if (!inTable || tableRows.length === 0) return;

      // Expect a header + separator + data rows
      const [headerLine, separatorLine, ...dataLines] = tableRows;
      const headerCells = headerLine
        .split("|")
        .map(c => c.trim())
        .filter(Boolean);

      // Only handle the simple 2-column table we use in docs
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
            <section key={elements.length} className="mt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {cards.map((card, idx) => {
                  // Extract plain text from topic (remove markdown formatting)
                  const topicText = card.topic.replace(/\*\*/g, "").trim();
                  const slug = topicToSlug[topicText];
                  const isClickable = slug && onNavigate;

                  const cardContent = (
                    <>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                        {headerCells[0]}
                      </p>
                      <div className="text-sm font-semibold text-foreground mb-1">
                        {processInlineFormatting(card.topic)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {processInlineFormatting(card.description)}
                      </p>
                    </>
                  );

                  if (isClickable) {
                    return (
                      <button
                        key={idx}
                        onClick={() => onNavigate(slug)}
                        className="rounded-xl border border-border bg-card/40 px-4 py-4 shadow-sm hover:border-primary/60 hover:shadow-md transition-colors cursor-pointer text-left w-full"
                      >
                        {cardContent}
                      </button>
                    );
                  }

                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-border bg-card/40 px-4 py-4 shadow-sm hover:border-primary/60 hover:shadow-md transition-colors"
                    >
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
          elements.push(
            <div key={elements.length} className="mb-6">
              <div className="bg-[#0d1117] border border-border rounded-lg overflow-hidden">
                {codeLanguage && (
                  <div className="px-4 py-2 bg-secondary/50 border-b border-border text-xs text-muted-foreground font-mono">
                    {codeLanguage}
                  </div>
                )}
                <pre className="p-4 overflow-x-auto">
                  <code className="text-sm font-mono text-foreground/90">
                    {codeBlock.join("\n")}
                  </code>
                </pre>
              </div>
            </div>
          );
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
            className="text-3xl font-bold text-foreground mb-6 mt-2"
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
            className="text-2xl font-semibold text-foreground mt-10 mb-4"
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
            className="text-xl font-semibold text-foreground mt-8 mb-3"
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
            className="text-lg font-semibold text-foreground mt-6 mb-2"
          >
            {text}
          </h4>
        );
        continue;
      }

      // Unordered list
      if (line.match(/^[-*]\s/)) {
        flushTable();
        if (!inList || listType !== "ul") {
          flushList();
          inList = true;
          listType = "ul";
        }
        listItems.push(line.slice(2));
        continue;
      }

      // Ordered list
      if (line.match(/^\d+\.\s/)) {
        flushTable();
        if (!inList || listType !== "ol") {
          flushList();
          inList = true;
          listType = "ol";
        }
        listItems.push(line.replace(/^\d+\.\s/, ""));
        continue;
      }

      // Regular paragraph
      flushTable();
      flushList();
      elements.push(
        <p
          key={elements.length}
          className="text-foreground/80 leading-relaxed mb-4"
        >
          {processInlineFormatting(line)}
        </p>
      );
    }

    flushTable();
    flushList();
    return elements;
  };

  return renderContent(content);
}
