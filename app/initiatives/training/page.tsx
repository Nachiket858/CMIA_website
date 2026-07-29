import type { Metadata } from "next";
import { Container, Section, PageHeader, SectionHead, Eyebrow, Panel, Button } from "@/components/Section";
import { Picture } from "@/components/Picture";
import { PhotoRecord } from "@/components/Cards";
import { Reveal } from "@/components/Reveal";
import { initiatives, archiveByCategory } from "@/lib/content";

const hub = initiatives.skillHub;

export const metadata: Metadata = {
  title: "Training programmes",
  description:
    "Training organised for CMIA members according to need, and skill programmes run through the Marathwada Skill Hub — communication, presentation, Excel, sheet metal technology and industry visits.",
  alternates: { canonical: "/initiatives/training/" },
};

export default function TrainingPage() {
  const skillRecords = archiveByCategory("skill");

  return (
    <>
      <PageHeader
        eyebrow="Training"
        title="Training, organised as members need it."
        lede="The chamber runs programmes for member units and, through the Marathwada Skill Hub, for students and young people entering industry."
        figures={[
          { value: String(hub.gallery.length), label: "programmes on record" },
          { value: String(skillRecords.length), label: "skill initiatives" },
        ]}
      />

      {/* ---------------------------------------------------- two audiences */}
      <Section tight>
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
            <Panel className="p-6 sm:p-8">
              <h2 className="font-display text-[0.7rem] font-semibold tracking-[0.14em] text-signal-deep uppercase">
                For member units
              </h2>
              <p className="mt-4 text-[1.02rem] leading-relaxed">
                Need-based programmes for member companies and their staff. Past programmes on
                record include sheet metal technology, Excel, communication and presentation
                skills, and compliance management.
              </p>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-doc-lo">
                Tell the office what your unit needs and it can be arranged.
              </p>
              <div className="mt-6">
                <Button href="/contact/" variant="onBone">
                  Request a programme
                </Button>
              </div>
            </Panel>

            <div className="surface gable-cut p-6 sm:p-8">
              <h2 className="font-display text-[0.7rem] font-semibold tracking-[0.14em] text-agri uppercase">
                For students and young people
              </h2>
              <p className="mt-4 text-[1.02rem] leading-relaxed text-text-mid">
                The Marathwada Skill Hub runs apprenticeship promotion, on-job training,
                exposure visits to member factories, skills mapping and career counselling.
              </p>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-text-lo">
                Programmes have included industrial visits and skill development for children
                of police department staff.
              </p>
              <div className="mt-6">
                <Button href="/initiatives/skill-hub/">The Skill Hub</Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------- programmes on record */}
      <Section rule ground="ink-deep">
        <Container>
          <SectionHead
            eyebrow="On record"
            title="Programmes the chamber has run"
            lede="Photographed sessions from the Skill Hub's programme record."
          />

          <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {hub.gallery.map((g, i) => (
              <Reveal as="li" key={g.photo} delay={Math.min(i * 45, 280)}>
                <figure>
                  <Picture
                    src={g.photo}
                    alt={g.caption}
                    sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 280px"
                    imgClassName="aspect-[4/3] w-full border border-ink-500 object-cover"
                  />
                  <figcaption className="mt-2 text-xs leading-snug text-text-lo">
                    {g.caption}
                    {"dateLabel" in g && g.dateLabel && (
                      <span className="mt-0.5 block text-text-lo">{g.dateLabel}</span>
                    )}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* -------------------------------------------------- skill initiatives */}
      <Section rule>
        <Container>
          <SectionHead
            eyebrow="Skills work"
            title="Agreements and programmes behind the training"
            action={{ label: "All initiatives", href: "/initiatives/" }}
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skillRecords.map((r, i) => (
              <Reveal as="li" key={r.id} delay={i * 60}>
                <PhotoRecord
                  title={r.title}
                  detail={r.detail}
                  meta={r.dateLabel}
                  photo={r.photo}
                />
              </Reveal>
            ))}
          </ul>

          <div className="mt-10 max-w-2xl border-l border-agri/30 pl-5">
            <Eyebrow>A note</Eyebrow>
            <p className="mt-2.5 text-sm leading-relaxed text-text-lo">
              The chamber&rsquo;s old Training Programme page listed no scheduled programmes.
              Rather than leave an empty table, this page shows what has actually been run and
              how to ask for something new. Upcoming programmes will appear on the events page
              as they are announced.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
