import { useCallback, useEffect } from "react";

/**
 * PUBLIC_INTERFACE
 * useSmoothScroll - enables smooth scrolling to anchors and hash navigation.
 *
 * Usage:
 * const { scrollToId } = useSmoothScroll({ offset: 72 });
 * <a onClick={(e)=>{e.preventDefault(); scrollToId('projects');}}>Projects</a>
 */
export function useSmoothScroll(options = {}) {
  const offset = typeof options.offset === "number" ? options.offset : 72;
  const behavior = options.behavior || "smooth";

  const scrollToId = useCallback(
    (id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const absoluteY = rect.top + window.pageYOffset - offset;
      window.scrollTo({ top: absoluteY, behavior });
      // Update the URL hash without jumping (avoid restricted global 'history')
      window.history.replaceState(null, "", `#${id}`);
    },
    [offset, behavior]
  );

  useEffect(() => {
    // On initial load if there's a hash, scroll to it
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      // delay to allow layout to paint
      setTimeout(() => scrollToId(id), 0);
    }

    const onHashChange = () => {
      const id = window.location.hash.replace("#", "");
      scrollToId(id);
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [scrollToId]);

  return { scrollToId };
}
