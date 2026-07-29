"use client";

import { useEffect, useState } from "react";
import { DataFigure } from "@/components/DataFigure";
import { membership, rupees, tenureCost, type FeeClass } from "@/lib/content";

const S1 = "var(--color-series-1)"; // agri  — annual subscription
const S2 = "var(--color-series-2)"; // signal — one-time admission

/**
 * What each class of membership costs in year one.
 *
 * Two series, laid out as horizontal bars because the category labels are long
 * ("Associate (Institutional)") and horizontal is the only orientation where
 * they stay readable at 360px. Bars reflow to full width and the labels sit
 * above their own bars on narrow screens.
 *
 * Every value is directly labelled, so the chart never depends on reading a
 * length against an axis. Bars grow in from zero on mount — the one motion
 * moment a bar chart is allowed, played once.
 */
export function FeeChart() {
  const [hover, setHover] = useState<string | null>(null);
  const [grown, setGrown] = useState(false);
  const classes = membership.classes as unknown as FeeClass[];
  const max = Math.max(...classes.map((c) => c.annual + c.admission));

  useEffect(() => {
    const t = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <DataFigure
      title="What the first year costs, by class of membership"
      caption="One-time admission fee plus the first annual subscription. Large Scale sits an order of magnitude above the rest; the three ₹3,000 classes are level on subscription and differ only on admission."
      source={`Published fee schedule, ${membership.feesEffective}. ${membership.gstNote} Figures below are before GST.`}
      legend={[
        { label: "Annual subscription", color: S1 },
        { label: "One-time admission fee", color: S2 },
      ]}
      table={{
        head: ["Class", "Annual (₹)", "Admission (₹)", "First year (₹)", "With 18% GST (₹)"],
        rows: classes.map((c) => {
          const t = tenureCost(c, membership.tenures[0]);
          return [
            c.name,
            c.annual.toLocaleString("en-IN"),
            c.admission.toLocaleString("en-IN"),
            t.base.toLocaleString("en-IN"),
            t.total.toLocaleString("en-IN"),
          ];
        }),
      }}
    >
      <ul className="space-y-5">
        {classes.map((c, i) => {
          const total = c.annual + c.admission;
          const on = hover === c.id;
          return (
            <li
              key={c.id}
              onMouseEnter={() => setHover(c.id)}
              onMouseLeave={() => setHover(null)}
              className="group"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span
                  className={`text-sm font-medium transition-colors duration-200 ${
                    on ? "text-text-hi" : "text-text-mid"
                  }`}
                >
                  {c.name}
                </span>
                <span className="tnum text-sm text-text-lo">
                  <span className="text-text-hi">{rupees(total)}</span>
                  <span className="hidden sm:inline"> first year</span>
                </span>
              </div>

              {/* 2px surface gap between the two fills, per the mark spec. Each
                  bar's outer (tip) corner is rounded; the anchored base stays
                  flush. */}
              <div className="mt-2 flex h-7 gap-[2px]" aria-hidden="true">
                <div
                  className="relative overflow-hidden rounded-l-[2px] transition-[width,opacity] ease-[var(--ease-out-expo)]"
                  style={{
                    width: grown ? `${(c.annual / max) * 100}%` : "0%",
                    background: S1,
                    opacity: hover && !on ? 0.45 : 1,
                    transitionDuration: "650ms, 200ms",
                    transitionDelay: `${i * 60}ms, 0ms`,
                  }}
                >
                  <span className="tnum absolute inset-y-0 right-2 flex items-center text-xs font-semibold whitespace-nowrap text-ink-900">
                    {c.annual >= 8000 ? rupees(c.annual) : ""}
                  </span>
                </div>
                <div
                  className="relative overflow-hidden rounded-r-[2px] transition-[width,opacity] ease-[var(--ease-out-expo)]"
                  style={{
                    width: grown ? `${(c.admission / max) * 100}%` : "0%",
                    background: S2,
                    opacity: hover && !on ? 0.45 : 1,
                    transitionDuration: "650ms, 200ms",
                    transitionDelay: `${i * 60 + 60}ms, 0ms`,
                  }}
                >
                  <span className="tnum absolute inset-y-0 right-2 flex items-center text-xs font-semibold whitespace-nowrap text-ink-900">
                    {c.admission >= 8000 ? rupees(c.admission) : ""}
                  </span>
                </div>
              </div>

              {/* Exact figures, always visible — the bars are the summary, not
                  the source of truth. */}
              <p className="tnum mt-1.5 text-xs text-text-lo">
                {rupees(c.annual)} a year + {rupees(c.admission)} once
              </p>
            </li>
          );
        })}
      </ul>
    </DataFigure>
  );
}

/**
 * Cost per year across the four tenure plans, for one chosen class.
 *
 * A single series: bar length already encodes the value and the x-order already
 * encodes tenure length, so colouring by tenure would re-encode what the reader
 * can see. The one plan with the lowest cost per year wears signal, because
 * "which should I pick" is the actual question on this page.
 */
export function TenureChart() {
  const classes = membership.classes as unknown as FeeClass[];
  const [classId, setClassId] = useState(classes[0].id);
  const [grown, setGrown] = useState(false);
  const cls = classes.find((c) => c.id === classId)!;

  useEffect(() => {
    const t = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const rows = membership.tenures.map((t) => ({
    tenure: t,
    ...tenureCost(cls, t),
  }));
  const best = rows.reduce((a, b) => (b.perYear < a.perYear ? b : a));
  const max = Math.max(...rows.map((r) => r.perYear));

  return (
    <DataFigure
      title="Cost per year falls the longer you commit"
      caption={`Total payable divided by the years covered, including the one-time admission fee and 18% GST. ${best.tenure.name} works out cheapest per year for ${cls.name.toLowerCase()}.`}
      source={`Calculated from the published fee schedule, ${membership.feesEffective}. Life membership runs 20 years.`}
      table={{
        head: ["Plan", "Years", "Subscription (₹)", "Admission (₹)", "GST (₹)", "Total (₹)", "Per year (₹)"],
        rows: rows.map((r) => [
          r.tenure.name,
          r.tenure.years,
          r.subscription.toLocaleString("en-IN"),
          r.admission.toLocaleString("en-IN"),
          r.gst.toLocaleString("en-IN"),
          r.total.toLocaleString("en-IN"),
          r.perYear.toLocaleString("en-IN"),
        ]),
      }}
    >
      <div className="mb-5">
        <label
          htmlFor="fee-class"
          className="block text-xs font-medium tracking-wide text-brass uppercase"
        >
          Class of membership
        </label>
        <select
          id="fee-class"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="field mt-2 w-full max-w-xs"
        >
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <ul className="space-y-4">
        {rows.map((r, i) => {
          const isBest = r.tenure.id === best.tenure.id;
          return (
            <li key={r.tenure.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <span className="text-sm font-medium text-text-mid">
                  {r.tenure.name}
                  {isBest && (
                    <span className="check-pop ml-2 rounded-[2px] bg-signal px-1.5 py-0.5 align-middle text-[0.6rem] font-semibold tracking-wide text-ink-900 uppercase">
                      lowest per year
                    </span>
                  )}
                </span>
                <span className="tnum text-sm">
                  <span className="text-text-hi">{rupees(r.perYear)}</span>
                  <span className="text-text-lo"> / year</span>
                </span>
              </div>

              <div className="mt-2 h-6 overflow-hidden rounded-[2px] bg-ink-700" aria-hidden="true">
                <div
                  className="h-full rounded-r-[2px] ease-[var(--ease-out-expo)]"
                  style={{
                    width: grown ? `${(r.perYear / max) * 100}%` : "0%",
                    background: isBest ? "var(--color-series-2)" : "var(--color-series-1)",
                    transitionProperty: "width, background-color",
                    transitionDuration: "600ms, 300ms",
                    transitionDelay: `${i * 70}ms, 0ms`,
                  }}
                />
              </div>

              <p className="tnum mt-1.5 text-xs text-text-lo">
                {rupees(r.total)} total for {r.tenure.years}{" "}
                {r.tenure.years === 1 ? "year" : "years"}, GST included
              </p>
            </li>
          );
        })}
      </ul>
    </DataFigure>
  );
}
