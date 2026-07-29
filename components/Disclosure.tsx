"use client";

import { useId, useState } from "react";

/**
 * Progressive disclosure for the long material — the constitution, committee
 * mandates, membership terms, a cluster's full machinery list.
 *
 * Built on a real <button> with aria-expanded rather than <details>, so the
 * open state can be styled consistently and the summary can hold a figure.
 * Content is always in the DOM, so search and Ctrl+F still find it.
 *
 * The open/close animates by collapsing a `grid-template-rows` track between
 * 0fr and 1fr, which is the one CSS-only way to animate to/from an intrinsic
 * height — no JS measuring, no layout thrash, and it degrades to instant under
 * reduced motion because the transition itself is what gets removed.
 */
export function Disclosure({
  summary,
  meta,
  children,
  defaultOpen = false,
  tone = "ink",
}: {
  summary: string;
  meta?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  tone?: "ink" | "bone";
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  const onBone = tone === "bone";

  return (
    <div
      className={`border-t ${onBone ? "border-bone-300" : "border-ink-600"} first:border-t-0`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        className={`group flex w-full items-start justify-between gap-4 py-4 text-left transition-colors duration-200 ${
          onBone ? "hover:text-doc-hi" : "hover:text-text-hi"
        }`}
      >
        <span className="flex-1">
          <span
            className={`block font-display text-[1.02rem] leading-snug font-semibold transition-colors duration-200 ${
              onBone
                ? "text-doc-hi"
                : open
                  ? "text-agri-lift"
                  : "text-text-hi"
            }`}
          >
            {summary}
          </span>
          {meta && (
            <span className={`mt-1 block text-sm ${onBone ? "text-doc-lo" : "text-text-lo"}`}>
              {meta}
            </span>
          )}
        </span>

        <span
          className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-sm border transition-[border-color,background-color,transform] duration-300 ease-[var(--ease-out-expo)] ${
            open ? "rotate-45" : ""
          } ${
            onBone
              ? "border-bone-300 text-doc-mid"
              : open
                ? "border-agri bg-agri/10 text-agri-lift"
                : "border-ink-500 text-agri group-hover:border-agri/60"
          }`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5">
            <path d="M0 6h12" stroke="currentColor" strokeWidth="1.6" />
            <path d="M6 0v12" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </span>
      </button>

      <div
        id={id}
        className="grid transition-[grid-template-rows] duration-[380ms] ease-[var(--ease-out-expo)]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="overflow-hidden">
          <div
            className={`measure space-y-3.5 pb-5 text-[0.97rem] leading-relaxed ${
              onBone ? "text-doc-mid" : "text-text-mid"
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Tabs, for content that is parallel rather than hierarchical. */
export function Tabs({
  tabs,
  ariaLabel,
}: {
  tabs: { id: string; label: string; count?: number; content: React.ReactNode }[];
  ariaLabel: string;
}) {
  const [active, setActive] = useState(tabs[0]?.id);

  return (
    <div>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="-mx-4 flex gap-1 overflow-x-auto border-b border-ink-600 px-4 pb-px sm:mx-0 sm:px-0"
      >
        {tabs.map((t) => {
          const on = t.id === active;
          return (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={on}
              aria-controls={`panel-${t.id}`}
              id={`tab-${t.id}`}
              onClick={() => setActive(t.id)}
              className={`relative shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                on ? "text-text-hi" : "text-text-lo hover:text-text-mid"
              }`}
            >
              {t.label}
              {t.count !== undefined && (
                <span className="tnum ml-2 text-xs text-text-lo">{t.count}</span>
              )}
              <span
                aria-hidden="true"
                className={`absolute right-3 -bottom-px left-3 h-[2px] origin-center bg-signal transition-transform duration-300 ease-[var(--ease-out-expo)] ${
                  on ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          );
        })}
      </div>

      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`panel-${t.id}`}
          aria-labelledby={`tab-${t.id}`}
          hidden={t.id !== active}
          className="sheet-in pt-8"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
