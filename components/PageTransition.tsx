"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Route transition.
 *
 * Re-keying on the pathname replays a short settle animation on the incoming
 * page. Deliberately not a cross-fade: that needs both route trees alive at
 * once, and on a static export the cost lands on exactly the low-end phones
 * this site is built for.
 *
 * It also restores the two things a client-side route change loses — scroll
 * position and focus — which matters more than the animation does. Focus moves
 * to the new page's <main> so a keyboard or screen-reader user is not left
 * pointing at a link on the page they just left.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const first = useRef(true);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    // Only when the browser is not restoring a position itself (back/forward).
    if (window.history.scrollRestoration !== "manual") {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <div
      key={pathname}
      ref={mainRef}
      tabIndex={-1}
      className="page-in outline-none"
    >
      {children}
    </div>
  );
}
