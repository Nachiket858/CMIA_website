import Link from "next/link";
import { Picture } from "@/components/Picture";
import { Container } from "@/components/Section";
import { site } from "@/lib/content";
import { TERRITORY } from "@/lib/roofline";

/**
 * The home hero.
 *
 * The logo's "MIA" is a row of pitched roofs, so the hero is a row of pitched
 * roofs — but built out of the chamber's own photographs rather than drawn as a
 * line. Each shed is a real picture of the chamber's world, clipped to the
 * gable profile and duotoned into one of the three colours sampled from the
 * logo, rotating brass → signal → agri across the skyline. At that scale the
 * logo's palette *is* the page rather than an accent on it.
 *
 * Each panel is labelled with what it actually shows. The chamber's territory
 * is listed separately underneath — a photograph of a shop floor is not
 * evidence of which industrial estate it stands in, and the labels do not
 * pretend otherwise.
 *
 * Motion: the sheds go up in sequence, the headline sets line by line, then a
 * single band of brass light crosses the roofline once. Under
 * prefers-reduced-motion all of it resolves instantly to the final state.
 */

type Shed = {
  photo: string;
  label: string;
  alt: string;
  /** 0–1, how tall this shed stands. */
  height: number;
  tint: "brass" | "signal" | "agri";
  /** Hidden below 640px, where seven sheds would be 45px wide. */
  mobile?: boolean;
};

const SHEDS: Shed[] = [
  {
    photo: "clusters/auto-components",
    label: "Auto components",
    alt: "Auto component manufacturing on a shop floor in the Marathwada industrial belt",
    height: 0.78,
    tint: "brass",
    mobile: true,
  },
  {
    photo: "events/chamber-session-1",
    label: "The chamber in session",
    alt: "Members seated in the CMIA hall during a chamber session",
    height: 0.95,
    tint: "signal",
    mobile: true,
  },
  {
    photo: "clusters/paithani",
    label: "Paithani weaving",
    alt: "A Paithani sari, hand-woven from silk and zari in Paithan",
    height: 0.62,
    tint: "agri",
  },
  {
    photo: "events/cxo-roundtable-suresh-prabhu",
    label: "CXO roundtable",
    alt: "Shri Suresh Prabhu addressing CMIA members at a CXO roundtable",
    height: 1,
    tint: "brass",
    mobile: true,
  },
  {
    photo: "skill-hub/skill-hub-meeting-2018",
    label: "Skills",
    alt: "A Marathwada Skill Hub meeting in progress at CMIA",
    height: 0.7,
    tint: "signal",
  },
  {
    photo: "clusters/general-engineering",
    label: "General engineering",
    alt: "A general engineering workshop in the region",
    height: 0.84,
    tint: "agri",
  },
  {
    photo: "venue/conference-hall",
    label: "Bajaj Bhavan",
    alt: "The CMIA conference hall at Bajaj Bhavan, set for a meeting",
    height: 0.58,
    tint: "brass",
  },
];

const TINT: Record<Shed["tint"], string> = {
  brass: "var(--color-brass)",
  signal: "var(--color-signal)",
  agri: "var(--color-agri)",
};

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink-900">
      {/* A warm field behind everything, in the logo's own hue. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 78% at 12% 0%, rgba(204,152,102,0.20) 0%, rgba(204,152,102,0.05) 42%, transparent 72%)," +
            "radial-gradient(90% 60% at 92% 8%, rgba(255,102,52,0.14) 0%, transparent 62%)",
        }}
      />

      <Container className="relative">
        <div className="pt-9 pb-8 lg:pt-14 lg:pb-10">
          <p
            className="hero-fade font-display text-[0.72rem] font-semibold tracking-[0.2em] text-brass uppercase"
            style={{ "--d": "60ms" } as React.CSSProperties}
          >
            {site.address.city} · Est. {site.foundedYear}
          </p>

          {/* Each line wipes up from behind its own baseline. */}
          <h1 className="mt-4 max-w-[19ch] text-[clamp(2.2rem,7.4vw,4.8rem)] leading-[0.96] font-semibold tracking-[-0.03em]">
            {["The voice of", "Marathwada industry", `since ${site.foundedYear}.`].map(
              (line, i) => (
                <span key={line} className="block overflow-hidden pb-[0.08em]">
                  <span
                    className="hero-line"
                    style={{ "--d": `${140 + i * 110}ms` } as React.CSSProperties}
                  >
                    {i === 2 ? (
                      <>
                        since{" "}
                        <span className="text-brass-lift">{site.foundedYear}</span>.
                      </>
                    ) : (
                      line
                    )}
                  </span>
                </span>
              ),
            )}
          </h1>

          <div
            className="hero-fade mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
            style={{ "--d": "520ms" } as React.CSSProperties}
          >
            <p className="measure text-[1.06rem] leading-relaxed text-text-mid sm:text-[1.18rem]">
              {site.stats.members} member organisations, from single units to
              multinationals, across manufacturing, auto components, pharma,
              agro-processing, engineering and agriculture.
            </p>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                href="/membership/"
                className="gable-cut bg-signal px-6 py-4 text-center text-sm font-semibold text-ink-900 transition-colors hover:bg-signal-lift"
              >
                What membership gives you
              </Link>
              <Link
                href="/what-we-do/"
                prefetch={false}
                className="gable-cut border border-brass/50 px-6 py-4 text-center text-sm font-medium text-brass-lift transition-colors hover:border-brass hover:bg-brass/10 hover:text-text-hi"
              >
                What the chamber does
              </Link>
            </div>
          </div>
        </div>
      </Container>

      {/* ------------------------------------------------------ the skyline */}
      <div className="relative">
        <div className="relative mx-auto flex h-[clamp(190px,30vw,340px)] max-w-[1600px] items-end gap-1.5 px-2 sm:gap-2 sm:px-4">
          {SHEDS.map((shed, i) => (
            <figure
              key={shed.photo}
              className={`hero-gable relative min-w-0 flex-1 ${
                shed.mobile ? "" : "hidden sm:block"
              }`}
              style={
                {
                  height: `${shed.height * 100}%`,
                  "--d": `${300 + i * 90}ms`,
                } as React.CSSProperties
              }
            >
              <div className="gable-panel relative h-full w-full overflow-hidden bg-ink-700">
                <Picture
                  src={shed.photo}
                  alt={shed.alt}
                  sizes="(max-width: 640px) 34vw, 16vw"
                  priority={i < 4}
                  imgClassName="h-full w-full object-cover grayscale contrast-[1.12] brightness-[1.06]"
                />
                {/*
                  A true duotone, in two passes.

                  `color` takes the hue and saturation from this layer and keeps
                  the photograph's own luminance, so every detail survives and
                  the colour is exactly the value sampled from the logo. A
                  multiply pass under it puts the darks back, which `color`
                  alone leaves flat.

                  An earlier version used multiply alone at 50%, which muted the
                  hue into sepia and teal — recognisably tinted, but no longer
                  recognisably CMIA.
                */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 mix-blend-color"
                  style={{ background: TINT[shed.tint], opacity: 1 }}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 mix-blend-multiply"
                  style={{ background: TINT[shed.tint], opacity: 0.3 }}
                />
                {/* Base darkening so the label always clears its background. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-2/5"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(19,14,9,0.94), rgba(19,14,9,0))",
                  }}
                />
                <figcaption className="absolute inset-x-0 bottom-0 px-1.5 pb-2.5 text-center sm:px-2 sm:pb-3">
                  <span className="block truncate text-[0.6rem] leading-tight font-semibold tracking-[0.08em] text-text-hi uppercase sm:text-[0.68rem]">
                    {shed.label}
                  </span>
                </figcaption>
              </div>
            </figure>
          ))}

          {/* One pass of brass light across the finished roofline. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div
              className="hero-sweep h-full w-1/3"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(224,181,121,0.30), transparent)",
              }}
            />
          </div>
        </div>

        {/* The ground the sheds stand on. */}
        <div className="h-px w-full bg-brass/45" />
      </div>

      {/* ----------------------------------------------------- the territory */}
      <Container className="relative">
        <div
          className="hero-fade flex flex-wrap items-baseline gap-x-4 gap-y-1.5 py-5"
          style={{ "--d": "1000ms" } as React.CSSProperties}
        >
          <span className="font-display text-[0.66rem] font-semibold tracking-[0.18em] text-brass uppercase">
            The chamber&rsquo;s territory
          </span>
          <ul className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            {TERRITORY.map((p, i) => (
              <li
                key={p.id}
                className="flex items-baseline gap-3 text-[0.72rem] tracking-[0.1em] text-text-lo uppercase"
              >
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
      </Container>

      {/* ---------------------------------------------------------- figures */}
      <Container className="relative">
        <dl
          className="hero-fade grid grid-cols-2 gap-x-4 gap-y-8 border-t border-ink-600 py-10 sm:grid-cols-4 lg:py-12"
          style={{ "--d": "1100ms" } as React.CSSProperties}
        >
          {[
            { v: String(site.yearsActive), l: "years", n: `Founded ${site.foundedYear}` },
            { v: site.stats.members, l: "members", n: "Across eight districts" },
            {
              v: String(site.stats.presidentialTerms),
              l: "terms",
              n: "Of elected leadership",
            },
            { v: String(site.stats.clusters), l: "clusters", n: "Common Facility Centres" },
          ].map((s) => (
            <div key={s.l} className="border-l-2 border-brass/40 pl-4">
              <dd className="tnum font-display text-[clamp(2rem,6vw,3.4rem)] leading-none font-semibold text-brass-lift">
                {s.v}
              </dd>
              <dt className="mt-2.5 text-[0.78rem] tracking-[0.12em] text-text-mid uppercase">
                {s.l}
              </dt>
              <p className="mt-1 text-xs text-text-lo">{s.n}</p>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
