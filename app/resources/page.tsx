import type { Metadata } from "next";
import { Container, Section, PageHeader, SectionHead, Eyebrow } from "@/components/Section";
import { resources, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Links industry in Marathwada needs: Maharashtra government and MIDC, peer chambers, central ministries, revenue and regulators, and export support agencies.",
  alternates: { canonical: "/resources/" },
};

export default function ResourcesPage() {
  const total = resources.groups.reduce((n, g) => n + g.links.length, 0);

  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="The links industry actually needs."
        lede="Government departments, peer chambers, revenue and regulators, and the agencies behind exports and small industry."
        figures={[{ value: String(total), label: "links" }, { value: String(resources.groups.length), label: "groups" }]}
      />

      <Section tight>
        <Container>
          <div className="space-y-14">
            {resources.groups.map((group) => (
              <section key={group.id} id={group.id}>
                <div className="border-b border-brass/30 pb-3">
                  <h2 className="font-display text-[1.35rem] font-semibold text-text-hi">
                    {group.title}
                  </h2>
                  <p className="mt-1 text-sm text-text-mid">{group.blurb}</p>
                </div>

                <ul className="grid sm:grid-cols-2 sm:gap-x-8">
                  {group.links.map((l) => (
                    <li key={l.url + l.label} className="border-b border-ink-700">
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start justify-between gap-3 py-3.5 transition-colors hover:bg-ink-700/40"
                      >
                        <span className="min-w-0">
                          <span className="block text-[0.97rem] leading-snug text-text-hi">
                            {l.label}
                            {"affiliated" in l && l.affiliated && (
                              <span className="ml-2 align-middle bg-brass px-1.5 py-0.5 text-[0.58rem] font-semibold tracking-[0.08em] text-ink-900 uppercase">
                                affiliated
                              </span>
                            )}
                          </span>
                          {"sublabel" in l && l.sublabel && (
                            <span className="mt-0.5 block text-xs text-text-lo">
                              {l.sublabel}
                            </span>
                          )}
                        </span>
                        <span aria-hidden="true" className="shrink-0 pt-0.5 text-brass">
                          ↗
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </Container>
      </Section>

      {/* --------------------------------------------------------- housekeeping */}
      <Section rule tight ground="ink-deep">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>What was tidied up</Eyebrow>
            <p className="mt-4 leading-relaxed text-text-mid">
              The old Important Links page had a few entries that went nowhere or went
              somewhere other than their label suggested. Those are recorded here rather than
              silently dropped.
            </p>
            <ul className="mt-6 space-y-4 border-t border-ink-600 pt-6">
              {resources._removed.map((r) => (
                <li key={r.label}>
                  <p className="text-[0.97rem] font-medium text-text-hi">{r.label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-text-lo">{r.reason}</p>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-text-lo">
              Spotted a broken link? Tell the office at{" "}
              <a
                href={`mailto:${site.contact.emails[1].address}`}
                className="text-brass-lift underline"
              >
                {site.contact.emails[1].address}
              </a>
              .
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
