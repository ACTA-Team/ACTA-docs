"use client";

import { FaqsSection } from "@/components/faqs-section";

interface FAQProps {
  onNavigate: (slug: string) => void;
}

export function FAQ({ onNavigate: _onNavigate }: FAQProps) {
  return (
    <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
      <section className="py-6">
        <FaqsSection />
      </section>
    </main>
  );
}
