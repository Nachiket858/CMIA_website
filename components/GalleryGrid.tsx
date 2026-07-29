"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FilterBar } from "@/components/FilterBar";
import { Picture, PhotoFrame } from "@/components/Picture";
import { gallery, allPhotos } from "@/lib/content";

const CATEGORY_LABEL: Record<string, string> = {
  roundtable: "CXO roundtables",
  meeting: "Meetings",
  investment: "Investment",
  chamber: "The chamber",
  skill: "Skills",
  initiative: "Initiatives",
  cluster: "Clusters",
  venue: "Bajaj Bhavan",
};

/**
 * A filterable, keyboard-navigable photo grid with a lightbox.
 *
 * Photographs load lazily at the grid's own size, not the lightbox's — the full
 * size is only fetched when something is opened, which matters when the visitor
 * is on 4G and only wanted to browse.
 */
export function GalleryGrid() {
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState<number | null>(null);
  const [closing, setClosing] = useState(false);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of allPhotos) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    return [...counts.entries()].map(([id, count]) => ({
      id,
      label: CATEGORY_LABEL[id] ?? id,
      count,
    }));
  }, []);

  const shown = useMemo(
    () => (filter === "all" ? allPhotos : allPhotos.filter((p) => p.category === filter)),
    [filter],
  );

  const requestClose = useCallback(() => {
    setClosing(true);
    window.setTimeout(() => {
      setOpen(null);
      setClosing(false);
    }, 180);
  }, []);

  const step = useCallback(
    (d: 1 | -1) => {
      setOpen((i) => (i === null ? null : (i + d + shown.length) % shown.length));
    },
    [shown.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, requestClose, step]);

  const current = open !== null ? shown[open] : null;

  // Basic swipe support: a horizontal drag past a small threshold steps.
  const [touchX, setTouchX] = useState<number | null>(null);

  return (
    <div>
      <FilterBar
        ariaLabel="Filter photographs by subject"
        options={categories}
        value={filter}
        onChange={(id) => {
          setFilter(id);
          setOpen(null);
        }}
        allLabel="All photographs"
        allCount={allPhotos.length}
      />

      <p className="tnum mt-5 text-sm text-text-lo" aria-live="polite">
        {shown.length} {shown.length === 1 ? "photograph" : "photographs"}
      </p>

      {/* Two across at 360px — big enough to see, small enough to scan. */}
      <ul className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
        {shown.map((p, i) => (
          <li key={`${p.album}-${p.file}`}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group block w-full overflow-hidden rounded-sm outline-none"
              aria-label={`Open: ${p.alt}`}
            >
              <PhotoFrame ratio="1/1" className="rounded-sm border border-ink-600/70 transition-[border-color,box-shadow] duration-300 group-hover:border-agri/50 group-hover:shadow-[var(--shadow-md)] group-focus-visible:border-agri-lift">
                <Picture
                  src={p.file}
                  alt={p.alt}
                  sizes="(max-width: 640px) 47vw, (max-width: 1024px) 31vw, 300px"
                  imgClassName="media-zoom h-full w-full object-cover"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-ink-900/0 transition-colors duration-300 group-hover:bg-ink-900/15"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-ink-900/70 text-text-hi backdrop-blur-sm">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                      <path
                        d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </span>
              </PhotoFrame>
            </button>
          </li>
        ))}
      </ul>

      {/* Lightbox */}
      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className={`overlay-in fixed inset-0 z-[60] flex flex-col bg-ink-900/97 backdrop-blur-sm transition-opacity duration-150 ${
            closing ? "opacity-0" : "opacity-100"
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) requestClose();
          }}
          onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX === null) return;
            const dx = e.changedTouches[0].clientX - touchX;
            if (Math.abs(dx) > 60) step(dx < 0 ? 1 : -1);
            setTouchX(null);
          }}
        >
          <div className="flex items-center justify-between gap-4 border-b border-ink-600 px-4 py-3">
            <p className="tnum text-sm text-text-lo">
              {open! + 1} / {shown.length}
            </p>
            <button
              type="button"
              onClick={requestClose}
              autoFocus
              className="pressable rounded-sm border border-ink-500 px-3.5 py-2 text-sm font-medium text-text-hi transition-colors hover:border-agri/50"
            >
              Close
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center p-3 sm:p-6">
            {/* Prev / next affordances — hidden on touch-primary via hover:flex,
                still reachable everywhere via keyboard and the buttons below. */}
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photograph"
              className="pressable absolute left-2 z-10 hidden h-11 w-11 place-items-center rounded-full border border-ink-500 bg-ink-900/70 text-text-hi backdrop-blur-sm transition-colors hover:border-agri/60 sm:grid"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next photograph"
              className="pressable absolute right-2 z-10 hidden h-11 w-11 place-items-center rounded-full border border-ink-500 bg-ink-900/70 text-text-hi backdrop-blur-sm transition-colors hover:border-agri/60 sm:grid"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <Picture
              key={current.file}
              src={current.file}
              alt={current.alt}
              sizes="92vw"
              priority
              imgClassName="sheet-in max-h-[70vh] w-auto max-w-full object-contain"
            />
          </div>

          <div className="border-t border-ink-600 px-4 py-4">
            <p className="text-sm leading-relaxed text-text-mid">{current.alt}</p>
            <p className="mt-1 text-xs text-agri">{current.albumTitle}</p>

            <div className="mt-4 flex gap-2 sm:hidden">
              <button
                type="button"
                onClick={() => step(-1)}
                className="pressable flex-1 rounded-sm border border-ink-500 px-4 py-3 text-sm font-medium text-text-hi"
              >
                ← Previous
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="pressable flex-1 rounded-sm border border-ink-500 px-4 py-3 text-sm font-medium text-text-hi"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Album covers, as a way in for someone who wants a whole event. */
export function AlbumStrip() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {gallery.albums.map((a) => (
        <li key={a.id}>
          <article className="surface surface-hover group gable-cut flex h-full flex-col overflow-hidden">
            <PhotoFrame ratio="4/3">
              <Picture
                src={a.cover}
                alt={a.photos[0].alt}
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 380px"
                imgClassName="media-zoom h-full w-full object-cover"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-ink-900/55 to-transparent"
              />
            </PhotoFrame>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-display text-[1.02rem] leading-snug font-semibold text-text-hi">
                {a.title}
              </h3>
              {"subtitle" in a && a.subtitle && (
                <p className="mt-1.5 text-sm text-text-mid">{a.subtitle}</p>
              )}
              <p className="tnum mt-auto pt-4 text-xs text-agri">
                {a.photos.length} {a.photos.length === 1 ? "photograph" : "photographs"}
              </p>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
