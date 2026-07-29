import type { Metadata } from "next";
import { Container, Section, PageHeader, Eyebrow, Panel, Button } from "@/components/Section";
import { ApplyForm } from "@/components/ApplyForm";
import { Pictogram } from "@/components/Pictogram";
import { membership, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Apply for membership",
  description:
    "Apply to join the Chamber of Marathwada Industries and Agriculture. Send an enquiry, or download the application form with the fee schedule and bank details.",
  alternates: { canonical: "/membership/apply/" },
};

export default function ApplyPage() {
  const bank = site.bank;

  return (
    <>
      <PageHeader
        eyebrow="Membership"
        title="Apply for membership"
        lede="Send the office an enquiry and it will come back to you, or download the form and take it in with the documents."
      />

      <Section tight>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-14">
            {/* The form */}
            <div>
              <ApplyForm />
            </div>

            {/* Everything the applicant needs alongside it */}
            <aside className="space-y-8">
              <Panel className="p-6">
                <h2 className="font-display text-[0.7rem] font-semibold tracking-[0.14em] text-signal-deep uppercase">
                  Documents to bring
                </h2>
                <ul className="mt-4 space-y-3">
                  {membership.documents.map((d, i) => (
                    <li key={d} className="flex gap-3">
                      <span className="tnum shrink-0 font-display text-sm font-semibold text-signal-deep">
                        {i + 1}
                      </span>
                      <span className="text-[0.95rem] leading-relaxed">{d}</span>
                    </li>
                  ))}
                </ul>
              </Panel>

              <div className="surface gable-cut p-6">
                <div className="flex items-center gap-3">
                  <Pictogram name="publication" className="h-6 w-6 text-agri" />
                  <h2 className="font-display text-[0.7rem] font-semibold tracking-[0.14em] text-agri uppercase">
                    The form itself
                  </h2>
                </div>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-text-mid">
                  The official application form for {membership.feesEffective}, with the fee
                  schedule, document checklist and bank details.
                </p>
                <div className="mt-5">
                  <Button href={membership.formPdfSource} variant="outline" external>
                    Download the form (PDF)
                  </Button>
                </div>
              </div>

              <div className="surface gable-cut p-6">
                <h2 className="font-display text-[0.7rem] font-semibold tracking-[0.14em] text-agri uppercase">
                  Paying the fee
                </h2>
                <p className="mt-3 text-sm text-text-mid">
                  By {membership.paymentModes.join(", ").toLowerCase()}.
                </p>
                <dl className="mt-4 space-y-2.5 border-t border-ink-600 pt-4 text-sm">
                  {[
                    { k: "Bank", v: bank.name },
                    { k: "Branch", v: bank.branch },
                    { k: "Beneficiary", v: bank.beneficiary },
                    { k: "Account", v: bank.accountNumber },
                    { k: "IFSC", v: bank.ifsc },
                  ].map((r) => (
                    <div key={r.k}>
                      <dt className="text-[0.72rem] tracking-[0.08em] text-text-lo uppercase">
                        {r.k}
                      </dt>
                      <dd className="tnum mt-0.5 leading-snug text-text-hi">{r.v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 border-t border-ink-600 pt-3.5 text-sm leading-relaxed text-text-lo">
                  Confirm an RTGS or NEFT transfer on{" "}
                  {bank.notifyPhones.map((p, i) => (
                    <span key={p}>
                      {i > 0 && " or "}
                      <a href={`tel:${p}`} className="text-agri-lift">
                        {p}
                      </a>
                    </span>
                  ))}
                  , or email{" "}
                  <a href={`mailto:${bank.notifyEmail}`} className="break-all text-agri-lift">
                    {bank.notifyEmail}
                  </a>
                  .
                </p>
              </div>

              <div className="border-l border-agri/30 pl-5">
                <Eyebrow>Prefer to walk in?</Eyebrow>
                <address className="mt-3 text-sm leading-relaxed text-text-mid not-italic">
                  {site.address.line1}, {site.address.line2}
                  <br />
                  {site.address.line3}
                  <br />
                  {site.address.city} {site.address.pincode}
                </address>
                <p className="mt-3 text-sm text-text-lo">{site.contact.hours}</p>
                <p className="mt-2 text-sm">
                  <a
                    href={`tel:${site.contact.phone}`}
                    className="text-agri-lift hover:text-text-hi"
                  >
                    {site.contact.phoneDisplay}
                  </a>
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
