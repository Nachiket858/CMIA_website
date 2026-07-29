import type { Metadata } from "next";
import { Container, Section, PageHeader, Eyebrow, Panel, Button } from "@/components/Section";
import { Picture } from "@/components/Picture";
import { Disclosure } from "@/components/Disclosure";
import { Reveal } from "@/components/Reveal";
import { RooflineRule } from "@/components/Roofline";
import { timeline, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "History",
  description:
    `Seven industrialists met in 1967-68. The association was inaugurated in October 1970, ` +
    `renamed Marathwada Industries Association in 1989, and became CMIA in April 2002.`,
  alternates: { canonical: "/about/history/" },
};

const KIND_STYLE: Record<string, { dot: string; label?: string }> = {
  founding: { dot: "bg-signal", label: "Founded" },
  rename: { dot: "bg-brass-lift", label: "Renamed" },
  milestone: { dot: "bg-brass" },
  initiative: { dot: "bg-series-1" },
  context: { dot: "bg-clay" },
  present: { dot: "bg-signal", label: "Today" },
};

export default function HistoryPage() {
  const milestones = [...timeline.milestones].sort((a, b) => a.year - b.year);
  const eras = timeline.eras;

  const eraOf = (year: number) => {
    for (let i = eras.length - 1; i >= 0; i--) if (year >= eras[i].from) return eras[i];
    return eras[0];
  };

  return (
    <>
      <PageHeader
        eyebrow="History"
        title="From seven industrialists to seven hundred and fifty members."
        lede={`The chamber has carried three names since ${site.foundedYear}. Here is what happened under each.`}
        figures={[
          { value: "1969", label: "founded" },
          { value: String(site.yearsActive), label: "years" },
          { value: "3", label: "names" },
        ]}
      />

      {/* ------------------------------------------------------- era markers */}
      <Section tight>
        <Container>
          <ol className="grid gap-4 md:grid-cols-3">
            {eras.map((era, i) => (
              <Reveal as="li" key={era.id} delay={i * 80}>
                <div className="surface gable-cut flex h-full gap-4 p-4">
                  <Picture
                    src={era.logo}
                    alt={`${era.abbr} mark`}
                    sizes="90px"
                    imgClassName="h-12 w-auto shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="tnum font-display text-sm font-semibold text-brass">
                      {era.from}
                      {era.to ? `–${era.to}` : " – today"}
                    </p>
                    <p className="mt-1 font-display text-base font-semibold text-text-hi">
                      {era.abbr}
                    </p>
                    <p className="mt-0.5 text-xs leading-snug text-text-lo">{era.name}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ---------------------------------------------------------- timeline */}
      <Section rule ground="ink-deep">
        <Container>
          <Eyebrow>The timeline</Eyebrow>
          <h2 className="mt-3 text-[clamp(1.6rem,4.4vw,2.4rem)] font-semibold">
            Fifty-seven years, in order
          </h2>

          {/* The ridge spine runs down the left. On a 360px screen it sits in a
              14px gutter — narrow, but the shape still reads. */}
          <ol className="mt-12 space-y-0">
            {milestones.map((m, i) => {
              const era = eraOf(m.year);
              const style = KIND_STYLE[m.kind] ?? KIND_STYLE.milestone;
              const photo = "photo" in m ? (m.photo as string | undefined) : undefined;
              const figure = "figure" in m ? (m.figure as { value: string; label: string }) : undefined;
              const people = "people" in m ? (m.people as string[]) : undefined;
              const peopleLabel = "peopleLabel" in m ? (m.peopleLabel as string) : undefined;

              return (
                <Reveal as="li" key={`${m.year}-${m.title}`} delay={Math.min(i * 45, 280)}>
                  <div className="relative grid grid-cols-[14px_minmax(0,1fr)] gap-x-4 pb-10 sm:grid-cols-[64px_22px_minmax(0,1fr)] sm:gap-x-5">
                    {/* Year, in its own column on wider screens */}
                    <p className="tnum col-start-2 mb-2 font-display text-sm font-semibold text-brass sm:col-start-1 sm:mb-0 sm:pt-0.5 sm:text-right">
                      {m.yearLabel}
                    </p>

                    {/* The gable + the connecting line */}
                    <div
                      className="relative col-start-1 row-start-1 flex justify-center sm:col-start-2"
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 22 14"
                        className="mt-1 h-3.5 w-[22px] shrink-0 overflow-visible"
                      >
                        <path
                          d="M1 13 L11 1 L21 13"
                          fill="none"
                          stroke="var(--color-brass)"
                          strokeWidth="1.6"
                        />
                      </svg>
                      {i < milestones.length - 1 && (
                        <span className="absolute top-6 bottom-[-1rem] left-1/2 w-px -translate-x-1/2 bg-brass/25" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="col-start-2 sm:col-start-3">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="font-display text-[1.08rem] leading-snug font-semibold text-text-hi sm:text-[1.2rem]">
                          {m.title}
                        </h3>
                        {style.label && (
                          <span
                            className={`${style.dot} px-2 py-0.5 font-display text-[0.58rem] font-semibold tracking-[0.1em] text-ink-900 uppercase`}
                          >
                            {style.label}
                          </span>
                        )}
                      </div>

                      <p className="mt-0.5 text-[0.7rem] tracking-wide text-text-lo uppercase">
                        {era.abbr}
                      </p>

                      {"body" in m && m.body && (
                        <p className="measure mt-3 text-[0.97rem] leading-relaxed text-text-mid">
                          {m.body}
                        </p>
                      )}

                      {figure && (
                        <p className="mt-4 flex items-baseline gap-2.5">
                          <span className="tnum font-display text-3xl leading-none font-semibold text-brass-lift">
                            {figure.value}
                          </span>
                          <span className="text-xs tracking-wide text-text-lo uppercase">
                            {figure.label}
                          </span>
                        </p>
                      )}

                      {people && (
                        <div className="mt-4 border-l border-brass/30 pl-4">
                          <p className="text-[0.7rem] tracking-[0.1em] text-brass uppercase">
                            {peopleLabel}
                          </p>
                          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                            {people.map((p) => (
                              <li key={p} className="text-sm text-text-mid">
                                {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {photo && (
                        <figure className="mt-5 max-w-md">
                          <Picture
                            src={photo}
                            alt={m.title}
                            sizes="(max-width: 640px) 88vw, 440px"
                            imgClassName="w-full border border-ink-500"
                          />
                        </figure>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ol>

          <RooflineRule className="mt-4" />
        </Container>
      </Section>

      {/* ------------------------------------------------- the long documents */}
      <Section rule>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-14">
            <div>
              <Eyebrow>The detail</Eyebrow>
              <h2 className="mt-3 text-[clamp(1.5rem,4vw,2.1rem)] font-semibold">
                The full record, where you want it
              </h2>
              <p className="measure mt-4 leading-relaxed text-text-mid">
                The chamber&rsquo;s founding narrative and its constitution are reproduced in
                full below.
              </p>

              <Panel className="mt-8 px-6 py-2">
                <Disclosure
                  tone="bone"
                  summary="How the association began"
                  meta="The sixties, and the seven who started it"
                >
                  <p>
                    This region is predominantly agricultural, with skilled traditions in Himroo
                    and the Paithani sari. The Malik Amber era saw paper, utensil, textile and
                    dyeing industries, but in an unorganised way, and the area came to be
                    classed as backward without any industrial climate.
                  </p>
                  <p>
                    Against that background, industrial awareness was set in motion in the
                    sixties by Deccan Flour Mills, Silverlight Nirlep Industries, Prakalp,
                    Maharashtra Engineering, Bagga Engineering and Garley Equipments.
                  </p>
                  <p>
                    In 1967-68 seven industrialists came together, and during the industries
                    week celebration of 1969 the Aurangabad District Industries Association was
                    formed, enrolling members from July 1969. Shri K. R. Bhat inaugurated it
                    formally in October 1970.
                  </p>
                  <p>
                    Shri Ghanshyamji Jalan and Shri N. G. Bhogale were the main pillars of the
                    association, with Shri D. B. Prabhu, Shri Divansing Bagga, Shri Yashwant
                    Garde, Shri B. G. Rane and Smt. Tai Bastikar.
                  </p>
                </Disclosure>

                <Disclosure
                  tone="bone"
                  summary="Why agriculture joined the name"
                  meta="April 2002"
                >
                  <p>
                    In a major shift of policy, the Marathwada Industries Association decided to
                    bring agriculture in as a focus subject. Members held that the growth of
                    Marathwada was only possible if agriculture in the region grew and became
                    world class.
                  </p>
                  <p>
                    With that view, MIA took the name Chamber of Marathwada Industries and
                    Agriculture from April 2002. The amended constitution incorporated
                    agriculture and agro-processing as a major thrust area, on the view that
                    without their comprehensive development the growth of the region and of its
                    industry would remain incomplete.
                  </p>
                </Disclosure>

                <Disclosure tone="bone" summary="The constitution" meta="1994, amended 2000-01">
                  {timeline.constitution.paragraphs.map((p) => (
                    <p key={p.slice(0, 24)}>{p}</p>
                  ))}
                  <p className="text-sm text-doc-lo">{timeline.constitution._note}</p>
                </Disclosure>
              </Panel>
            </div>

            <aside>
              <Eyebrow>Leadership through it all</Eyebrow>
              <p className="mt-4 leading-relaxed text-text-mid">
                Forty-four presidential terms are on record, from 1982-83 to today — with the
                honorary secretary for each.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button href="/leadership/past-presidents/">Every president since 1982</Button>
                <Button href="/leadership/" variant="outline">
                  This year&rsquo;s office bearers
                </Button>
              </div>

              <div className="mt-10 border-t border-ink-600 pt-6">
                <p className="text-[0.72rem] tracking-[0.1em] text-brass uppercase">
                  A note on the founding date
                </p>
                <p className="mt-2.5 text-sm leading-relaxed text-text-lo">
                  {eras[0]._flag}
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
