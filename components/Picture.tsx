import manifest from "@/public/img/manifest.json";

type Manifest = Record<string, { widths: number[]; width: number; height: number }>;
const IMG = manifest as Manifest;

export type PictureProps = {
  /** Path under assets/source without extension, e.g. "people/anuj-bansal". */
  src: string;
  /** Required. There is no decorative-image escape hatch here on purpose. */
  alt: string;
  /** `sizes` attribute — tell the browser how wide this renders. */
  sizes?: string;
  className?: string;
  imgClassName?: string;
  /** Only above-the-fold images should set this. Everything else lazy-loads. */
  priority?: boolean;
  /** Overrides the intrinsic ratio; use a CSS aspect class instead where possible. */
  width?: number;
  height?: number;
};

/**
 * AVIF with a WebP fallback, from the responsive set scripts/optimize.mjs built.
 *
 * Always emits width and height so nothing shifts while loading — on a patchy
 * 4G connection that shift is the difference between a readable page and a
 * jumping one.
 *
 * Deliberately a server component with no state. The loading treatment is the
 * `skeleton` class on the frame *around* the image: it shimmers until the
 * image paints on top of it and covers it. That gets the same effect as a
 * JS blur-up for zero bytes of JavaScript, across the hundred-odd images on
 * this site.
 */
export function Picture({
  src,
  alt,
  sizes = "100vw",
  className,
  imgClassName,
  priority = false,
  width,
  height,
}: PictureProps) {
  const entry = IMG[src];

  if (!entry) {
    // Never render a broken image. Loud in development, silent in production.
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[Picture] no optimized image for "${src}" — run npm run images`);
    }
    return null;
  }

  const set = (ext: "avif" | "webp") =>
    entry.widths.map((w) => `/img/${src}-${w}.${ext} ${w}w`).join(", ");

  const largest = entry.widths[entry.widths.length - 1];

  return (
    <picture className={className}>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      <img
        src={`/img/${src}-${largest}.webp`}
        alt={alt}
        width={width ?? entry.width}
        height={height ?? entry.height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className={imgClassName}
      />
    </picture>
  );
}

/** True when an optimized image exists — for deciding layout before rendering. */
export function hasImage(src?: string | null): src is string {
  return Boolean(src && IMG[src]);
}

export function imageRatio(src: string): number | null {
  const e = IMG[src];
  return e ? e.width / e.height : null;
}

/**
 * The frame a photograph sits in: fixed ratio, shimmering until the image
 * covers it, and the clipping boundary for `media-zoom` on hover.
 */
export function PhotoFrame({
  children,
  ratio = "4/3",
  className = "",
}: {
  children: React.ReactNode;
  ratio?: string;
  className?: string;
}) {
  return (
    <div
      className={`skeleton relative overflow-hidden ${className}`}
      style={{ aspectRatio: ratio.replace("/", " / ") }}
    >
      {children}
    </div>
  );
}
