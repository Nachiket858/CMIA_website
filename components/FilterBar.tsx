"use client";

/**
 * One row of filters above the content. Not a dropdown — the counts are the
 * useful part and a row of chips shows all of them at once, which matters when
 * one category holds 17 records and another holds 3.
 *
 * Scrolls horizontally on narrow screens rather than wrapping into four rows.
 */
export function FilterBar({
  options,
  value,
  onChange,
  ariaLabel,
  allLabel = "All",
  allCount,
}: {
  options: { id: string; label: string; count?: number }[];
  value: string;
  onChange: (id: string) => void;
  ariaLabel: string;
  allLabel?: string;
  allCount?: number;
}) {
  const all = [{ id: "all", label: allLabel, count: allCount }, ...options];

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
    >
      {all.map((o) => {
        const on = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            aria-pressed={on}
            className={`pressable shrink-0 rounded-sm border px-3.5 py-2 text-sm transition-[background-color,border-color,color,box-shadow] duration-200 ease-[var(--ease-out-expo)] ${
              on
                ? "border-signal bg-signal font-semibold text-ink-900 shadow-[var(--shadow-sm)]"
                : "border-ink-500 text-text-mid hover:border-agri/50 hover:bg-ink-600/50 hover:text-text-hi"
            }`}
          >
            {o.label}
            {o.count !== undefined && (
              <span className={`tnum ml-2 text-xs ${on ? "text-ink-900/70" : "text-text-lo"}`}>
                {o.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
