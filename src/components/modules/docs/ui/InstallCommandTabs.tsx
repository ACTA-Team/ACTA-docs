"use client";

import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

interface InstallCommandTabsProps {
  packageName: string;
}

const packageManagers = [
  { name: "npm", command: (pkg: string) => `npm install ${pkg}` },
  { name: "yarn", command: (pkg: string) => `yarn add ${pkg}` },
  { name: "pnpm", command: (pkg: string) => `pnpm add ${pkg}` },
];

export function InstallCommandTabs({ packageName }: InstallCommandTabsProps) {
  const [activeTab, setActiveTab] = useState("npm");
  const [copied, setCopied] = useState(false);
  const { t } = useI18n();

  const activeManager = packageManagers.find(pm => pm.name === activeTab);
  const command = activeManager?.command(packageName) || "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="mb-8">
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-[#1e1e1e] shadow-sm">
        {/* Tabs */}
        <div className="flex items-center justify-between bg-[#252526] border-b border-border">
          <div className="flex">
            {packageManagers.map(pm => (
              <button
                key={pm.name}
                onClick={() => {
                  setActiveTab(pm.name);
                  setCopied(false);
                }}
                className={cn(
                  "px-4 py-2 text-xs font-medium transition-colors",
                  "border-b-2 border-transparent",
                  activeTab === pm.name
                    ? "text-foreground border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {pm.name}
              </button>
            ))}
          </div>
          <button
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-xs rounded transition-colors mr-2",
              "text-muted-foreground hover:text-foreground hover:bg-[#2d2d30]",
              copied && "text-green-400"
            )}
            title={copied ? t.copied : t.copy}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{t.copied}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{t.copy}</span>
              </>
            )}
          </button>
        </div>
        {/* Code */}
        <SyntaxHighlighter
          language="bash"
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "#1e1e1e",
            fontSize: "0.875rem",
            lineHeight: "1.5",
          }}
          codeTagProps={{
            style: {
              fontFamily:
                "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
            },
          }}
        >
          {command}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
