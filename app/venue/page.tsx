import type { Metadata } from "next";
import { Container, Section, PageHeader, SectionHead, Eyebrow, Panel, Button } from "@/components/Section";
import { Picture, hasImage } from "@/components/Picture";
import { Pictogram } from "@/components/Pictogram";
import { Reveal } from "@/components/Reveal";
import { venue, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Venue & halls",
  description:
    `Bajaj Bhavan at Railway Station MIDC — a seminar hall seating ${venue.rooms[0].capacity}, a function hall, ` +
    `board room and meeting rooms available to CMIA members.`,
  alternates: { canonical: "/venue/" },
};

export default function VenuePage() {
  const hall = venue.rooms[0];

  return (
    <>
      <PageHeader
        eyebrow="Venue"
        title={venue.building.name}
        lede={venue.building.summary}
        figures={[
          { value: hall.capacity!, label: "seats in the seminar hall" },
          { value: String(venue.rooms.length), label: "rooms" },
        ]}
      />

      {/* -------------------------------------------------------- the hall */}
      <Section tight>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14">
            <Reveal>
              <figure>
                <Picture
                  src={hall.photo!}
                  alt="The CMIA seminar hall, set up with seating facing the stage"
                  sizes="(max-width: 1024px) 92vw, 620px"
                  priority
                  imgClassName="aspect-[4/3] w-full border border-ink-500 object-cover"
                />
              </figure>
            </Reveal>

            <div>
              <Eyebrow>The seminar hall</Eyebrow>
              <p className="mt-4 flex items-baseline gap-3">
                <span className="tnum font-display text-[clamp(2.4rem,7vw,3.8rem)] leading-none font-semibold text-agri-lift">
                  {hall.capacity}
                </span>
                <span className="text-sm tracking-wide text-text-lo uppercase">
                  {hall.capacityLabel}
                </span>
              </p>
              <p className="measure mt-5 leading-relaxed text-text-mid">{hall.summary}</p>

              <ul className="mt-7 space-y-3 border-t border-ink-600 pt-6">
                {hall.facilities.map((f) => (
                  <li key={f} className="flex gap-3.5">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-agri" />
                    <span className="text-[0.95rem] leading-relaxed text-text-mid">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button href="#book">Enquire about booking</Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------- other rooms */}
      <Section rule ground="ink-deep">
        <Container>
          <SectionHead eyebrow="The rooms" title="What else is available" />

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {venue.rooms.slice(1).map((r, i) => (
              <Reveal as="li" key={r.id} delay={i * 70}>
                <article className="surface surface-hover gable-cut group flex h-full flex-col overflow-hidden">
                  {hasImage(r.photo) ? (
                    <Picture
                      src={r.photo!}
                      alt={`${r.name} at Bajaj Bhavan`}
                      sizes="(max-width: 640px) 92vw, 300px"
                      imgClassName="aspect-[4/3] w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center bg-ink-600">
                      <Pictogram name="hall" className="h-9 w-9 text-clay" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-[1.02rem] font-semibold text-text-hi">
                      {r.name}
                    </h3>
                    <p className="mt-2 text-[0.9rem] leading-relaxed text-text-mid">
                      {r.summary}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>

          {/* Office facilities */}
          <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-14">
            <div>
              <Eyebrow>The secretariat</Eyebrow>
              <h2 className="mt-3 text-[clamp(1.4rem,3.6vw,2rem)] font-semibold">
                Staff, and the things an office needs
              </h2>
              <p className="mt-4 leading-relaxed text-text-mid">
                {venue.officeFacilities.summary}
              </p>
              <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
                {venue.officeFacilities.items.map((f) => (
                  <li key={f} className="text-[0.95rem] text-text-mid">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <Reveal>
              <Picture
                src={venue.officeFacilities.photo}
                alt="The CMIA office at Bajaj Bhavan"
                sizes="(max-width: 1024px) 92vw, 580px"
                imgClassName="aspect-[16/9] w-full border border-ink-500 object-cover"
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* --------------------------------------------------------- booking */}
      <Section rule id="book">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
            <div>
              <Eyebrow>Booking</Eyebrow>
              <h2 className="mt-3 text-[clamp(1.5rem,4vw,2.2rem)] font-semibold">
                Booking goes through the office
              </h2>
              <Panel className="mt-6 p-6">
                <p className="text-[1.02rem] leading-relaxed">{venue.booking.note}</p>
                <dl className="mt-6 space-y-3 border-t border-bone-300 pt-5 text-sm">
                  <div>
                    <dt className="text-[0.72rem] tracking-[0.08em] text-doc-lo uppercase">
                      Call
                    </dt>
                    <dd className="tnum mt-0.5">
                      <a href={`tel:${site.contact.phone}`} className="font-semibold text-doc-hi">
                        {site.contact.phoneDisplay}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.72rem] tracking-[0.08em] text-doc-lo uppercase">
                      Email
                    </dt>
                    <dd className="mt-0.5">
                      <a
                        href={`mailto:${site.contact.emails[1].address}?subject=Hall booking enquiry`}
                        className="font-semibold break-all text-doc-hi"
                      >
                        {site.contact.emails[1].address}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.72rem] tracking-[0.08em] text-doc-lo uppercase">
                      Open
                    </dt>
                    <dd className="mt-0.5">{site.contact.hours}</dd>
                  </div>
                </dl>
              </Panel>
              <div className="mt-6">
                <Button href="/contact/" variant="outline">
                  Send an enquiry instead
                </Button>
              </div>
            </div>

            <div>
              <Eyebrow>Bajaj Bhavan</Eyebrow>
              <ul className="mt-5 grid grid-cols-2 gap-2 sm:gap-3">
                {venue.gallery.slice(0, 6).map((g) => (
                  <li key={g}>
                    <Picture
                      src={g}
                      alt="Bajaj Bhavan"
                      sizes="(max-width: 640px) 46vw, 260px"
                      imgClassName="aspect-square w-full border border-ink-600 object-cover"
                    />
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm">
                <a
                  href="/gallery/"
                  className="border-b border-agri/40 pb-0.5 text-agri-lift hover:border-agri hover:text-text-hi"
                >
                  All photographs of the building
                </a>
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
