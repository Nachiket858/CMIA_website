import type { Metadata } from "next";
import { Container, Section, PageHeader, SectionHead, Eyebrow, Button } from "@/components/Section";
import { Pictogram, type PictogramName } from "@/components/Pictogram";
import { news, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "News & circulars",
  description:
    "Circulars to CMIA members, press coverage, and the chamber's publications including the membership form and annual magazine.",
  alternates: { canonical: "/news/" },
};

export default function NewsPage() {
  return (
    <>
      <PageHeader
        eyebrow="News & circulars"
        title="Notices, coverage and publications."
        lede="Government notifications reach members every month by email and WhatsApp. Anything published for the public sits here."
      />

      <Section tight>
        <Container>
          <div className="space-y-14">
            {news.types.map((type) => {
              const items = news.items.filter((i) => i.type === type.id);
              return (
                <section key={type.id} id={type.id}>
                  <div className="flex items-start gap-4 border-b border-agri/30 pb-4">
                    <Pictogram
                      name={type.pictogram as PictogramName}
                      className="mt-0.5 h-7 w-7 shrink-0 text-agri"
                    />
                    <div className="flex-1">
                      <h2 className="font-display text-[1.35rem] font-semibold text-text-hi">
                        {type.label}
                      </h2>
                      <p className="mt-1 text-sm text-text-mid">{type.blurb}</p>
                    </div>
                    <p className="tnum shrink-0 text-sm text-text-lo">{items.length}</p>
                  </div>

                  {items.length > 0 ? (
                    <ul className="divide-y divide-ink-700">
                      {items.map((item) => {
                        const unavailable = "unavailable" in item && item.unavailable;
                        const href = item.file as string | null;
                        const external = "external" in item && item.external;

                        return (
                          <li key={item.id} className="py-4">
                            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                              <div className="min-w-0 flex-1">
                                <h3 className="text-[1.02rem] leading-snug font-medium text-text-hi">
                                  {item.title}
                                </h3>
                                {"summary" in item && item.summary && (
                                  <p className="mt-1.5 text-[0.92rem] leading-relaxed text-text-mid">
                                    {item.summary}
                                  </p>
                                )}
                              </div>

                              <div className="shrink-0">
                                {unavailable || !href ? (
                                  <span className="text-sm text-text-lo">
                                    Ask the office for a copy
                                  </span>
                                ) : (
                                  <a
                                    href={href}
                                    target={external ? "_blank" : undefined}
                                    rel={external ? "noopener noreferrer" : undefined}
                                    className="inline-flex items-center gap-2 border border-agri/40 px-4 py-2.5 text-sm font-medium text-agri-lift transition-colors hover:border-agri hover:text-text-hi"
                                  >
                                    Download {external && <span aria-hidden="true">↗</span>}
                                  </a>
                                )}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="mt-5 border border-ink-600 bg-ink-700/30 p-5 text-[0.95rem] leading-relaxed text-text-mid">
                      {type.emptyMessage}
                    </p>
                  )}
                </section>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* -------------------------------------------------------- how to get it */}
      <Section rule ground="ink-deep" tight>
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <Eyebrow>How members hear things</Eyebrow>
              <h2 className="mt-3 text-[clamp(1.4rem,3.6vw,2rem)] font-semibold">
                Notifications go out monthly, by email and WhatsApp
              </h2>
              <p className="measure mt-4 leading-relaxed text-text-mid">
                Copies of government notifications affecting a member&rsquo;s industry are
                circulated every month. Representatives named on the application form are added
                to the chamber&rsquo;s WhatsApp group.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button href="/membership/apply/">Apply for membership</Button>
                <Button href="/contact/" variant="outline">
                  Ask the office
                </Button>
              </div>
            </div>

            <div>
              <Eyebrow>Follow the chamber</Eyebrow>
              <ul className="mt-5 divide-y divide-ink-600 border-y border-ink-600">
                {site.social.map((s) => (
                  <li key={s.network}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-baseline justify-between gap-3 py-3.5 transition-colors hover:text-text-hi"
                    >
                      <span className="text-[0.97rem] text-text-mid">{s.network}</span>
                      <span className="text-sm text-text-lo">
                        {"handle" in s ? s.handle : ""} <span aria-hidden="true">↗</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-text-lo">
                The chamber&rsquo;s activity is covered regularly in the regional press.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
