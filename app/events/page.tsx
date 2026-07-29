import type { Metadata } from "next";
import { Container, Section, PageHeader, SectionHead, Eyebrow, Button } from "@/components/Section";
import { EventArchive } from "@/components/EventArchive";
import { Pictogram } from "@/components/Pictogram";
import { events, upcomingEvents, archiveWithPhotos, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Events",
  description:
    `Upcoming CMIA events, and a record of ${events.archive.length} past meetings, conclaves, ` +
    `delegations and community programmes.`,
  alternates: { canonical: "/events/" },
};

/** Event structured data for anything still upcoming. */
function EventJsonLd() {
  const items = upcomingEvents.map((e) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    startDate: e.dateStart,
    endDate: e.dateEnd ?? e.dateStart,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: e.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: site.address.city,
        addressRegion: site.address.state,
        addressCountry: "IN",
      },
    },
    organizer: { "@type": "Organization", name: site.name, url: "https://www.cmia.co.in" },
    description: e.summary,
  }));

  if (items.length === 0) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(items) }}
    />
  );
}

export default function EventsPage() {
  return (
    <>
      <EventJsonLd />

      <PageHeader
        eyebrow="Events"
        title="What's coming, and what the chamber has done."
        lede="Meetings with government, delegations from abroad, sector conclaves, training and community work."
        figures={[
          { value: String(upcomingEvents.length), label: "upcoming" },
          { value: String(events.archive.length), label: "records" },
          { value: String(archiveWithPhotos.length), label: "photographed" },
        ]}
      />

      {/* -------------------------------------------------------- upcoming */}
      <Section tight>
        <Container>
          <SectionHead eyebrow="Upcoming" title="Coming up" />

          {upcomingEvents.length > 0 ? (
            <ul className="mt-8 grid gap-4 lg:grid-cols-2">
              {upcomingEvents.map((e) => (
                <li key={e.id}>
                  <article className="gable-cut group flex h-full flex-col border border-signal/35 bg-ink-900 p-6 shadow-[var(--shadow-md)] transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-signal/60 hover:shadow-[var(--glow-signal)] sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[0.7rem] tracking-[0.12em] text-signal uppercase">
                          {e.openTo === "members" ? "Members" : "Open to all"}
                        </p>
                        <h3 className="mt-2.5 font-display text-[clamp(1.3rem,3.4vw,1.8rem)] leading-tight font-semibold text-text-hi">
                          {e.title}
                        </h3>
                      </div>
                      <Pictogram name="community" className="h-8 w-8 shrink-0 text-signal" />
                    </div>

                    <dl className="mt-6 space-y-3 border-t border-ink-600 pt-5">
                      <div className="flex gap-3">
                        <dt className="w-16 shrink-0 text-[0.72rem] tracking-wide text-text-lo uppercase">
                          When
                        </dt>
                        <dd className="tnum text-[0.97rem] text-text-hi">{e.dateLabel}</dd>
                      </div>
                      <div className="flex gap-3">
                        <dt className="w-16 shrink-0 text-[0.72rem] tracking-wide text-text-lo uppercase">
                          Where
                        </dt>
                        <dd className="text-[0.97rem] text-text-hi">{e.venue}</dd>
                      </div>
                    </dl>

                    <p className="mt-5 text-[0.95rem] leading-relaxed text-text-mid">
                      {e.summary}
                    </p>

                    <div className="mt-6 pt-1">
                      <Button href="/contact/" variant="outline">
                        Ask the office
                      </Button>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-8 border border-ink-600 p-6 text-text-mid">
              Nothing is scheduled at the moment. Members hear about events by email and
              WhatsApp first.
            </p>
          )}
        </Container>
      </Section>

      {/* --------------------------------------------------------- archive */}
      <Section rule ground="ink-deep">
        <Container>
          <SectionHead
            eyebrow="The record"
            title="What the chamber has been doing"
            lede={`${events.archive.length} records, filterable by the kind of work.`}
          />
          <div className="mt-10">
            <EventArchive />
          </div>

          <div className="mt-12 max-w-2xl border-l border-brass/30 pl-5">
            <Eyebrow>About the photographs</Eyebrow>
            <p className="mt-2.5 text-sm leading-relaxed text-text-lo">
              Thirteen event photographs from the 2017-18 tenure were referenced by the old
              site but are no longer on its server. The records are all here; the pictures for
              those are not. If the chamber holds the originals they can be added.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
