import type { Metadata } from "next";
import { Container, Section, PageHeader, SectionHead, Eyebrow } from "@/components/Section";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Picture } from "@/components/Picture";
import { site, fullAddress, officeBearers } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    `CMIA at Bajaj Bhavan, Railway Station MIDC, Chhatrapati Sambhajinagar 431005. ` +
    `Phone ${site.contact.phoneDisplay}, open ${site.contact.hours}.`,
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  const { address, contact } = site;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${
    contact.geo.lng - 0.008
  }%2C${contact.geo.lat - 0.005}%2C${contact.geo.lng + 0.008}%2C${
    contact.geo.lat + 0.005
  }&layer=mapnik&marker=${contact.geo.lat}%2C${contact.geo.lng}`;

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Come to Bajaj Bhavan, or write."
        lede={`The office is open ${contact.hours}. For anything urgent, the phone is faster than email.`}
      />

      <Section tight>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-16">
            {/* Details */}
            <div>
              <Eyebrow>The office</Eyebrow>
              <address className="mt-4 text-[1.06rem] leading-relaxed text-text-hi not-italic">
                {address.line1}
                <br />
                {address.line2}
                <br />
                {address.line3}
                <br />
                {address.city} {address.pincode}
                <br />
                {address.state}, {address.country}
              </address>

              <dl className="mt-8 space-y-5 border-t border-ink-600 pt-7">
                <div>
                  <dt className="text-[0.72rem] tracking-[0.1em] text-agri uppercase">Phone</dt>
                  <dd className="tnum mt-1.5 text-[1.15rem]">
                    <a
                      href={`tel:${contact.phone}`}
                      className="font-semibold text-agri-lift hover:text-text-hi"
                    >
                      {contact.phoneDisplay}
                    </a>
                  </dd>
                </div>

                {contact.emails.map((e) => (
                  <div key={e.address}>
                    <dt className="text-[0.72rem] tracking-[0.1em] text-agri uppercase">
                      {e.label}
                    </dt>
                    <dd className="mt-1.5">
                      <a
                        href={`mailto:${e.address}`}
                        className="break-all text-agri-lift hover:text-text-hi"
                      >
                        {e.address}
                      </a>
                    </dd>
                  </div>
                ))}

                <div>
                  <dt className="text-[0.72rem] tracking-[0.1em] text-agri uppercase">Open</dt>
                  <dd className="mt-1.5 text-text-hi">{contact.hours}</dd>
                </div>
              </dl>

              {/* Direct route for the Skill Hub, so students do not have to
                  go through the general office. */}
              <div className="mt-9 border-t border-ink-600 pt-7">
                <Eyebrow>Skill Hub, directly</Eyebrow>
                {officeBearers.secretariat.map((s) => (
                  <div key={s.name} className="mt-3.5">
                    <p className="text-[1.02rem] font-semibold text-text-hi">{s.contactName}</p>
                    <p className="mt-1.5 text-sm">
                      <a href={`tel:${s.phone}`} className="text-agri-lift hover:text-text-hi">
                        {s.phone}
                      </a>
                    </p>
                    <p className="mt-1 text-sm">
                      <a
                        href={`mailto:${s.email}`}
                        className="break-all text-agri-lift hover:text-text-hi"
                      >
                        {s.email}
                      </a>
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-9 border-t border-ink-600 pt-7">
                <Eyebrow>Follow</Eyebrow>
                <ul className="mt-3.5 flex flex-wrap gap-x-5 gap-y-2">
                  {site.social.map((s) => (
                    <li key={s.network}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-text-mid hover:text-agri-lift"
                      >
                        {s.network} <span aria-hidden="true">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Form */}
            <div>
              <Eyebrow>Send a message</Eyebrow>
              <div className="mt-5">
                <EnquiryForm />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------------- map */}
      <Section rule ground="ink-deep">
        <Container>
          <SectionHead
            eyebrow="Getting here"
            title="Railway Station MIDC"
            lede="On Shri Madhur Bajaj Marg, in the MIDC area by the railway station."
            action={{
              label: "Open in Google Maps",
              href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                site.contact.mapQuery,
              )}`,
            }}
          />

          <div className="mt-9 border border-ink-500">
            <iframe
              src={mapSrc}
              title={`Map showing ${site.name} at ${fullAddress}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-[320px] w-full sm:h-[420px]"
            />
          </div>

          <p className="mt-3 text-xs text-text-lo">
            Map data © OpenStreetMap contributors. The marker shows the MIDC Railway Station
            area; ask the office if you need directions to the door.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["venue/bajaj-bhavan-front", "venue/bajaj-bhavan-side", "venue/conference-hall", "venue/office"].map(
              (img) => (
                <Picture
                  key={img}
                  src={img}
                  alt="Bajaj Bhavan, the CMIA building"
                  sizes="(max-width: 640px) 92vw, 300px"
                  imgClassName="aspect-[4/3] w-full border border-ink-600 object-cover"
                />
              ),
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
