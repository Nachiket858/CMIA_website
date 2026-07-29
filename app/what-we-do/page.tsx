import type { Metadata } from "next";
import { Container, Section, PageHeader, SectionHead, Eyebrow, Button } from "@/components/Section";
import { Pictogram, type PictogramName } from "@/components/Pictogram";
import { Picture } from "@/components/Picture";
import { IconCard, CTABar } from "@/components/Cards";
import { Reveal } from "@/components/Reveal";
import { ClusterMap } from "@/components/charts/ClusterMap";
import { services, site, venue } from "@/lib/content";

export const metadata: Metadata = {
  title: "What we do",
  description:
    "CMIA represents industry to government, facilitates investment and clearances, issues Certificates of Origin, promotes exports through Maha Expo, and runs skill and cluster programmes.",
  alternates: { canonical: "/what-we-do/" },
};

export default function WhatWeDoPage() {
  return (
    <>
      <PageHeader
        eyebrow="What we do"
        title="Four kinds of work."
        lede={services.intro}
        figures={[
          { value: String(site.stats.clusters), label: "cluster projects" },
          { value: "4 yrs", label: "Maha Expo cadence" },
          { value: venue.rooms[0].capacity!, label: "seats in the hall" },
        ]}
      />

      {/* --------------------------------------------------- the four strands */}
      {services.strands.map((strand, si) => (
        <Section key={strand.id} id={strand.id} rule={si > 0} ground={si % 2 === 1 ? "ink-deep" : "ink"}>
          <Container>
            {/* Each strand opens with a photograph of the work actually
                happening, so the page is carried by pictures rather than by
                four columns of card text. */}
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-end lg:gap-14">
              <div className={si % 2 === 1 ? "lg:order-2" : ""}>
                <Pictogram
                  name={strand.pictogram as PictogramName}
                  className="h-10 w-10 text-agri"
                />
                <h2 className="mt-5 text-[clamp(1.7rem,5vw,2.8rem)] leading-tight font-semibold">
                  {strand.title}
                </h2>
                <p className="measure mt-3.5 text-[1.06rem] leading-relaxed text-text-mid">
                  {strand.lede}
                </p>
              </div>

              {"photo" in strand && strand.photo && (
                <Reveal className={si % 2 === 1 ? "lg:order-1" : ""}>
                  <figure>
                    <Picture
                      src={strand.photo as string}
                      alt={(strand.photoAlt as string) ?? strand.title}
                      sizes="(max-width: 1024px) 92vw, 620px"
                      imgClassName="aspect-[16/10] w-full border border-ink-500 object-cover"
                    />
                  </figure>
                </Reveal>
              )}
            </div>

            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {strand.items.map((item, i) => (
                <Reveal as="li" key={item.title} delay={i * 70}>
                  <IconCard
                    title={item.title}
                    detail={item.detail}
                    more={"more" in item ? (item.more as string[]) : undefined}
                    pictogram={"pictogram" in item ? item.pictogram : undefined}
                    highlight={"highlight" in item ? Boolean(item.highlight) : false}
                    href={"href" in item ? (item.href as string) : undefined}
                    figure={
                      "figure" in item
                        ? (item.figure as { value: string; label: string })
                        : undefined
                    }
                  />
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>
      ))}

      {/* ------------------------------------------------------- cluster map */}
      <Section rule>
        <Container>
          <SectionHead
            eyebrow="Clusters"
            title="Where the cluster projects are"
            action={{ label: "All seven clusters", href: "/clusters/" }}
          />
          <div className="mt-10">
            <ClusterMap />
          </div>
        </Container>
      </Section>

      {/* --------------------------------------------------------------- CTA */}
      <Section rule tight ground="ink-deep">
        <Container>
          <CTABar
            title="Put the chamber to work for your unit"
            lede="Certificates of Origin, GSP without the trip to Mumbai, representation with government, and the halls at Bajaj Bhavan."
            primary={{ label: "Apply for membership", href: "/membership/apply/" }}
            secondary={{ label: "Benefits and fees", href: "/membership/" }}
          />
        </Container>
      </Section>
    </>
  );
}
