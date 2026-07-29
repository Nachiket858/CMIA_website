import Link from "next/link";
import { RooflineRule } from "@/components/Roofline";

/** The one container width used across the whole site. */
export function Container({
  children,
  className = "",
  wide = false,
}: {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`mx-auto px-4 sm:px-6 ${wide ? "max-w-[1400px]" : "max-w-[1240px]"} ${className}`}
    >
      {children}
    </div>
  );
}

export function Section({
  children,
  className = "",
  id,
  rule = false,
  tight = false,
  ground = "ink",
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  /** Draw the Roofline rule above this section. */
  rule?: boolean;
  tight?: boolean;
  ground?: "ink" | "ink-deep";
}) {
  return (
    <>
      {rule && (
        <Container>
          <RooflineRule />
        </Container>
      )}
      <section
        id={id}
        className={`${tight ? "py-12 lg:py-16" : "py-16 lg:py-24"} ${
          ground === "ink-deep" ? "bg-ink-900" : ""
        } ${className}`}
      >
        {children}
      </section>
    </>
  );
}

/** Small brass label above a heading. Never numbered unless it's a sequence. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-display text-[0.7rem] font-semibold tracking-[0.16em] text-brass uppercase">
      {children}
    </p>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lede,
  action,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  action?: { label: string; href: string };
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between ${className}`}>
      <div className="max-w-2xl">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2
          className={`text-[clamp(1.6rem,4.4vw,2.5rem)] font-semibold ${eyebrow ? "mt-2.5" : ""}`}
        >
          {title}
        </h2>
        {lede && <p className="measure mt-3.5 text-[1.02rem] leading-relaxed text-text-mid">{lede}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          prefetch={false}
          className="group/act inline-flex shrink-0 items-center gap-2 border-b border-brass/35 pb-1 text-sm font-medium text-brass-lift transition-colors duration-200 hover:border-brass hover:text-text-hi"
        >
          {action.label}
          <span
            aria-hidden="true"
            className="transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover/act:translate-x-1"
          >
            →
          </span>
        </Link>
      )}
    </div>
  );
}

/** The page masthead. Short by design — the page's content starts immediately. */
export function PageHeader({
  eyebrow,
  title,
  lede,
  figures,
  children,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  figures?: { value: string; label: string }[];
  children?: React.ReactNode;
}) {
  return (
    <header className="border-b border-ink-600 bg-ink-900 pt-10 pb-12 lg:pt-14 lg:pb-16">
      <Container>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="mt-3 max-w-4xl text-[clamp(2rem,6.2vw,3.6rem)] font-semibold">{title}</h1>
        {lede && (
          <p className="measure mt-5 text-[1.06rem] leading-relaxed text-text-mid sm:text-[1.14rem]">
            {lede}
          </p>
        )}
        {figures && figures.length > 0 && (
          <dl className="mt-9 flex flex-wrap gap-x-10 gap-y-5">
            {figures.map((f) => (
              <div key={f.label}>
                <dd className="tnum font-display text-[clamp(1.5rem,4vw,2.1rem)] leading-none font-semibold text-brass-lift">
                  {f.value}
                </dd>
                <dt className="mt-1.5 text-[0.78rem] tracking-wide text-text-lo uppercase">
                  {f.label}
                </dt>
              </div>
            ))}
          </dl>
        )}
        {children}
      </Container>
    </header>
  );
}

/**
 * The bone document panel. Anything longer than about forty words sits on this
 * rather than on the ink ground — text on bone runs at 13.7:1.
 */
export function Panel({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "aside" | "section";
}) {
  return (
    <Tag className={`bg-bone-100 text-doc-mid ${className}`}>
      <div className="[&_h2]:text-doc-hi [&_h3]:text-doc-hi [&_h4]:text-doc-hi [&_strong]:text-doc-hi">
        {children}
      </div>
    </Tag>
  );
}

/**
 * The one button on the site.
 *
 * Signal fill with ink text — 6.7:1, where white on that orange would be 2.9:1.
 * Every variant shares the same press feedback and the same gable chamfer, so a
 * button is recognisable as a button before it is read.
 *
 * The arrow on the primary variant nudges on hover: a small, cheap signal that
 * the control goes somewhere, and the only thing on the button that moves.
 */
export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  external = false,
  arrow = false,
  prefetch = false,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost" | "onBone";
  size?: "sm" | "md" | "lg";
  className?: string;
  external?: boolean;
  arrow?: boolean;
  /**
   * Next.js prefetches a visible Link's page data by default — fine on wifi,
   * real cost on the metered 4G most of this site's visitors are on. Off by
   * default; turn on only for the one or two links a visitor is genuinely
   * likely to take next (e.g. the membership CTA).
   */
  prefetch?: boolean;
}) {
  const styles = {
    primary:
      "bg-signal text-ink-900 font-semibold shadow-[var(--shadow-sm)] hover:bg-signal-lift hover:shadow-[var(--glow-signal)]",
    outline:
      "border border-brass/40 text-brass-lift font-medium hover:border-brass/80 hover:bg-brass/10 hover:text-text-hi",
    ghost: "text-text-mid font-medium hover:bg-ink-600/60 hover:text-text-hi",
    onBone:
      "bg-signal-deep text-bone-50 font-semibold shadow-[var(--shadow-sm)] hover:bg-doc-hi",
  }[variant];

  const sizing = {
    sm: "px-4 py-2.5 text-[0.82rem]",
    md: "px-5 py-3 text-sm",
    lg: "px-6 py-4 text-[0.95rem]",
  }[size];

  const cls = `gable-cut pressable group/btn inline-flex items-center justify-center gap-2 ${sizing} ${styles} ${className}`;

  const inner = (
    <>
      {children}
      {arrow && (
        <span
          aria-hidden="true"
          className="transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-1"
        >
          →
        </span>
      )}
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} prefetch={prefetch} className={cls}>
      {inner}
    </Link>
  );
}
