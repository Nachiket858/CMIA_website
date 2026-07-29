import type { Metadata } from "next";
import { Container, Section, PageHeader, SectionHead, Eyebrow, Panel, Button } from "@/components/Section";
import { IconCard, CTABar } from "@/components/Cards";
import { Reveal } from "@/components/Reveal";
import { Disclosure } from "@/components/Disclosure";
import { FeeChart, TenureChart } from "@/components/charts/FeeChart";
import { membership, site, rupees } from "@/lib/content";

export const metadata: Metadata = {
  title: "Membership",
  description:
    `CMIA membership from ₹3,000 a year plus a one-time admission fee. Certificates of Origin, ` +
    `GSP issuance locally, representation with government, and the halls at Bajaj Bhavan.`,
  alternates: { canonical: "/membership/" },
};

export default function MembershipPage() {
  const cheapest = Math.min(...membership.classes.map((c) => c.annual));

  return (
    <>
      <PageHeader
        eyebrow="Membership"
        title="What membership gives you, and what it costs."
        lede={`Eight things the chamber does for a member unit. Subscriptions start at ${rupees(cheapest)} a year plus a one-time admission fee.`}
        figures={[
          { value: site.stats.members, label: "member organisations" },
          { value: rupees(cheapest), label: "from, per year" },
          { value: String(membership.classes.length), label: "classes" },
        ]}
      />

      {/* --------------------------------------------------------- benefits */}
      <Section tight>
        <Container>
          <SectionHead
            eyebrow="The benefits"
            title="What a member actually gets"
            lede="Two of these save a trip to Mumbai on their own."
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {membership.benefits.map((b, i) => (
              <Reveal as="li" key={b.id} delay={Math.min(i * 55, 300)}>
                <IconCard
                  title={b.title}
                  detail={b.detail}
                  pictogram={b.pictogram}
                  highlight={"highlight" in b ? Boolean(b.highlight) : false}
                />
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ------------------------------------------------------------- fees */}
      <Section rule ground="ink-deep">
        <Container>
          <SectionHead
            eyebrow="The fees"
            title="Exactly what it costs"
            lede={`Class is set by your UDYAM Aadhaar. ${membership.gstNote}`}
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
            <FeeChart />
            <TenureChart />
          </div>

          <p className="mt-6 text-sm text-text-lo">
            Fee schedule effective {membership.feesEffective}. GST number{" "}
            <span className="tnum text-text-mid">{site.registration.gst}</span>.
          </p>
        </Container>
      </Section>

      {/* -------------------------------------------------------- how to join */}
      <Section rule>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
            <div>
              <Eyebrow>How to join</Eyebrow>
              <h2 className="mt-3 text-[clamp(1.5rem,4vw,2.2rem)] font-semibold">
                Four documents and a proposer
              </h2>
              <p className="measure mt-4 leading-relaxed text-text-mid">
                {membership.approval}
              </p>

              <ol className="mt-8 space-y-5">
                {[
                  {
                    t: "Fill in the form",
                    d: "Your organisation, your representatives, what you make, and whether you export.",
                  },
                  {
                    t: "Attach the four documents",
                    d: membership.documents.join(" · "),
                  },
                  {
                    t: "Pay the fee",
                    d: `By ${membership.paymentModes.join(", ").toLowerCase()}. Bank details are on the apply page.`,
                  },
                  {
                    t: "The Executive Committee considers it",
                    d: "Proposed and seconded by existing members.",
                  },
                ].map((step, i) => (
                  <li key={step.t} className="flex gap-4">
                    {/* A genuine sequence, so it is genuinely numbered. */}
                    <span className="tnum mt-0.5 shrink-0 font-display text-sm font-semibold text-brass">
                      {i + 1}
                    </span>
                    <div className="border-l border-ink-600 pl-4">
                      <p className="font-display text-[1.02rem] font-semibold text-text-hi">
                        {step.t}
                      </p>
                      <p className="mt-1.5 text-[0.92rem] leading-relaxed text-text-mid">
                        {step.d}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="/membership/apply/">Apply for membership</Button>
                <Button href={membership.formPdfSource} variant="outline" external>
                  Download the form (PDF)
                </Button>
              </div>
            </div>

            <div>
              <Panel className="px-6 py-2">
                <Disclosure
                  tone="bone"
                  summary="Which class am I?"
                  meta="Set by your UDYAM Aadhaar"
                  defaultOpen
                >
                  <ul className="space-y-3">
                    {membership.classes.map((c) => (
                      <li key={c.id} className="flex flex-col gap-0.5">
                        <span className="font-semibold text-doc-hi">{c.name}</span>
                        <span className="text-sm text-doc-lo">{c.for}</span>
                        <span className="tnum text-sm">
                          {rupees(c.annual)} a year + {rupees(c.admission)} once
                        </span>
                      </li>
                    ))}
                  </ul>
                </Disclosure>

                <Disclosure tone="bone" summary="Longer terms" meta="5 years, 10 years, or life">
                  <ul className="space-y-2.5">
                    {membership.tenures.slice(1).map((t) => (
                      <li key={t.id}>
                        <span className="font-semibold text-doc-hi">{t.name}</span> —{" "}
                        {t.description}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-doc-lo">
                    {membership.tenures[1]._note}
                  </p>
                </Disclosure>

                <Disclosure tone="bone" summary="Who represents your organisation">
                  <p>{membership.formFields.representatives}</p>
                  <p>
                    The form also records the name of your HR contact, your GST and PAN
                    numbers, and {membership.formFields.exportQuestion.toLowerCase()}
                  </p>
                </Disclosure>

                <Disclosure tone="bone" summary="A superseded option">
                  {membership.supersededOptions.map((o) => (
                    <p key={o.name}>
                      <span className="font-semibold text-doc-hi">{o.name}</span> — {o.detail}{" "}
                      <span className="text-doc-lo">({o.source})</span>
                    </p>
                  ))}
                </Disclosure>
              </Panel>
            </div>
          </div>
        </Container>
      </Section>

      {/* --------------------------------------------------------------- CTA */}
      <Section rule tight ground="ink-deep">
        <Container>
          <CTABar
            title="Apply for membership"
            lede={`${site.stats.members} organisations are already members. Applications are considered at the Executive Committee.`}
            primary={{ label: "Apply for membership", href: "/membership/apply/" }}
            secondary={{ label: "Talk to the office first", href: "/contact/" }}
          />
        </Container>
      </Section>
    </>
  );
}
