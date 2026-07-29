import type { Metadata } from "next";
import { Container, Section, PageHeader, SectionHead, Eyebrow, Panel, Button } from "@/components/Section";
import { PersonCard, PersonGrid } from "@/components/PersonCard";
import { Picture } from "@/components/Picture";
import { Reveal } from "@/components/Reveal";
import { officeBearers, bearerGroups, site, type BearerGroup, type Person } from "@/lib/content";

export const metadata: Metadata = {
  title: "Office bearers",
  description:
    `The ${officeBearers.term} office bearers of CMIA: president, vice president, secretaries, ` +
    `treasurers, three zone heads and five committee cells.`,
  alternates: { canonical: "/leadership/" },
};

export default function LeadershipPage() {
  const [bearers, zones, cells] = bearerGroups;
  const president = bearers.people.find((p) => p.role === "President")!;
  const others = bearers.people.filter((p) => p.role !== "President");
  const msg = officeBearers.presidentsMessage;

  /** Zone and cell rows, each head paired with its co-chair. */
  const pairs = (group: BearerGroup) => {
    const key: keyof Person = group.id === "zones" ? "zone" : "cell";
    const seen: string[] = [];
    const out: { group: string; head?: Person; co?: Person }[] = [];
    for (const p of group.people) {
      const k = p[key] as string | undefined;
      if (!k || seen.includes(k)) continue;
      seen.push(k);
      const inGroup = group.people.filter((q) => q[key] === k);
      out.push({
        group: k,
        head: inGroup.find((q) => !q.isCoChair),
        co: inGroup.find((q) => q.isCoChair),
      });
    }
    return out;
  };

  return (
    <>
      <PageHeader
        eyebrow={`Term ${officeBearers.term}`}
        title="Who runs the chamber this year."
        lede="Office bearers are elected annually by the general body. Three zones and five cells carry the work between meetings, each with a head and a co-chair."
        figures={[
          { value: String(bearers.people.length), label: "office bearers" },
          { value: "3", label: "zones" },
          { value: "5", label: "cells" },
        ]}
      />

      {/* --------------------------------------------- president + message */}
      <Section tight>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-14">
            <div>
              <PersonCard person={president} size="lead" />
            </div>

            <div id="presidents-message">
              <Eyebrow>President&rsquo;s message</Eyebrow>
              <Panel className="mt-5 p-6 sm:p-8">
                <p className="font-display text-xl font-semibold text-doc-hi">
                  {msg.greeting}
                </p>
                {msg.body.map((p) => (
                  <p key={p.slice(0, 20)} className="measure mt-4 leading-relaxed">
                    {p}
                  </p>
                ))}
                <footer className="mt-6 flex items-center gap-3 border-t border-bone-300 pt-4">
                  <Picture
                    src={msg.photo}
                    alt=""
                    sizes="48px"
                    imgClassName="h-12 w-12 shrink-0 object-cover object-top"
                  />
                  <div>
                    <p className="font-display text-sm font-semibold text-doc-hi">
                      {msg.byName}
                    </p>
                    <p className="text-xs text-doc-lo">{msg.byRole}</p>
                  </div>
                </footer>
              </Panel>
              {msg.isArchived && (
                <p className="mt-3 text-xs leading-relaxed text-text-lo">
                  This is the message published for the {msg.term} term. A message from the
                  current president will replace it.
                </p>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------ office bearers */}
      <Section rule ground="ink-deep">
        <Container>
          <SectionHead eyebrow="Elected" title={bearers.title} lede={bearers.blurb} />
          <div className="mt-10">
            <PersonGrid people={others} />
          </div>
        </Container>
      </Section>

      {/* -------------------------------------------------------- zones & cells */}
      {[zones, cells].map((group) => (
        <Section rule key={group.id}>
          <Container>
            <SectionHead eyebrow="Structure" title={group.title} lede={group.blurb} />

            <ul className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {pairs(group).map((row, i) => (
                <Reveal as="li" key={row.group} delay={i * 70}>
                  <div className="border-t border-brass/30 pt-5">
                    <h3 className="font-display text-[0.72rem] font-semibold tracking-[0.12em] text-brass uppercase">
                      {(row.head?.role ?? row.co?.role ?? "").replace(
                        /^(Zone Head|Head|Co-Chair)\s*—?\s*/,
                        "",
                      )}
                    </h3>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      {row.head && <PersonCard person={row.head} size="compact" />}
                      {row.co && <PersonCard person={row.co} size="compact" />}
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>
      ))}

      {/* ------------------------------------------------------- secretariat */}
      <Section rule tight ground="ink-deep">
        <Container>
          <SectionHead eyebrow="Secretariat" title="Who to contact directly" />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {officeBearers.secretariat.map((s) => (
              <li key={s.name} className="surface gable-cut p-5">
                <p className="font-display text-[0.72rem] font-semibold tracking-[0.12em] text-brass uppercase">
                  {s.name}
                </p>
                <p className="mt-3 text-[1.02rem] font-semibold text-text-hi">{s.contactName}</p>
                <p className="mt-2 text-sm">
                  <a href={`tel:${s.phone}`} className="text-brass-lift hover:text-text-hi">
                    {s.phone}
                  </a>
                </p>
                <p className="mt-1 text-sm">
                  <a
                    href={`mailto:${s.email}`}
                    className="break-all text-brass-lift hover:text-text-hi"
                  >
                    {s.email}
                  </a>
                </p>
              </li>
            ))}
            <li className="surface gable-cut p-5">
              <p className="font-display text-[0.72rem] font-semibold tracking-[0.12em] text-brass uppercase">
                The office
              </p>
              <p className="mt-3 text-[1.02rem] font-semibold text-text-hi">
                {site.address.line1}
              </p>
              <p className="mt-2 text-sm">
                <a
                  href={`tel:${site.contact.phone}`}
                  className="text-brass-lift hover:text-text-hi"
                >
                  {site.contact.phoneDisplay}
                </a>
              </p>
              <p className="mt-1 text-sm text-text-lo">{site.contact.hours}</p>
            </li>
          </ul>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href="/leadership/past-presidents/">Every president since 1982</Button>
            <Button href="/contact/" variant="outline">
              Contact the chamber
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
