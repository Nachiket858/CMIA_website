"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Picture } from "@/components/Picture";
import { site } from "@/lib/content";

type NavChild = { label: string; href: string; note?: string };
type NavItem = { label: string; href: string; children?: NavChild[] };

/**
 * Six items, built for the four audiences at once: members go to Events and
 * Circulars, prospects to Membership, government and partners to Leadership and
 * About, students to What we do.
 */
const NAV: NavItem[] = [
  {
    label: "About",
    href: "/about/",
    children: [
      { label: "About CMIA", href: "/about/", note: "Who we are, and the four things we focus on" },
      { label: "History", href: "/about/history/", note: "1969 to today, in one timeline" },
      { label: "Vision & policy", href: "/about/#vision" },
    ],
  },
  {
    label: "Leadership",
    href: "/leadership/",
    children: [
      { label: "Office bearers", href: "/leadership/", note: "The 2026-27 team, zones and cells" },
      { label: "Past presidents", href: "/leadership/past-presidents/", note: "44 terms since 1982" },
    ],
  },
  {
    label: "What we do",
    href: "/what-we-do/",
    children: [
      { label: "Overview", href: "/what-we-do/", note: "Represent, facilitate, promote, build" },
      { label: "Clusters", href: "/clusters/", note: "Seven Common Facility Centres" },
      { label: "Initiatives", href: "/initiatives/", note: "STRIVE, MAGIC, SuryaKumbh and more" },
      { label: "Marathwada Skill Hub", href: "/initiatives/skill-hub/" },
      { label: "Venue & halls", href: "/venue/", note: "Bajaj Bhavan" },
    ],
  },
  {
    label: "Membership",
    href: "/membership/",
    children: [
      { label: "Benefits & fees", href: "/membership/", note: "What you get, and what it costs" },
      { label: "Apply for membership", href: "/membership/apply/" },
    ],
  },
  {
    label: "Events & media",
    href: "/events/",
    children: [
      { label: "Events", href: "/events/", note: "Upcoming, and 51 records of past work" },
      { label: "Gallery", href: "/gallery/" },
      { label: "News & circulars", href: "/news/" },
      { label: "Resources", href: "/resources/", note: "Government and industry links" },
    ],
  },
  { label: "Contact", href: "/contact/" },
];

export function Header() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes whichever layer is open; the mobile sheet also locks scroll.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenMenu(null);
      setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  /** A short grace period, so the pointer can cross the gap to the panel. */
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const isActive = (href: string) => {
    const base = href.split("#")[0];
    if (base === "/") return pathname === "/";
    return pathname === base || pathname.startsWith(base);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ease-[var(--ease-out-expo)] ${
        scrolled
          ? "glass border-ink-500/80 shadow-[var(--shadow-md)]"
          : "border-transparent bg-ink-900"
      }`}
    >
      <div
        className={`mx-auto flex max-w-[1240px] items-center gap-3 px-4 transition-[padding] duration-300 ease-[var(--ease-out-expo)] sm:px-6 ${
          scrolled ? "py-2 lg:py-2" : "py-2.5 lg:py-3.5"
        }`}
      >
        <Link
          href="/"
          className="group/logo flex shrink-0 items-center gap-2.5"
          aria-label={`${site.shortName} — home`}
        >
          <Picture
            src="identity/cmia-logo-original"
            alt=""
            sizes="80px"
            priority
            imgClassName={`w-auto transition-[height,transform] duration-300 ease-[var(--ease-out-expo)] group-hover/logo:scale-[1.04] ${
              scrolled ? "h-8 lg:h-9" : "h-9 lg:h-10"
            }`}
          />
          <span className="hidden font-display text-[0.66rem] leading-[1.15] font-semibold tracking-tight text-text-mid uppercase transition-colors duration-200 group-hover/logo:text-text-hi min-[420px]:block lg:text-[0.7rem]">
            Chamber of Marathwada
            <br />
            Industries &amp; Agriculture
          </span>
        </Link>

        <nav ref={navRef} className="ml-auto hidden items-center gap-0.5 lg:flex">
          {NAV.map((item) => {
            const active = isActive(item.href);
            const open = openMenu === item.label;

            if (!item.children) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  prefetch={false}
                  className={`relative rounded-sm px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    active ? "text-agri-lift" : "text-text-mid hover:text-text-hi"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                  <NavUnderline on={active} />
                </Link>
              );
            }

            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => {
                  cancelClose();
                  setOpenMenu(item.label);
                }}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  onClick={() => setOpenMenu(open ? null : item.label)}
                  className={`relative flex items-center gap-1.5 rounded-sm px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    active || open ? "text-agri-lift" : "text-text-mid hover:text-text-hi"
                  }`}
                  aria-expanded={open}
                  aria-haspopup="true"
                >
                  {item.label}
                  <svg
                    viewBox="0 0 10 6"
                    className={`h-1.5 w-2.5 transition-transform duration-300 ease-[var(--ease-out-expo)] ${
                      open ? "-rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  >
                    <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  <NavUnderline on={active} />
                </button>

                {open && (
                  <div
                    className="menu-in absolute top-[calc(100%+6px)] left-0 w-[20rem] overflow-hidden rounded-md border border-ink-500 bg-ink-900/97 p-1.5 shadow-[var(--shadow-xl)] backdrop-blur-md"
                    onMouseEnter={cancelClose}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        prefetch={false}
                        className="group/item block rounded-sm px-3 py-2.5 transition-colors duration-150 hover:bg-ink-600/70"
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span className="text-sm font-medium text-text-hi">
                            {child.label}
                          </span>
                          <span
                            aria-hidden="true"
                            className="translate-x-[-4px] text-agri opacity-0 transition-all duration-200 ease-[var(--ease-out-expo)] group-hover/item:translate-x-0 group-hover/item:opacity-100"
                          >
                            →
                          </span>
                        </span>
                        {child.note && (
                          <span className="mt-0.5 block text-xs leading-snug text-text-lo">
                            {child.note}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <Link
            href="/membership/apply/"
            className="gable-cut pressable group/cta ml-2.5 inline-flex items-center gap-1.5 bg-signal px-4 py-2.5 text-sm font-semibold text-ink-900 shadow-[var(--shadow-sm)] transition-[background-color,box-shadow] duration-200 hover:bg-signal-lift hover:shadow-[var(--glow-signal)]"
          >
            Apply
            <span
              aria-hidden="true"
              className="transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover/cta:translate-x-0.5"
            >
              →
            </span>
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="pressable ml-auto flex items-center gap-2 rounded-sm border border-ink-500 px-3 py-2 text-sm font-medium text-text-hi lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          <svg viewBox="0 0 18 12" className="h-3 w-4" aria-hidden="true">
            <path d="M0 1h18M0 6h18M0 11h18" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          Menu
        </button>
      </div>

      {/* Mobile: a full sheet. No nested accordions to get lost in — every
          destination is one tap from here. */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          className="overlay-in fixed inset-0 z-50 flex flex-col bg-ink-900 lg:hidden"
        >
          <div className="flex items-center justify-between border-b border-ink-600 px-4 py-2.5">
            <Picture
              src="identity/cmia-logo-original"
              alt={site.shortName}
              sizes="80px"
              imgClassName="h-9 w-auto"
            />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              autoFocus
              className="pressable rounded-sm border border-ink-500 px-3.5 py-2 text-sm font-medium text-text-hi"
            >
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-4 pt-5 pb-8">
            {NAV.map((item, i) => (
              <div
                key={item.label}
                className="sheet-in mb-6"
                style={{ animationDelay: `${40 + i * 45}ms` }}
              >
                <Link
                  href={item.href}
                  className="block font-display text-xl font-semibold tracking-tight text-text-hi"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="mt-2 border-l border-agri/30 pl-4">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block py-2 text-[0.95rem] text-text-mid transition-colors duration-150 active:text-text-hi"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-ink-600 bg-ink-900 p-4">
            <Link
              href="/membership/apply/"
              className="gable-cut pressable block bg-signal px-4 py-3.5 text-center font-semibold text-ink-900"
            >
              Apply for membership
            </Link>
            <a
              href={`tel:${site.contact.phone}`}
              className="mt-2 block px-4 py-3 text-center text-sm text-text-mid"
            >
              Call the office · {site.contact.phoneDisplay}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

/** The active/hover rule under a nav item. Grows from the centre. */
function NavUnderline({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute inset-x-3 bottom-1 h-px origin-center bg-agri transition-transform duration-300 ease-[var(--ease-out-expo)] ${
        on ? "scale-x-100" : "scale-x-0"
      }`}
    />
  );
}
