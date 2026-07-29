"use client";

import { useId, useState } from "react";

/**
 * The wrapper every chart on this site sits in.
 *
 * Three rules it enforces so no individual chart can forget them:
 *   - a caption that states what the chart says, in words
 *   - a real <table> of the same numbers, one toggle away
 *   - the source of the figures, named
 *
 * The table is not a grudging accessibility add-on. Several of these figures
 * (membership fees especially) are things a visitor will want to copy exactly,
 * and a table is simply the better artefact for that.
 */
export function DataFigure({
  title,
  caption,
  source,
  table,
  children,
  legend,
}: {
  title: string;
  caption?: string;
  source?: string;
  /** Header row plus body rows. Required — there is no opt-out. */
  table: { head: string[]; rows: (string | number)[][] };
  children: React.ReactNode;
  legend?: { label: string; color: string }[];
}) {
  const [showTable, setShowTable] = useState(false);
  const id = useId();

  return (
    <figure className="surface gable-cut overflow-hidden rounded-md">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-ink-500/70 px-4 py-3.5 sm:px-5">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-[0.95rem] leading-snug font-semibold text-text-hi">
            {title}
          </h3>
          {caption && (
            <p className="measure mt-1.5 text-sm leading-relaxed text-text-mid">{caption}</p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowTable((s) => !s)}
          aria-expanded={showTable}
          aria-controls={`${id}-table`}
          className="pressable group/tbl flex shrink-0 items-center gap-1.5 rounded-sm border border-ink-500 px-2.5 py-1.5 text-xs font-medium text-text-mid transition-colors duration-200 hover:border-agri/50 hover:text-text-hi"
        >
          <svg
            viewBox="0 0 14 14"
            className="h-3 w-3 text-agri"
            aria-hidden="true"
            fill="none"
          >
            <rect x="1" y="1" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" />
            <path d="M1 5h12M5 1v12" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          {showTable ? "Hide table" : "View as table"}
        </button>
      </div>

      {/* Legend. Always present when there is more than one series, so identity
          is never carried by colour alone. */}
      {legend && legend.length > 1 && (
        <ul className="flex flex-wrap gap-x-5 gap-y-2 px-4 pt-4 sm:px-5">
          {legend.map((l) => (
            <li key={l.label} className="flex items-center gap-2 text-xs text-text-mid">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 shrink-0 rounded-[1px]"
                style={{ background: l.color }}
              />
              {l.label}
            </li>
          ))}
        </ul>
      )}

      <div className="px-4 py-5 sm:px-5">{children}</div>

      <div
        className="grid transition-[grid-template-rows] duration-[380ms] ease-[var(--ease-out-expo)]"
        style={{ gridTemplateRows: showTable ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div
            id={`${id}-table`}
            className="border-t border-ink-500/70"
            aria-hidden={!showTable}
            inert={!showTable}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">{title}</caption>
                <thead>
                  <tr className="border-b border-ink-500/70">
                    {table.head.map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="px-4 py-2.5 text-xs font-semibold tracking-wide text-agri uppercase sm:px-5"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-ink-700 transition-colors duration-150 last:border-0 hover:bg-ink-700/40"
                    >
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          className={`px-4 py-2.5 sm:px-5 ${
                            j === 0 ? "text-text-hi" : "tnum text-text-mid"
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {source && (
        <figcaption className="border-t border-ink-500/70 px-4 py-2.5 text-xs text-text-lo sm:px-5">
          {source}
        </figcaption>
      )}
    </figure>
  );
}
