"use client";

import { createElement, useEffect, useRef, useState } from "react";

/**
 * Scroll reveal. Adds a class once, on entry, and then stops observing.
 *
 * Everything is visible without JS (the `.js` class gates the hidden state) and
 * `prefers-reduced-motion` cancels the animation in CSS, so this never becomes
 * the reason someone cannot read the page.
 *
 * One shared IntersectionObserver serves every Reveal on the page rather than
 * one observer each — with sixty-odd of these on the events page, per-element
 * observers are a measurable cost on a mid-range phone for no benefit.
 */

type Cb = () => void;
const callbacks = new WeakMap<Element, Cb>();
let observer: IntersectionObserver | null = null;

function getObserver() {
  if (observer || typeof IntersectionObserver === "undefined") return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        callbacks.get(e.target)?.();
        callbacks.delete(e.target);
        observer!.unobserve(e.target);
      }
    },
    { rootMargin: "0px 0px -6% 0px", threshold: 0.05 },
  );
  return observer;
}

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "article" | "section";
}) {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;

    const io = getObserver();
    if (!io) {
      setSeen(true);
      return;
    }

    // Already in view on first paint (above the fold): show it immediately
    // rather than waiting for the observer's first callback.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setSeen(true);
      return;
    }

    callbacks.set(el, () => setSeen(true));
    io.observe(el);
    return () => {
      callbacks.delete(el);
      io.unobserve(el);
    };
  }, [seen]);

  return createElement(
    Tag,
    {
      ref: ref as React.Ref<HTMLElement>,
      className: `reveal ${seen ? "is-in" : ""} ${className}`,
      style: { "--reveal-delay": `${delay}ms` } as React.CSSProperties,
    },
    children,
  );
}

/** Staggers children by index. Caps the delay so a long list never lags. */
export function RevealList({
  children,
  step = 60,
  max = 360,
  className = "",
}: {
  children: React.ReactNode[];
  step?: number;
  max?: number;
  className?: string;
}) {
  return (
    <>
      {children.map((child, i) => (
        <Reveal key={i} delay={Math.min(i * step, max)} className={className}>
          {child}
        </Reveal>
      ))}
    </>
  );
}
