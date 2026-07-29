import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section, SectionHead, Eyebrow, Button } from "@/components/Section";
import { Hero } from "@/components/Hero";
import { Picture } from "@/components/Picture";
import { MemberLogos } from "@/components/MemberLogos";
import { IconCard, PhotoRecord, CTABar } from "@/components/Cards";
import { PersonCard } from "@/components/PersonCard";
import { Reveal } from "@/components/Reveal";
import {
  site,
  clusters,
  events,
  members,
  officeBearers,
  archiveWithPhotos,
} from "@/lib/content";

export const metadata: Metadata = {
  title: `${site.shortName} — ${site.name}`,
  description:
    `The voice of Marathwada industry since ${site.foundedYear}. ${site.stats.members} member ` +
    `organisations, ${site.stats.clusters} cluster projects, and ${site.stats.presidentialTerms} ` +
    `terms of elected leadership.`,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const president = officeBearers.groups[0].people.find((p) => p.role === "President")!;
  const upcoming = events.upcoming[0];
  const photoStrip = archiveWithPhotos.slice(0, 3);

  return (
    <>
      <Hero />

      {/* ------------------------------------------------------- the focus */}
      <Section rule tight>
        <Container>
          <SectionHead
            eyebrow="This year"
            title="Four things the chamber is pushing on"
            action={{ label: "All our work", href: "/what-we-do/" }}
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {site.focus.map((f, i) => (
              <Reveal as="li" key={f.title} delay={i * 70}>
                <IconCard title={f.title} detail={f.detail} pictogram={f.pictogram} />
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ------------------------------------------- investments at AURIC */}
      <Section rule ground="ink-deep">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16">
            <div>
              <Eyebrow>Facilitated by the chamber</Eyebrow>
              <h2 className="mt-3 text-[clamp(1.6rem,4.4vw,2.5rem)] font-semibold">
                Toyota Kirloskar Motors and Ather Energy came to AURIC.
              </h2>
              <p className="measure mt-4 leading-relaxed text-text-mid">
                From first enquiry to signed agreement, the chamber works as the facilitating
                agency for investors looking at this region — and as the catalyst when an
                existing unit needs a way through.
              </p>
              <ul className="mt-7 space-y-3">
                {members.investmentsFacilitated.map((inv) => (
                  <li key={inv.name} className="flex items-baseline gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 bg-signal"
                    />
                    <span>
                      <span className="font-display font-semibold text-text-hi">
                        {inv.name}
                      </span>
                      <span className="text-text-lo"> at {inv.at}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/what-we-do/"
                prefetch={false}
                className="mt-7 inline-flex items-center gap-2 border-b border-brass/40 pb-1 text-sm font-medium text-brass-lift hover:border-brass hover:text-text-hi"
              >
                How the chamber facilitates <span aria-hidden="true">→</span>
              </Link>
            </div>

            <Reveal>
              <figure>
                <Picture
                  src="events/mou-gom-toyota-kirloskar"
                  alt="Officials of the Government of Maharashtra and Toyota Kirloskar Motors signing a memorandum of understanding, with CMIA representatives present"
                  sizes="(max-width: 1024px) 92vw, 620px"
                  imgClassName="w-full border border-ink-500"
                />
                <figcaption className="mt-3 text-sm text-text-lo">
                  MOU signing between the Government of Maharashtra and Toyota Kirloskar
                  Motors, with CMIA present.
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* --------------------------------------------------------- clusters */}
      <Section rule>
        <Container>
          <SectionHead
            eyebrow="Clusters"
            title="Machinery a single small unit could never buy alone"
            lede="Seven Common Facility Centre projects, from precision machining in Chikalthana to Paithani looms in Paithan and truck body building in Madalmohi."
            action={{ label: "All seven clusters", href: "/clusters/" }}
          />

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {clusters.clusters.slice(0, 4).map((c, i) => (
              <Reveal as="li" key={c.id} delay={i * 70}>
                <PhotoRecord
                  title={c.shortName}
                  meta={c.district}
                  detail={c.summary}
                  photo={c.photo}
                  href={`/clusters/#${c.id}`}
                />
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/*
        Removed: a second four-up icon grid headed "What a member actually gets",
        listing the same four strands with three sub-items each.

        It sat two screens below "Four things the chamber is pushing on" — the
        same shape, the same rhythm, and the least visual block on the page. It
        also duplicated /what-we-do, which is one click away and now carries a
        photograph for each strand. The clusters section above already shows what
        the chamber does, with pictures. One four-up grid on a page is a pattern;
        two is a template.
      */}

      {/* ------------------------------------------------ events + leadership */}
      <Section rule>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <SectionHead
                eyebrow="Events"
                title="Coming up, and what came before"
                action={{ label: "All events", href: "/events/" }}
              />

              {upcoming && (
                <Link
                  href="/events/"
                  className="gable-cut group mt-8 block border border-signal/35 bg-ink-700 p-5 shadow-[var(--shadow-sm)] transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-signal/60 hover:shadow-[var(--glow-signal)]"
                >
                  <p className="text-[0.7rem] tracking-[0.12em] text-signal uppercase">
                    Upcoming
                  </p>
                  <h3 className="mt-2 font-display text-xl font-semibold text-text-hi">
                    {upcoming.title}
                  </h3>
                  <p className="mt-2 text-sm text-text-mid">
                    {upcoming.dateLabel} · {upcoming.venue}
                  </p>
                </Link>
              )}

              <ul className="mt-6 grid gap-4 sm:grid-cols-3">
                {photoStrip.map((a, i) => (
                  <Reveal as="li" key={a.id} delay={i * 70}>
                    <PhotoRecord
                      title={a.title}
                      photo={a.photo}
                      ratio="1/1"
                      href="/events/"
                    />
                  </Reveal>
                ))}
              </ul>
              <p className="mt-4 text-sm text-text-lo">
                {archiveWithPhotos.length} photographed records, and{" "}
                {events.archive.length} in total.
              </p>
            </div>

            <div>
              <SectionHead
                eyebrow={`Term ${officeBearers.term}`}
                title="Who leads it"
                action={{ label: "The whole team", href: "/leadership/" }}
              />
              <div className="mt-8 max-w-[300px]">
                <PersonCard person={president} size="lead" />
              </div>
              <p className="mt-5 text-sm leading-relaxed text-text-mid">
                Elected annually by the general body, with {site.stats.presidentialTerms} terms
                on record since 1982.
              </p>
              <Link
                href="/leadership/past-presidents/"
                prefetch={false}
                className="mt-4 inline-flex items-center gap-2 border-b border-brass/40 pb-1 text-sm font-medium text-brass-lift hover:border-brass hover:text-text-hi"
              >
                Every president since 1982 <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------- member logos */}
      <Section rule ground="ink-deep" tight>
        <Container>
          <Eyebrow>{members.heading}</Eyebrow>
          <div className="mt-8">
            <MemberLogos limit={12} />
          </div>
        </Container>
      </Section>

      {/* --------------------------------------------------------------- CTA */}
      <Section rule>
        <Container>
          <CTABar
            title="Join the chamber"
            lede={`Membership starts at ₹3,000 a year plus a one-time admission fee. Applications are considered at the Executive Committee.`}
            primary={{ label: "Apply for membership", href: "/membership/apply/" }}
            secondary={{ label: "Benefits and fees", href: "/membership/" }}
          />
        </Container>
      </Section>
    </>
  );
}
