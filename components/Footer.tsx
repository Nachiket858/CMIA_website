import Link from "next/link";
import { Picture } from "@/components/Picture";
import { RooflineRule } from "@/components/Roofline";
import { site } from "@/lib/content";

const COLUMNS = [
  {
    title: "The chamber",
    links: [
      { label: "About CMIA", href: "/about/" },
      { label: "History", href: "/about/history/" },
      { label: "Office bearers", href: "/leadership/" },
      { label: "Past presidents", href: "/leadership/past-presidents/" },
    ],
  },
  {
    title: "Our work",
    links: [
      { label: "What we do", href: "/what-we-do/" },
      { label: "Clusters", href: "/clusters/" },
      { label: "Initiatives", href: "/initiatives/" },
      { label: "Marathwada Skill Hub", href: "/initiatives/skill-hub/" },
    ],
  },
  {
    title: "For members",
    links: [
      { label: "Benefits & fees", href: "/membership/" },
      { label: "Apply for membership", href: "/membership/apply/" },
      { label: "Events", href: "/events/" },
      { label: "News & circulars", href: "/news/" },
      { label: "Venue & halls", href: "/venue/" },
    ],
  },
  {
    title: "More",
    links: [
      { label: "Gallery", href: "/gallery/" },
      { label: "Resources", href: "/resources/" },
      { label: "Contact", href: "/contact/" },
    ],
  },
];

export function Footer() {
  const { address, contact } = site;

  return (
    <footer className="mt-24 bg-ink-900">
      <RooflineRule />

      <div className="mx-auto max-w-[1240px] px-4 pt-14 pb-10 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,2fr)]">
          {/* Identity and address */}
          <div>
            <Picture
              src="identity/cmia-logo-original"
              alt={site.name}
              sizes="120px"
              imgClassName="h-12 w-auto"
            />
            <p className="mt-4 font-display text-sm leading-snug font-semibold tracking-tight text-text-hi uppercase">
              Chamber of Marathwada
              <br />
              Industries &amp; Agriculture
            </p>

            <address className="mt-5 text-sm leading-relaxed text-text-mid not-italic">
              {address.line1}, {address.line2}
              <br />
              {address.line3}
              <br />
              {address.city} {address.pincode}
              <br />
              {address.state}, {address.country}
            </address>

            <dl className="mt-5 space-y-1.5 text-sm">
              <div className="flex gap-2">
                <dt className="sr-only">Phone</dt>
                <dd>
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-agri-lift hover:text-text-hi"
                  >
                    {contact.phoneDisplay}
                  </a>
                </dd>
              </div>
              {contact.emails.map((e) => (
                <div key={e.address} className="flex flex-wrap gap-x-2">
                  <dt className="text-text-lo">{e.label}</dt>
                  <dd>
                    <a
                      href={`mailto:${e.address}`}
                      className="break-all text-agri-lift hover:text-text-hi"
                    >
                      {e.address}
                    </a>
                  </dd>
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <dt className="text-text-lo">Open</dt>
                <dd className="text-text-mid">{contact.hours}</dd>
              </div>
            </dl>
          </div>

          {/* Sitemap */}
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h2 className="font-display text-[0.7rem] font-semibold tracking-[0.14em] text-agri uppercase">
                  {col.title}
                </h2>
                <ul className="mt-3 space-y-2">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        prefetch={false}
                        className="text-sm text-text-mid transition-colors hover:text-text-hi"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Affiliations */}
        <div className="mt-12 border-t border-ink-600 pt-6">
          <h2 className="font-display text-[0.7rem] font-semibold tracking-[0.14em] text-agri uppercase">
            Affiliated to
          </h2>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {site.affiliations.map((a) => (
              <li key={a.abbr}>
                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-mid hover:text-text-hi"
                >
                  <span className="font-semibold text-text-hi">{a.abbr}</span>
                  <span className="text-text-lo"> · {a.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social + legal */}
        <div className="mt-8 flex flex-col gap-5 border-t border-ink-600 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {site.social.map((s) => (
              <li key={s.network}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-mid hover:text-agri-lift"
                >
                  {s.network}
                </a>
              </li>
            ))}
          </ul>

          <p className="text-xs leading-relaxed text-text-lo">
            © {new Date().getFullYear()} {site.name}.
            <br className="sm:hidden" />{" "}
            <span className="whitespace-nowrap">
              Reg. {site.registration.societyReg} · GST {site.registration.gst}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
