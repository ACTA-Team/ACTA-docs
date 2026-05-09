import { useEffect, useMemo, useState } from "react";
import { slugifyHeading } from "@/lib/utils";

/**
 * Tracks which heading id is currently in view inside `[data-docs-scroll]`.
 * Remount the consumer (e.g. `key={slug}`) when the heading list changes so
 * initial `activeId` resets without a sync setState in an effect.
 */
export function useTocScrollSpy(headingLabels: string[]) {
  const ids = useMemo(
    () => headingLabels.map(label => slugifyHeading(label)),
    [headingLabels]
  );

  const [activeId, setActiveId] = useState<string | null>(() =>
    headingLabels.length ? slugifyHeading(headingLabels[0]) : null
  );

  useEffect(() => {
    const root = document.querySelector(
      "[data-docs-scroll]"
    ) as HTMLElement | null;
    if (!root || ids.length === 0) return;

    const HEADER_OFFSET = 96;

    const updateActive = () => {
      const rootRect = root.getBoundingClientRect();
      let current = ids[0];

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top - rootRect.top;
        if (top <= HEADER_OFFSET) {
          current = id;
        }
      }
      setActiveId(current);
    };

    const raf = requestAnimationFrame(updateActive);

    root.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("hashchange", updateActive);
    const ro = new ResizeObserver(updateActive);
    ro.observe(root);

    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("scroll", updateActive);
      window.removeEventListener("hashchange", updateActive);
      ro.disconnect();
    };
  }, [ids]);

  return activeId;
}
