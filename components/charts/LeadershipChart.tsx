"use client";

import { useState } from "react";
import { DataFigure } from "@/components/DataFigure";
import { terms, secretaryToPresident, repeatPresidents, termStartYear } from "@/lib/content";
import { timeline } from "@/lib/content";

const ERA_COLOR = ["var(--color-era-1)", "var(--color-era-2)", "var(--color-era-3)"];

function eraOf(year: number) {
  const eras = timeline.eras;
  for (let i = eras.length - 1; i >= 0; i--) {
    if (year >= eras[i].from) return i;
  }
  return 0;
}

/**
 * Forty-four terms as a ridge — the signature element carrying real content.
 *
 * Each bay is one presidential term, oldest at the left. Bay height is uniform:
 * a term is a term, and varying the height would invent a quantity the chamber
 * has never published. What the ridge encodes is *era* (the three names the
 * organisation has carried) through the ordinal brass ramp, and *now* through
 * signal on the current term.
 */
export function SuccessionRidge() {
  const [active, setActive] = useState<number | null>(null);
  const list = terms.slice().reverse(); // oldest first
  const W = 1000;
  const H = 120;
  const bay = W / list.length;

  const activeTerm = active !== null ? list[active] : null;

  return (
    <DataFigure
      title="Forty-four terms, 1982-83 to today"
      caption="One peak per presidential term, oldest on the left. Shading marks the three names the organisation has carried; the term in signal is the current one."
      source="Past President records published by the chamber. The 1989-90 row appeared as '1998-90' on the old site and is corrected here as a flagged typo."
      legend={timeline.eras.map((e, i) => ({ label: e.abbr, color: ERA_COLOR[i] }))}
      table={{
        head: ["Term", "President", "Honorary Secretary"],
        rows: terms.map((t) => [t.year, t.president, t.secretary]),
      }}
    >
      <svg
        viewBox={`0 0 ${W} ${H + 4}`}
        preserveAspectRatio="none"
        className="block h-[clamp(90px,18vw,130px)] w-full"
        role="img"
        aria-label="Ridge of 44 presidential terms from 1982-83 to the present, grouped by the three eras ADIA, MIA and CMIA"
      >
        {list.map((t, i) => {
          const era = eraOf(termStartYear(t.year));
          const on = active === i;
          const x0 = bay * i;
          const cx = x0 + bay / 2;
          const top = 18;
          return (
            <g
              key={t.year}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              tabIndex={0}
              role="button"
              aria-label={`${t.year}: ${t.president}`}
              className="cursor-pointer outline-none"
            >
              <rect x={x0} y={0} width={bay} height={H} fill="transparent" />
              {/* The gable for this term. 2px surface gap between neighbours. */}
              <path
                d={`M ${x0 + 1} ${H} L ${cx} ${top} L ${x0 + bay - 1} ${H} Z`}
                fill={t.current ? "var(--color-signal)" : ERA_COLOR[era]}
                opacity={active === null ? 1 : on ? 1 : 0.42}
                className="transition-opacity duration-150"
              />
            </g>
          );
        })}
        <line x1="0" y1={H} x2={W} y2={H} stroke="var(--color-axis)" strokeWidth="1" />
      </svg>

      {/* Era labels under the ridge. */}
      <div className="mt-2 flex text-[0.65rem] tracking-wide text-text-lo uppercase">
        {timeline.eras.map((e, i) => {
          const count = list.filter((t) => eraOf(termStartYear(t.year)) === i).length;
          if (count === 0) return null;
          return (
            <div
              key={e.id}
              style={{
                width: `${(count / list.length) * 100}%`,
                borderTopColor: ERA_COLOR[i],
              }}
              className="border-t-2 pt-1.5 pr-2"
            >
              {/* The era's ramp step colours the rule, not the label. Those
                  steps clear 3:1 as chart marks but not 4.5:1 as text. */}
              <span className="text-brass-lift">{e.abbr}</span>
              <span className="tnum ml-1.5 text-text-lo">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Fixed-height readout so hovering never shifts the layout. */}
      <div className="mt-4 min-h-[3.25rem] border-t border-ink-600 pt-3">
        {activeTerm ? (
          <div>
            <p className="tnum font-display text-sm font-semibold text-brass-lift">
              {activeTerm.year}
            </p>
            <p className="mt-0.5 text-sm text-text-hi">{activeTerm.president}</p>
            <p className="text-xs text-text-lo">
              Hon. Secretary · {activeTerm.secretary}
            </p>
          </div>
        ) : (
          <p className="text-sm text-text-lo">
            Hover or focus a term to see who led it.
          </p>
        )}
      </div>
    </DataFigure>
  );
}

/**
 * The chamber's own succession pattern: honorary secretaries who later became
 * president.
 *
 * This is derived from the published table, not asserted on top of it — the
 * count and the names come straight from the rows. It is the most interesting
 * thing in that dataset and the old site rendered it as a 44-row spreadsheet.
 */
export function SecretaryPipeline() {
  const pipeline = secretaryToPresident();
  const repeats = repeatPresidents();

  return (
    <DataFigure
      title="The secretary's chair leads to the president's"
      caption={`${pipeline.length} of the chamber's presidents had served as honorary secretary first — most of them reaching the chair within a few years.`}
      source="Derived from the chamber's published Past President table. Two names spelled inconsistently there could not be matched and are excluded rather than guessed at."
      table={{
        head: ["Name", "Secretary", "President", "Years between"],
        rows: pipeline.map((p) => [
          p.name,
          p.secretaryYears.join(", "),
          p.presidentYears.join(", "),
          p.gapYears,
        ]),
      }}
    >
      <ul className="space-y-3">
        {pipeline.map((p) => (
          <li key={p.name} className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-1">
            <span className="text-sm text-text-hi">{p.name}</span>
            <span className="tnum text-xs text-text-lo">
              {p.gapYears} {p.gapYears === 1 ? "year" : "years"}
            </span>
            <span className="col-span-2 flex items-center gap-2 text-xs">
              <span className="tnum text-text-lo">{p.secretaryYears.at(-1)}</span>
              <span
                aria-hidden="true"
                className="h-px flex-1"
                style={{ background: "var(--color-series-1)" }}
              />
              <span aria-hidden="true" className="text-brass">
                →
              </span>
              <span
                aria-hidden="true"
                className="h-px flex-1"
                style={{ background: "var(--color-series-2)" }}
              />
              <span className="tnum text-text-mid">{p.presidentYears.at(-1)}</span>
            </span>
          </li>
        ))}
      </ul>

      {repeats.length > 0 && (
        <div className="mt-6 border-t border-ink-600 pt-4">
          <p className="text-xs font-semibold tracking-wide text-brass uppercase">
            Served more than once
          </p>
          <ul className="mt-2.5 space-y-1.5">
            {repeats.map((r) => (
              <li key={r.name} className="flex flex-wrap gap-x-2 text-sm">
                <span className="text-text-hi">{r.name}</span>
                <span className="tnum text-text-lo">{r.years.join(" · ")}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </DataFigure>
  );
}
