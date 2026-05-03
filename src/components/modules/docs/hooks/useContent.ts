import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import type { DocPage } from "@/@types/docs";

interface UseContentProps {
  page: DocPage;
}

export function useContent({ page }: UseContentProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const sectionLabel = (() => {
    switch (page.section) {
      case "Welcome":
        return t.welcome;
      case "React SDK":
        return t.reactSdk;
      case "API Reference":
        return t.apiReference;
      case "Contracts":
      case "Contratos":
        return t.contracts;
      case "dApp":
        return t.dApp;
      default:
        return page.section;
    }
  })();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(page.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return {
    sectionLabel,
    copied,
    handleCopy,
    t,
  };
}
