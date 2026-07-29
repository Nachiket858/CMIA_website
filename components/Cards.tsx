import Link from "next/link";
import { Picture, PhotoFrame, hasImage } from "@/components/Picture";
import { Pictogram, type PictogramName } from "@/components/Pictogram";

/**
 * A figure with real numbers. Never a decorative counter — every StatPlate on
 * this site shows a figure the chamber has actually published.
 */
export function StatPlate({
  value,
  label,
  note,
  tone = "brass",
}: {
  value: string;
  label: string;
  note?: string;
  tone?: "brass" | "signal";
}) {
  return (
    <div className="border-l-2 border-brass/35 pl-4">
      <p
        className={`tnum font-display text-[clamp(1.75rem,5vw,2.6rem)] leading-none font-semibold ${
          tone === "signal" ? "text-signal" : "text-brass-lift"
        }`}
      >
        {value}
      </p>
      <p className="mt-2.5 text-[0.78rem] leading-snug tracking-[0.12em] text-text-mid uppercase">
        {label}
      </p>
      {note && <p className="mt-1.5 text-xs leading-relaxed text-text-lo">{note}</p>}
    </div>
  );
}

/**
 * An icon-led card. Carries one idea; the detail is capped at three lines by
 * the copy itself, not by truncation.
 *
 * The pictogram lifts and brightens on hover — the card's only moving part
 * besides the card itself.
 */
export function IconCard({
  title,
  detail,
  more,
  pictogram,
  href,
  highlight = false,
  figure,
}: {
  title: string;
  detail?: string;
  /** Extra points, as short lines rather than more prose. */
  more?: string[];
  pictogram?: string;
  href?: string;
  highlight?: boolean;
  figure?: { value: string; label: string };
}) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        {pictogram && (
          <Pictogram
            name={pictogram as PictogramName}
            className={`h-7 w-7 shrink-0 transition-all duration-300 ease-[var(--ease-out-expo)] group-hover/card:-translate-y-0.5 ${
              highlight
                ? "text-signal"
                : "text-brass group-hover/card:text-brass-lift"
            }`}
          />
        )}
        {figure && (
          <span className="tnum font-display text-lg leading-none font-semibold text-brass-lift">
            {figure.value}
          </span>
        )}
      </div>

      <h3 className="mt-4 font-display text-[1.02rem] leading-snug font-semibold text-text-hi">
        {title}
      </h3>

      {detail && (
        <p className="mt-2 text-[0.9rem] leading-relaxed text-text-mid">{detail}</p>
      )}

      {more && more.length > 0 && (
        <ul className="mt-3.5 space-y-1.5 border-t border-ink-500/70 pt-3.5">
          {more.map((m) => (
            <li key={m.slice(0, 20)} className="flex gap-2.5">
              <span aria-hidden="true" className="mt-[0.45rem] h-1 w-1 shrink-0 bg-brass" />
              <span className="text-[0.85rem] leading-snug text-text-lo">{m}</span>
            </li>
          ))}
        </ul>
      )}

      {href && (
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-brass-lift">
          More
          <span
            aria-hidden="true"
            className="transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover/card:translate-x-1"
          >
            →
          </span>
        </span>
      )}
    </>
  );

  const base = `gable-cut surface group/card flex h-full flex-col p-5 ${
    highlight ? "border-signal/40" : ""
  }`;

  if (href) {
    return (
      <Link href={href} prefetch={false} className={`${base} surface-hover`}>
        {inner}
      </Link>
    );
  }
  return <div className={base}>{inner}</div>;
}

/**
 * A photo-led record — an event, an initiative, an album.
 *
 * Built so it still works with no photograph, because most of the chamber's
 * archive has none: without an image it becomes a typographic record with a
 * brass rule, not an empty grey box.
 */
export function PhotoRecord({
  title,
  detail,
  meta,
  photo,
  href,
  badge,
  category,
  ratio = "4/3",
}: {
  title: string;
  detail?: string;
  meta?: string;
  photo?: string | null;
  href?: string;
  badge?: string;
  category?: string;
  ratio?: "4/3" | "16/9" | "1/1";
}) {
  const withPhoto = hasImage(photo);

  const body = (
    <article
      className={`gable-cut surface group flex h-full flex-col overflow-hidden ${
        href ? "surface-hover" : ""
      }`}
    >
      {withPhoto ? (
        <PhotoFrame ratio={ratio}>
          <Picture
            src={photo!}
            alt={title}
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
            imgClassName="media-zoom h-full w-full object-cover"
          />
          {/* A soft floor under the image so the card body reads as attached
              to it rather than butted against it. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-ink-900/55 to-transparent"
          />
          {badge && (
            <span className="absolute top-0 left-0 bg-signal px-2.5 py-1 font-display text-[0.6rem] font-semibold tracking-[0.1em] text-ink-900 uppercase">
              {badge}
            </span>
          )}
        </PhotoFrame>
      ) : (
        // No photograph: a brass rule stands in, and the record reads as a
        // record rather than as a missing image.
        <div className="border-b border-ink-500/70 px-5 pt-5">
          <div className="h-px w-10 bg-brass transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:w-16" />
          {badge && (
            <span className="mt-3 inline-block bg-signal px-2 py-0.5 font-display text-[0.6rem] font-semibold tracking-[0.1em] text-ink-900 uppercase">
              {badge}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        {(meta || category) && (
          <p className="text-[0.68rem] tracking-[0.12em] text-brass uppercase">
            {[meta, category].filter(Boolean).join(" · ")}
          </p>
        )}
        <h3 className="mt-2 font-display text-[1.02rem] leading-snug font-semibold text-text-hi">
          {title}
        </h3>
        {detail && (
          <p className="mt-2 text-[0.88rem] leading-relaxed text-text-mid">{detail}</p>
        )}
      </div>
    </article>
  );

  return href ? (
    <Link href={href} prefetch={false} className="block h-full">
      {body}
    </Link>
  ) : (
    body
  );
}

/**
 * The closing call to action.
 *
 * Sits on a warm brass wash rather than flat ink, so the last thing on a page
 * lifts off it instead of dissolving into it.
 */
export function CTABar({
  title,
  lede,
  primary,
  secondary,
}: {
  title: string;
  lede?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <div className="gable-cut-lg relative overflow-hidden border border-brass/25 bg-ink-900 p-7 shadow-[var(--shadow-lg)] sm:p-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 130% at 6% 0%, rgba(204,152,102,0.15) 0%, transparent 60%)," +
            "radial-gradient(70% 120% at 96% 100%, rgba(255,102,52,0.12) 0%, transparent 62%)",
        }}
      />
      <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <h2 className="text-[clamp(1.45rem,3.6vw,2.05rem)] font-semibold">{title}</h2>
          {lede && (
            <p className="mt-3 leading-relaxed text-text-mid">{lede}</p>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
          <Link
            href={primary.href}
            className="gable-cut pressable group/btn inline-flex items-center justify-center gap-2 bg-signal px-6 py-3.5 text-center text-sm font-semibold text-ink-900 shadow-[var(--shadow-sm)] hover:bg-signal-lift hover:shadow-[var(--glow-signal)]"
          >
            {primary.label}
            <span
              aria-hidden="true"
              className="transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-1"
            >
              →
            </span>
          </Link>
          {secondary && (
            <Link
              href={secondary.href}
              prefetch={false}
              className="gable-cut pressable inline-flex items-center justify-center border border-brass/40 px-6 py-3.5 text-center text-sm font-medium text-brass-lift hover:border-brass/80 hover:bg-brass/10 hover:text-text-hi"
            >
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
