import type { Metadata } from "next";
import { Container, Section, PageHeader, SectionHead, Eyebrow } from "@/components/Section";
import { SuccessionRidge, SecretaryPipeline } from "@/components/charts/LeadershipChart";
import { Reveal } from "@/components/Reveal";
import { terms, timeline, termStartYear, pastPresidents } from "@/lib/content";

export const metadata: Metadata = {
  title: "Past presidents",
  description:
    "Forty-four presidential terms of CMIA, MIA and ADIA from 1982-83 to today, with the honorary secretary for each year.",
  alternates: { canonical: "/leadership/past-presidents/" },
};

export default function PastPresidentsPage() {
  const eras = timeline.eras;

  const eraOf = (year: number) => {
    for (let i = eras.length - 1; i >= 0; i--) if (year >= eras[i].from) return eras[i];
    return eras[0];
  };

  // Group the terms under the name the organisation carried at the time.
  const grouped = eras
    .slice()
    .reverse()
    .map((era) => ({
      era,
      terms: terms.filter((t) => eraOf(termStartYear(t.year)).id === era.id),
    }))
    .filter((g) => g.terms.length > 0);

  const flagged = terms.filter((t) => t.flag);

  return (
    <>
      <PageHeader
        eyebrow="Leadership"
        title="Forty-four terms, and the people who served them."
        lede="Every president on record since 1982-83, with the honorary secretary who served alongside — grouped under the name the organisation carried at the time."
        figures={[
          { value: "44", label: "terms" },
          { value: "1982", label: "earliest on record" },
          { value: "3", label: "eras" },
        ]}
      />

      {/* -------------------------------------------------------- the ridge */}
      <Section tight>
        <Container>
          <SuccessionRidge />
        </Container>
      </Section>

      {/* --------------------------------------------------- the pipeline */}
      <Section rule tight ground="ink-deep">
        <Container>
          <SectionHead
            eyebrow="A pattern in the record"
            title="How people reach the chair"
            lede="The chamber's own table shows a route: serve as honorary secretary, then lead. This is derived from those rows, not added to them."
          />
          <div className="mt-10 max-w-3xl">
            <SecretaryPipeline />
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------- the roll */}
      <Section rule>
        <Container>
          <SectionHead
            eyebrow="The roll"
            title="Every term on record"
            lede="Newest first within each era."
          />

          <div className="mt-12 space-y-14">
            {grouped.map((g) => (
              <section key={g.era.id}>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-brass/30 pb-3">
                  <h3 className="font-display text-[1.3rem] font-semibold text-text-hi">
                    {g.era.abbr}
                  </h3>
                  <p className="text-sm text-text-mid">{g.era.name}</p>
                  <p className="tnum ml-auto text-sm text-text-lo">
                    {g.terms.length} {g.terms.length === 1 ? "term" : "terms"}
                  </p>
                </div>

                {/* A list of rows rather than a table: at 360px a three-column
                    table would either scroll sideways or crush the names, and
                    these names are long. */}
                <ul className="mt-1">
                  {g.terms.map((t, i) => (
                    <Reveal as="li" key={t.year} delay={Math.min(i * 25, 200)}>
                      <div
                        className={`grid grid-cols-[4.6rem_minmax(0,1fr)] items-baseline gap-x-4 border-b border-ink-700 py-3.5 sm:grid-cols-[5.5rem_minmax(0,1.1fr)_minmax(0,1fr)] ${
                          t.current ? "bg-signal/5" : ""
                        }`}
                      >
                        <p
                          className={`tnum font-display text-sm font-semibold ${
                            t.current ? "text-signal" : "text-brass"
                          }`}
                        >
                          {t.year}
                        </p>

                        <div className="min-w-0">
                          <p className="text-[1.02rem] leading-snug font-medium text-text-hi">
                            {t.president}
                          </p>
                          {t.current && (
                            <p className="mt-0.5 text-[0.7rem] tracking-wide text-signal uppercase">
                              Current president
                            </p>
                          )}
                          <p className="mt-1 text-sm text-text-lo sm:hidden">
                            Hon. Secretary · {t.secretary}
                          </p>
                        </div>

                        <div className="col-start-2 hidden min-w-0 sm:col-start-3 sm:block">
                          <p className="text-[0.7rem] tracking-wide text-text-lo uppercase">
                            Hon. Secretary
                          </p>
                          <p className="mt-0.5 text-[0.95rem] leading-snug text-text-mid">
                            {t.secretary}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </Container>
      </Section>

      {/* -------------------------------------------------- notes on the data */}
      <Section rule tight ground="ink-deep">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>Notes on this record</Eyebrow>
            <p className="mt-4 leading-relaxed text-text-mid">
              These rows are reproduced as the chamber published them. A few need a second
              look, and are flagged rather than quietly corrected.
            </p>

            <ul className="mt-6 space-y-4 border-t border-ink-600 pt-6">
              {flagged.map((t) => (
                <li key={t.year} className="flex gap-4">
                  <span className="tnum shrink-0 font-display text-sm font-semibold text-brass">
                    {t.year}
                  </span>
                  <span className="text-sm leading-relaxed text-text-mid">{t.flag}</span>
                </li>
              ))}
              {pastPresidents._dataFlags.slice(2).map((f) => (
                <li key={f.slice(0, 24)} className="flex gap-4">
                  <span className="shrink-0 font-display text-sm font-semibold text-brass">
                    Spelling
                  </span>
                  <span className="text-sm leading-relaxed text-text-mid">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>
    </>
  );
}
