import type { Metadata } from "next";
import { Container, Section, PageHeader, SectionHead, Eyebrow, Panel, Button } from "@/components/Section";
import { Picture } from "@/components/Picture";
import { Pictogram, type PictogramName } from "@/components/Pictogram";
import { Reveal } from "@/components/Reveal";
import { initiatives } from "@/lib/content";

const hub = initiatives.skillHub;

export const metadata: Metadata = {
  title: "Marathwada Skill Hub",
  description:
    "CMIA at the centre and its member companies as support — a single connecting point for industry, academic institutes and state agencies training youth in Marathwada.",
  alternates: { canonical: "/initiatives/skill-hub/" },
};

export default function SkillHubPage() {
  return (
    <>
      <PageHeader
        eyebrow="Initiatives"
        title={hub.name}
        lede={hub.summary}
        figures={[
          { value: String(hub.facilities.length), label: "facilities" },
          { value: String(hub.gallery.length), label: "programmes recorded" },
        ]}
      >
        <blockquote className="mt-9 border-l-2 border-brass pl-5">
          <p className="measure font-display text-[clamp(1.1rem,2.8vw,1.45rem)] leading-snug font-semibold text-text-hi">
            &ldquo;{hub.quote}&rdquo;
          </p>
        </blockquote>
      </PageHeader>

      {/* ------------------------------------------------------- facilities */}
      <Section tight>
        <Container>
          <SectionHead eyebrow="What it offers" title="Six things the hub does" />
          <ul className="mt-10 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {hub.facilities.map((f, i) => (
              <Reveal as="li" key={f.title} delay={i * 60}>
                <div className="border-t border-brass/30 pt-5">
                  <Pictogram
                    name={f.pictogram as PictogramName}
                    className="h-7 w-7 text-brass"
                  />
                  <h3 className="mt-4 font-display text-[1.05rem] font-semibold text-text-hi">
                    {f.title}
                  </h3>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* -------------------------------------------------------- structure */}
      <Section rule ground="ink-deep">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <Eyebrow>How it is put together</Eyebrow>
              <h2 className="mt-3 text-[clamp(1.5rem,4vw,2.1rem)] font-semibold">
                CMIA in the centre, members as the support
              </h2>
              <ul className="mt-7 space-y-4">
                {hub.structure.map((s) => (
                  <li key={s.slice(0, 20)} className="flex gap-3.5">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-brass" />
                    <span className="text-[0.97rem] leading-relaxed text-text-mid">{s}</span>
                  </li>
                ))}
              </ul>
              <p className="measure mt-6 text-sm leading-relaxed text-text-lo">{hub.detail}</p>
            </div>

            <div>
              <Panel className="p-6 sm:p-8">
                <h3 className="font-display text-[0.7rem] font-semibold tracking-[0.14em] text-signal-deep uppercase">
                  What the hub believes
                </h3>
                <p className="mt-4 text-[1.02rem] leading-relaxed">{hub.belief}</p>
              </Panel>

              <div className="surface gable-cut mt-7 p-6">
                <Eyebrow>Talk to the hub</Eyebrow>
                <p className="mt-4 text-lg font-semibold text-text-hi">{hub.contact.name}</p>
                <p className="mt-3 text-sm">
                  <a
                    href={`tel:${hub.contact.phone}`}
                    className="text-brass-lift hover:text-text-hi"
                  >
                    {hub.contact.phone}
                  </a>
                </p>
                <p className="mt-1 text-sm">
                  <a
                    href={`mailto:${hub.contact.email}`}
                    className="break-all text-brass-lift hover:text-text-hi"
                  >
                    {hub.contact.email}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------- gallery */}
      <Section rule>
        <Container>
          <SectionHead
            eyebrow="On the ground"
            title="Training, industry visits and startup weekends"
            action={{ label: "The full gallery", href: "/gallery/" }}
          />

          <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {hub.gallery.map((g, i) => (
              <Reveal as="li" key={g.photo} delay={Math.min(i * 45, 300)}>
                <figure>
                  <Picture
                    src={g.photo}
                    alt={g.caption}
                    sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 280px"
                    imgClassName="aspect-square w-full border border-ink-500 object-cover"
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

      {/* ------------------------------------------------------------- news */}
      <Section rule tight ground="ink-deep">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
            <div>
              <Eyebrow>Visits</Eyebrow>
              <ul className="mt-5 divide-y divide-ink-600 border-y border-ink-600">
                {hub.news.map((n) => (
                  <li key={n} className="py-3.5 text-[0.97rem] leading-relaxed text-text-mid">
                    {n}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-center gap-3 sm:flex-row lg:flex-col lg:items-start">
              <Button href="/initiatives/training/">Training programmes</Button>
              <Button href="/initiatives/" variant="outline">
                All initiatives
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
