import { buildRidge, ruleRidge, type Peak } from "@/lib/roofline";

/* ------------------------------------------------------------------ rule */

/**
 * The section rule. A repeating gable ridge, 7px tall, in brass at low opacity.
 * Purely structural — it separates sections and says "CMIA" while doing it.
 */
export function RooflineRule({
  className = "",
  tone = "brass",
}: {
  className?: string;
  tone?: "brass" | "clay";
}) {
  const ridge = ruleRidge(40, 7, 18);
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 720 8"
        preserveAspectRatio="none"
        className="h-2 w-full"
        role="presentation"
      >
        <path
          d={ridge.line}
          fill="none"
          stroke={tone === "brass" ? "var(--color-brass)" : "var(--color-clay)"}
          strokeWidth="1.5"
          strokeLinejoin="miter"
          opacity={tone === "brass" ? 0.5 : 0.35}
          transform="translate(0 0.75)"
        />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ ridge */

/**
 * A labelled ridge. Each peak is a place or a term, never an invented quantity.
 * Labels render as real text below the ridge so the information survives
 * without the graphic — and at 360px the labels stack to a plain list.
 */
export function LabelledRidge({
  peaks,
  height = 190,
  className = "",
  animate = true,
  activeId,
  ariaLabel,
}: {
  peaks: Peak[];
  height?: number;
  className?: string;
  animate?: boolean;
  activeId?: string;
  ariaLabel: string;
}) {
  const W = 1000;
  const ridge = buildRidge({ width: W, height, peaks, valleyLift: 0.06 });
  const bay = W / peaks.length;

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${W} ${height + 2}`}
        preserveAspectRatio="none"
        className="block h-[clamp(96px,22vw,190px)] w-full"
        role="img"
        aria-label={ariaLabel}
      >
        <defs>
          <linearGradient id="ridge-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brass)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--color-brass)" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        <path d={ridge.fill} fill="url(#ridge-fill)" />

        {/* Vertical drop from each apex — the shed's ridge post. */}
        {ridge.apexes.map((a) => (
          <line
            key={`post-${a.index}`}
            x1={a.x}
            y1={a.y}
            x2={a.x}
            y2={height}
            stroke="var(--color-brass)"
            strokeWidth="1"
            opacity={activeId && activeId === a.peak.id ? 0.75 : 0.22}
            vectorEffect="non-scaling-stroke"
          />
        ))}

        <path
          d={ridge.line}
          fill="none"
          stroke="var(--color-brass)"
          strokeWidth="2"
          strokeLinejoin="miter"
          vectorEffect="non-scaling-stroke"
          className={animate ? "ridge-draw" : undefined}
          style={animate ? ({ "--ridge-length": ridge.length } as React.CSSProperties) : undefined}
        />

        {ridge.apexes.map((a) => {
          const active = activeId && activeId === a.peak.id;
          return (
            <circle
              key={`apex-${a.index}`}
              cx={a.x}
              cy={a.y}
              r={active ? 5 : 3.5}
              fill={active ? "var(--color-signal)" : "var(--color-brass)"}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      {/*
        Labels align to the bays from 640px up. Below that, seven names across
        360px leaves 51px each and every one truncates ("WAL… CHIK… PAIT…"), so
        they wrap into a readable list instead. The names are the content here,
        and a truncated name is not a name.
      */}
      <ul
        className="mt-3 hidden gap-x-2 gap-y-1 text-[0.7rem] tracking-wide uppercase sm:grid sm:text-xs"
        style={{ gridTemplateColumns: `repeat(${peaks.length}, minmax(0, 1fr))` }}
      >
        {peaks.map((p) => (
          <li
            key={p.id ?? p.label}
            className={`truncate text-center ${
              activeId === p.id ? "text-signal" : "text-text-lo"
            }`}
            title={p.label}
          >
            {p.label}
          </li>
        ))}
      </ul>

      <ul className="mt-3.5 flex flex-wrap gap-x-3 gap-y-1.5 text-[0.72rem] tracking-wide uppercase sm:hidden">
        {peaks.map((p, i) => (
          <li key={p.id ?? p.label} className="flex items-center gap-1.5 text-text-lo">
            {i > 0 && (
              <span aria-hidden="true" className="text-brass">
                ·
              </span>
            )}
            {p.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------ vertical spine */

/**
 * The timeline spine: the same ridge turned on its side and run down the page.
 * One peak per entry. On narrow screens it sits in a 20px gutter to the left of
 * the content, which is where a 360px layout has room for it.
 */
export function RidgeSpine({
  count,
  activeIndex,
  className = "",
}: {
  count: number;
  activeIndex?: number;
  className?: string;
}) {
  const H = 1000;
  const w = 22;
  const bay = H / count;
  const pts: string[] = [`M 2 0`];
  for (let i = 0; i < count; i++) {
    pts.push(`L ${w - 2} ${bay * (i + 0.5)}`, `L 2 ${bay * (i + 1)}`);
  }

  return (
    <svg
      viewBox={`0 0 ${w} ${H}`}
      preserveAspectRatio="none"
      className={`h-full w-full ${className}`}
      aria-hidden="true"
      role="presentation"
    >
      <path
        d={pts.join(" ")}
        fill="none"
        stroke="var(--color-brass)"
        strokeWidth="1.5"
        opacity="0.45"
        vectorEffect="non-scaling-stroke"
      />
      {Array.from({ length: count }, (_, i) => (
        <circle
          key={i}
          cx={w - 2}
          cy={bay * (i + 0.5)}
          r={i === activeIndex ? 4 : 2.5}
          fill={i === activeIndex ? "var(--color-signal)" : "var(--color-brass)"}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
