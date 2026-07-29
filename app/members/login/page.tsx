import type { Metadata } from "next";
import { Container, Section, PageHeader, Eyebrow, Button } from "@/components/Section";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Member login",
  description: "How CMIA members receive circulars and notices.",
  alternates: { canonical: "/members/login/" },
  robots: { index: false, follow: true },
};

/**
 * The old site had a login.php behind which sat the admin panel for circulars
 * and events. There is no such backend here, and inventing a login form that
 * cannot log anyone in would be worse than saying so.
 *
 * This page exists because the old URL did, and it sends people where the thing
 * they wanted actually is.
 */
export default function MemberLoginPage() {
  return (
    <>
      <PageHeader
        eyebrow="Members"
        title="There is no member login on this site."
        lede="Circulars and notices reach members directly, by email and WhatsApp, every month."
      />

      <Section tight>
        <Container>
          <div className="max-w-2xl">
            <div className="gable-cut-lg border border-agri/25 bg-ink-900 p-6 shadow-[var(--shadow-lg)] sm:p-8">
              <Eyebrow>What you were probably looking for</Eyebrow>
              <ul className="mt-5 space-y-5">
                <li>
                  <p className="font-display text-[1.05rem] font-semibold text-text-hi">
                    Circulars and government notifications
                  </p>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-text-mid">
                    Circulated to members every month by email and WhatsApp. Anything published
                    publicly is on the news page.
                  </p>
                </li>
                <li>
                  <p className="font-display text-[1.05rem] font-semibold text-text-hi">
                    Your representatives on the WhatsApp group
                  </p>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-text-mid">
                    Added from the names on your membership application. To change them, contact
                    the office.
                  </p>
                </li>
                <li>
                  <p className="font-display text-[1.05rem] font-semibold text-text-hi">
                    Renewing your membership
                  </p>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-text-mid">
                    Handled by the office. Fees and bank details are on the membership pages.
                  </p>
                </li>
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/news/">News &amp; circulars</Button>
                <Button href="/contact/" variant="outline">
                  Contact the office
                </Button>
              </div>

              <p className="mt-7 border-t border-ink-600 pt-5 text-sm leading-relaxed text-text-lo">
                Call{" "}
                <a href={`tel:${site.contact.phone}`} className="text-agri-lift">
                  {site.contact.phoneDisplay}
                </a>{" "}
                during {site.contact.hours}, or email{" "}
                <a
                  href={`mailto:${site.contact.emails[1].address}`}
                  className="break-all text-agri-lift"
                >
                  {site.contact.emails[1].address}
                </a>
                .
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
