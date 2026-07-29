import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section, PageHeader, SectionHead, Eyebrow, Button } from "@/components/Section";
import { PhotoRecord, IconCard } from "@/components/Cards";
import { Picture } from "@/components/Picture";
import { Disclosure } from "@/components/Disclosure";
import { Reveal } from "@/components/Reveal";
import { initiatives, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Initiatives",
  description:
    "STRIVE — the only industry chamber in Maharashtra selected for the World Bank scheme — MAGIC incubation, the SuryaKumbh world-record solar cooking festival, and more.",
  alternates: { canonical: "/initiatives/" },
};

export default function InitiativesPage() {
  const list = initiatives.initiatives;
  const hub = initiatives.skillHub;
  const strive = list.find((i) => i.id === "strive")!;

  return (
    <>
      <PageHeader
        eyebrow="Initiatives"
        title="Things the chamber started."
        lede="Skills programmes, an incubator, a world record, and agreements that put member units in front of buyers and trainers."
        figures={[
          { value: String(list.length), label: "initiatives on record" },
          { value: "1", label: "Guinness World Record" },
        ]}
      />

      {/* ------------------------------------------------------- STRIVE lead */}
      <Section tight>
        <Container>
          <div className="gable-cut-lg border border-signal/35 bg-ink-900 p-6 shadow-[var(--shadow-lg)] sm:p-9">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-12">
              <div>
                <span className="inline-block bg-signal px-2.5 py-1 font-display text-[0.62rem] font-semibold tracking-[0.1em] text-ink-900 uppercase">
                  {strive.badge}
                </span>
                <h2 className="mt-4 text-[clamp(1.7rem,4.8vw,2.6rem)] leading-tight font-semibold">
                  {strive.title}
                </h2>
                <p className="mt-2 text-[1.02rem] text-brass-lift">{strive.subtitle}</p>
                <p className="measure mt-5 leading-relaxed text-text-mid">{strive.summary}</p>
                <p className="measure mt-3 leading-relaxed text-text-mid">{strive.detail}</p>
              </div>

              <div>
                <Eyebrow>Project documents</Eyebrow>
                <ul className="mt-4 divide-y divide-ink-600 border-y border-ink-600">
                  {strive.documents!.map((d) => (
                    <li
                      key={d}
                      className="flex items-baseline justify-between gap-3 py-2.5 text-sm"
                    >
                      <span className="text-text-mid">{d}</span>
                      <span className="shrink-0 text-[0.68rem] tracking-wide text-text-lo uppercase">
                        On request
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs leading-relaxed text-text-lo">
                  These were listed on the chamber&rsquo;s Skill Hub page without reachable
                  files. Ask the office for a copy.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ----------------------------------------------------- Skill Hub card */}
      <Section rule ground="ink-deep">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-14">
            <div>
              <div className="flex items-center gap-4">
                <Picture
                  src={hub.logo}
                  alt=""
                  sizes="64px"
                  imgClassName="h-14 w-auto"
                />
                <Eyebrow>Skills</Eyebrow>
              </div>
              <h2 className="mt-5 text-[clamp(1.6rem,4.4vw,2.4rem)] font-semibold">
                {hub.name}
              </h2>
              <p className="measure mt-4 leading-relaxed text-text-mid">{hub.summary}</p>

              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {hub.facilities.slice(0, 4).map((f) => (
                  <li key={f.title}>
                    <IconCard title={f.title} pictogram={f.pictogram} />
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button href="/initiatives/skill-hub/">All about the Skill Hub</Button>
              </div>
            </div>

            <Reveal>
              <div className="grid grid-cols-2 gap-3">
                {hub.gallery.slice(0, 4).map((g) => (
                  <figure key={g.photo}>
                    <Picture
                      src={g.photo}
                      alt={g.caption}
                      sizes="(max-width: 1024px) 44vw, 300px"
                      imgClassName="aspect-square w-full border border-ink-500 object-cover"
                    />
                  </figure>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------ all the rest */}
      <Section rule>
        <Container>
          <SectionHead
            eyebrow="On record"
            title="Everything else the chamber has run"
            lede="Conclaves, agreements, community work and summits — newest first."
          />

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list
              .filter((i) => i.id !== "strive")
              .map((init, i) => (
                <Reveal as="li" key={init.id} delay={Math.min(i * 60, 300)}>
                  <PhotoRecord
                    title={init.title}
                    detail={init.summary}
                    meta={"dateLabel" in init ? (init.dateLabel as string) : undefined}
                    photo={init.photo}
                    badge={"badge" in init ? (init.badge as string) : undefined}
                    href={"href" in init ? (init.href as string) : undefined}
                  />
                </Reveal>
              ))}
          </ul>
        </Container>
      </Section>

      {/* ------------------------------------------------------- SuryaKumbh */}
      <Section rule ground="ink-deep">
        <Container>
          {(() => {
            const sk = list.find((i) => i.id === "suryakumbh")!;
            return (
              <div>
                <SectionHead
                  eyebrow={sk.dateLabel}
                  title={sk.title}
                  lede={`${sk.summary} ${sk.detail}`}
                />
                <ul className="mt-10 grid gap-3 sm:grid-cols-3">
                  {sk.gallery!.map((g, i) => (
                    <Reveal as="li" key={g} delay={i * 80}>
                      <Picture
                        src={g}
                        alt="School students building and cooking with solar ovens at the SuryaKumbh festival"
                        sizes="(max-width: 640px) 92vw, 380px"
                        imgClassName="aspect-[4/3] w-full border border-ink-500 object-cover"
                      />
                    </Reveal>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-text-lo">Photographs: {sk.credit}</p>
              </div>
            );
          })()}
        </Container>
      </Section>

      {/* ---------------------------------------------------------- training */}
      <Section rule tight>
        <Container>
          <div className="gable-cut-lg flex flex-col gap-6 border border-brass/25 bg-ink-900 p-7 shadow-[var(--shadow-lg)] sm:flex-row sm:items-center sm:justify-between sm:p-9">
            <div className="max-w-xl">
              <Eyebrow>Training</Eyebrow>
              <h2 className="mt-3 text-[clamp(1.3rem,3.4vw,1.8rem)] font-semibold">
                Training programmes for members
              </h2>
              <p className="mt-3 leading-relaxed text-text-mid">
                Organised according to need, and delivered through the Skill Hub and member
                industry infrastructure.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3">
              <Button href="/initiatives/training/">Training programmes</Button>
              <Button href="/contact/" variant="outline">
                Request a programme
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
