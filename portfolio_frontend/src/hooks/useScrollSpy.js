import { useEffect, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * useScrollSpy - Observes section elements and returns the ID of the section currently in view.
 *
 * Implementation details:
 * - Uses IntersectionObserver with rootMargin to account for sticky navbar.
 * - Chooses the section with largest intersection ratio among those intersecting.
 * - Debounced via requestAnimationFrame batching to minimize state thrash.
 *
 * Usage:
 *   const activeId = useScrollSpy({ sectionSelector: "section[id]", offset: 72 });
 *   // Use activeId to set aria-current and active styles on nav links
 */
export function useScrollSpy(options = {}) {
  const {
    sectionSelector = "section[id]",
    offset = 72, // sticky navbar height
    threshold = [0.1, 0.25, 0.5, 0.75, 1],
  } = options;

  const [activeId, setActiveId] = useState("hero");

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll(sectionSelector));
    if (sections.length === 0) return;

    // Map to keep the latest intersection ratio by target id
    const ratios = new Map();
    let raf = 0;

    const updateActive = () => {
      raf = 0;
      // pick the visible section with the highest ratio; fall back to first top-most in viewport
      let bestId = activeId;
      let bestRatio = 0;

      for (const [id, ratio] of ratios.entries()) {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      }

      if (bestId && bestId !== activeId) {
        setActiveId(bestId);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.getAttribute("id");
          if (!id) continue;
          // Consider element "visible" once its top passes offset.
          // rootMargin shifts the viewport to trigger earlier due to sticky header.
          ratios.set(id, entry.intersectionRatio);
        }
        if (!raf) {
          raf = window.requestAnimationFrame(updateActive);
        }
      },
      {
        root: null,
        // Top margin shifts the threshold by the sticky navbar height.
        rootMargin: `-${offset}px 0px 0px 0px`,
        threshold,
      }
    );

    sections.forEach((el) => observer.observe(el));

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      observer.disconnect();
      ratios.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionSelector, offset, threshold.join("|")]);

    return activeId;
}
