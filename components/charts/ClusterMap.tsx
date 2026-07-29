"use client";

import { useState } from "react";
import Link from "next/link";
import { DataFigure } from "@/components/DataFigure";
import { Pictogram } from "@/components/Pictogram";
import { clusters } from "@/lib/content";

const PICTOGRAM: Record<string, string> = {
  "auto-components": "gear-cnc",
  "steel-furniture": "furniture",
  paithani: "loom",
  garment: "stitch",
  "truck-body": "truck-frame",
  bakery: "mixer",
  "general-engineering": "shed",
};

/**
 * Where the seven cluster projects are.
 *
 * A schematic, not a survey map — the outline is an abstracted Marathwada and
 * the positions are relative, which is why the figure says so in its own
 * caption rather than implying survey accuracy.
 *
 * Deliberately no colour encoding: seven categories cannot be told apart by hue
 * safely (the palette caps at two), so every mark is agri and carries its own
 * label. Colour does no work here and is not asked to.
 */
export function ClusterMap() {
  const [active, setActive] = useState<string | null>(null);
  const list = clusters.clusters;

  return (
    <DataFigure
      title="The seven clusters across Marathwada"
      caption="A schematic of the region — positions are relative, not surveyed. Four sit in and around Chhatrapati Sambhajinagar; three reach out to Beed and Latur."
      source="Locations as described on the chamber's cluster pages."
      table={{
        head: ["Cluster", "Where", "District", "Facilities proposed"],
        rows: list.map((c) => [c.name, c.location, c.district, c.facilities.length]),
      }}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-8">
        {/* The map */}
        <div className="relative">
          <svg
            viewBox="0 0 100 92"
            className="h-auto w-full"
            role="img"
            aria-label="Schematic map of Marathwada showing the location of seven industrial clusters"
          >
            {/* Abstracted regional outline. Drawn as a soft polygon so it reads
                as "the region" without pretending to be a boundary survey. */}
            <path
              d="M14 26 L30 12 L52 8 L74 16 L88 32 L86 54 L72 74 L52 86 L30 80 L16 62 Z"
              fill="var(--color-ink-700)"
              stroke="var(--color-clay)"
              strokeWidth="0.4"
              strokeDasharray="1.5 1.5"
            />

            {/* A faint grid, purely to help the eye place the marks. */}
            <g stroke="var(--color-grid)" strokeWidth="0.2">
              {[20, 40, 60, 80].map((v) => (
                <line key={`h${v}`} x1="14" y1={v} x2="88" y2={v} />
              ))}
              {[30, 50, 70].map((v) => (
                <line key={`v${v}`} x1={v} y1="10" x2={v} y2="84" />
              ))}
            </g>

            {/* Each mark carries its key number. Seven place names cannot be
                legibly labelled on the map itself at 360px, and a bare dot on a
                touch screen — where there is no hover — says nothing. The number
                ties the mark to its row in the list, which holds the names. */}
            {list.map((c, i) => {
              const on = active === c.id;
              return (
                <g
                  key={c.id}
                  onMouseEnter={() => setActive(c.id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(c.id)}
                  onBlur={() => setActive(null)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${i + 1}. ${c.name}, ${c.location}`}
                  className="cursor-pointer outline-none"
                >
                  <circle cx={c.x} cy={c.y} r="6.5" fill="transparent" />
                  {on && (
                    <circle
                      cx={c.x}
                      cy={c.y}
                      r="4.2"
                      fill="none"
                      stroke="var(--color-signal)"
                      strokeWidth="0.5"
                      opacity="0.55"
                      className="motion-safe:animate-ping"
                      style={{ transformOrigin: `${c.x}px ${c.y}px` }}
                    />
                  )}
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={on ? 4.2 : 3.4}
                    fill={on ? "var(--color-signal)" : "var(--color-agri)"}
                    stroke="var(--color-ink-900)"
                    strokeWidth="0.7"
                    className="transition-all duration-300 ease-[var(--ease-out-expo)]"
                  />
                  <text
                    x={c.x}
                    y={c.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="3.4"
                    fontWeight="700"
                    fill="var(--color-ink-900)"
                    className="pointer-events-none select-none"
                  >
                    {i + 1}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Name of the hovered cluster, in a fixed slot so nothing jumps. */}
          <p
            className="mt-2 min-h-[1.5rem] text-center text-sm text-signal"
            aria-live="polite"
          >
            {active ? list.find((c) => c.id === active)?.location : ""}
          </p>
        </div>

        {/* The list is the primary interface at 360px, and the map key at any
            width. Numbers match the marks. */}
        <ul className="divide-y divide-ink-600 border-y border-ink-600">
          {list.map((c, i) => {
            const on = active === c.id;
            return (
              <li key={c.id}>
                <Link
                  href={`/clusters/#${c.id}`}
                  prefetch={false}
                  onMouseEnter={() => setActive(c.id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(c.id)}
                  onBlur={() => setActive(null)}
                  className={`-mx-2 flex items-start gap-3 rounded-sm px-2 py-3 transition-colors duration-200 ${
                    on ? "bg-ink-700/60" : ""
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`tnum mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[3px] text-[0.68rem] font-bold transition-[background-color,transform] duration-300 ease-[var(--ease-out-expo)] ${
                      on ? "scale-110 bg-signal text-ink-900" : "bg-agri text-ink-900"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <Pictogram
                    name={PICTOGRAM[c.id] ?? "shed"}
                    className={`mt-0.5 h-5 w-5 shrink-0 transition-colors duration-200 ${
                      on ? "text-signal" : "text-agri"
                    }`}
                  />
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-sm font-medium transition-colors duration-200 ${
                        on ? "text-text-hi" : "text-text-mid"
                      }`}
                    >
                      {c.shortName}
                    </span>
                    <span className="block text-xs text-text-lo">{c.location}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </DataFigure>
  );
}
