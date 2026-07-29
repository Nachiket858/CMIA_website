import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section, SectionHead, PageHeader, Eyebrow, Panel, Button } from "@/components/Section";
import { Picture } from "@/components/Picture";
import { MemberLogos } from "@/components/MemberLogos";
import { Pictogram, type PictogramName } from "@/components/Pictogram";
import { IconCard } from "@/components/Cards";
import { Reveal } from "@/components/Reveal";
import { Disclosure } from "@/components/Disclosure";
import { site, timeline, members } from "@/lib/content";

export const metadata: Metadata = {
  title: "About CMIA",
  description:
    `An association of ${site.stats.members} member organisations working for industrialisation ` +
    `and the development of Marathwada since ${site.foundedYear}. Affiliated to CII, FICCI and ASSOCHAM.`,
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  const eras = timeline.eras;

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="An industry body, and an agricultural one."
        lede={`Formed in ${site.foundedYear} to speak for the industries of one district. Fifty-seven years on it speaks for a region — and since 2002, for its agriculture too.`}
        figures={[
          { value: String(site.yearsActive), label: "years" },
          { value: site.stats.members, label: "members" },
          { value: "3", label: "names" },
        ]}
      />

      {/* ---------------------------------------------- three names, one body */}
      <Section tight>
        <Container>
          <SectionHead
            eyebrow="Continuity"
            title="Three names, one organisation"
            lede="The chamber has changed its name twice as its remit widened — from a district, to a region, to a region and its agriculture."
            action={{ label: "The full timeline", href: "/about/history/" }}
          />

          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {eras.map((era, i) => (
              <Reveal as="li" key={era.id} delay={i * 90}>
                <div className="surface gable-cut flex h-full flex-col p-5">
                  <div className="flex h-16 items-center">
                    <Picture
                      src={era.logo}
                      alt={`${era.abbr} mark`}
                      sizes="120px"
                      imgClassName="max-h-14 w-auto"
                    />
                  </div>
                  <p className="tnum mt-5 font-display text-sm font-semibold text-agri">
                    {era.from}
                    {era.to ? `–${era.to}` : " – today"}
                  </p>
                  <h3 className="mt-1.5 font-display text-lg leading-snug font-semibold text-text-hi">
                    {era.abbr}
                  </h3>
                  <p className="mt-1 text-sm leading-snug text-text-mid">{era.name}</p>
                  <p className="mt-3 border-t border-ink-600 pt-3 text-xs leading-relaxed text-text-lo">
                    {era.logoNote}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>

          <p className="measure mt-8 text-sm leading-relaxed text-text-lo">
            The peaked chevrons in the MIA mark of 1989 are the same shape the chamber uses
            today — a row of shed roofs, which is what its members build under.
          </p>
        </Container>
      </Section>

      {/* -------------------------------------------------------- what we are */}
      <Section rule ground="ink-deep">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
            <div>
              <Eyebrow>What CMIA is</Eyebrow>
              <h2 className="mt-3 text-[clamp(1.5rem,4vw,2.2rem)] font-semibold">
                A chamber that represents, facilitates, promotes and builds.
              </h2>
              <ul className="mt-7 space-y-4">
                {site.positioning.map((p) => (
                  <li key={p} className="flex gap-3.5">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-agri" />
                    <span className="text-[0.97rem] leading-relaxed text-text-mid">{p}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button href="/what-we-do/" variant="outline">
                  What we do, in detail
                </Button>
              </div>
            </div>

            <div>
              <Eyebrow>This year&rsquo;s focus</Eyebrow>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {site.focus.map((f) => (
                  <li key={f.title}>
                    <IconCard title={f.title} detail={f.detail} pictogram={f.pictogram} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------- vision & policy */}
      <Section rule id="vision">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-14">
            <div>
              <Eyebrow>Vision &amp; policy</Eyebrow>
              <blockquote className="mt-5">
                <p className="font-display text-[clamp(1.35rem,3.6vw,2rem)] leading-[1.25] font-semibold text-text-hi">
                  &ldquo;{timeline.vision.statement}&rdquo;
                </p>
              </blockquote>

              <Panel className="mt-8 p-6">
                <h3 className="font-display text-[0.7rem] font-semibold tracking-[0.14em] text-signal-deep uppercase">
                  How the chamber pursues it
                </h3>
                <ul className="mt-4 space-y-3.5">
                  {timeline.vision.policy.map((p) => (
                    <li key={p} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 bg-signal-deep"
                      />
                      <span className="text-[0.95rem] leading-relaxed">{p}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-bone-300 pt-3 text-xs text-doc-lo">
                  Condensed from the chamber&rsquo;s published vision and policy statement.
                </p>
              </Panel>
            </div>

            <div>
              <Eyebrow>Affiliations</Eyebrow>
              <ul className="mt-5 divide-y divide-ink-600 border-y border-ink-600">
                {site.affiliations.map((a) => (
                  <li key={a.abbr}>
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-baseline gap-3 py-4 transition-colors hover:text-text-hi"
                    >
                      <span className="font-display text-base font-semibold text-agri-lift">
                        {a.abbr}
                      </span>
                      <span className="flex-1 text-sm text-text-mid">{a.name}</span>
                      <span aria-hidden="true" className="text-agri">
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Eyebrow>Also from the chamber</Eyebrow>
                {site.related.map((r) => (
                  <a
                    key={r.name}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="surface surface-hover gable-cut mt-4 block p-5"
                  >
                    <p className="font-display text-base font-semibold text-text-hi">
                      {r.name} <span aria-hidden="true">↗</span>
                    </p>
                    <p className="mt-1 text-sm text-text-mid">{r.fullName}</p>
                    <p className="mt-2 text-xs text-text-lo">{r.note}</p>
                  </a>
                ))}
              </div>

              <div className="mt-8">
                <Eyebrow>On record</Eyebrow>
                <figure className="mt-4">
                  <Picture
                    src={timeline.vision.certificate.image}
                    alt="The chamber's ISO certificate"
                    sizes="(max-width: 640px) 60vw, 260px"
                    imgClassName="w-full max-w-[240px] border border-ink-500"
                  />
                  <figcaption className="mt-2.5 text-xs text-text-lo">
                    {timeline.vision.certificate.label}
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------- registration */}
      <Section rule tight ground="ink-deep">
        <Container>
          <SectionHead eyebrow="For the record" title="Registration and identifiers" />
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
            {[
              { k: "Society registration", v: site.registration.societyReg },
              { k: "Public trust", v: site.registration.publicTrustReg },
              { k: "GST", v: site.registration.gst },
              { k: "PAN", v: site.registration.pan },
            ].map((r) => (
              <div key={r.k}>
                <dt className="text-[0.72rem] tracking-[0.1em] text-agri uppercase">{r.k}</dt>
                <dd className="tnum mt-1.5 text-sm break-all text-text-hi">{r.v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 max-w-2xl">
            <Disclosure
              summary="The chamber's constitution"
              meta="Formalised in 1994, amended in 2000-01"
            >
              {timeline.constitution.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
              <p className="text-sm text-text-lo">{timeline.constitution._note}</p>
            </Disclosure>
          </div>
        </Container>
      </Section>

      {/* --------------------------------------------------------- members */}
      <Section rule tight>
        <Container>
          <SectionHead eyebrow="Membership" title={members.heading} />
          <div className="mt-8">
            <MemberLogos />
          </div>
          <p className="mt-8">
            <Link
              href="/membership/"
              prefetch={false}
              className="inline-flex items-center gap-2 border-b border-agri/40 pb-1 text-sm font-medium text-agri-lift hover:border-agri hover:text-text-hi"
            >
              How to join <span aria-hidden="true">→</span>
            </Link>
          </p>
        </Container>
      </Section>
    </>
  );
}
