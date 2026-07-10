import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { docsByLocale } from "@/content/docs";

interface UseAISearchProps {
  onNavigate: (slug: string) => void;
  onClose: () => void;
}

export function useAISearch({ onNavigate, onClose }: UseAISearchProps) {
  const { t, locale } = useI18n();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [suggestedPages, setSuggestedPages] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const docsData = docsByLocale[locale];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSearch = async (overrideQuery?: string) => {
    const effectiveQuery = overrideQuery ?? query;
    if (!effectiveQuery.trim()) return;

    setIsLoading(true);
    setResponse(null);
    setSuggestedPages([]);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: effectiveQuery }),
      });

      if (!res.ok) throw new Error("Search failed");

      const data = await res.json();
      setResponse(data.answer);
      setSuggestedPages(data.suggestedPages || []);
    } catch {
      setResponse(t.noResults);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePageClick = (slug: string) => {
    onNavigate(slug);
    onClose();
  };

  return {
    query,
    setQuery,
    isLoading,
    response,
    suggestedPages,
    inputRef,
    docsData,
    t,
    handleSearch,
    handleKeyDown,
    handlePageClick,
  };
}
