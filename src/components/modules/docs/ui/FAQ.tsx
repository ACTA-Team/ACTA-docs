"use client";

import { FaqsSection } from "@/components/modules/faq/faqs-section";

export function FAQ() {
  return (
    <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
      <section className="py-6">
        <FaqsSection />
      </section>
    </main>
  );
}
