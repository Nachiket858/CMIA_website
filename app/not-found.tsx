import Link from "next/link";
import { Container, Section, Eyebrow } from "@/components/Section";
import { RooflineRule } from "@/components/Roofline";

const ROUTES = [
  { label: "Home", href: "/" },
  { label: "About CMIA", href: "/about/" },
  { label: "History", href: "/about/history/" },
  { label: "Office bearers", href: "/leadership/" },
  { label: "Past presidents", href: "/leadership/past-presidents/" },
  { label: "What we do", href: "/what-we-do/" },
  { label: "Clusters", href: "/clusters/" },
  { label: "Initiatives", href: "/initiatives/" },
  { label: "Marathwada Skill Hub", href: "/initiatives/skill-hub/" },
  { label: "Membership", href: "/membership/" },
  { label: "Apply for membership", href: "/membership/apply/" },
  { label: "Events", href: "/events/" },
  { label: "Gallery", href: "/gallery/" },
  { label: "News & circulars", href: "/news/" },
  { label: "Venue & halls", href: "/venue/" },
  { label: "Resources", href: "/resources/" },
  { label: "Contact", href: "/contact/" },
];

export default function NotFound() {
  return (
    <Section>
      <Container>
        <Eyebrow>404</Eyebrow>
        <h1 className="mt-4 max-w-2xl text-[clamp(1.8rem,5.6vw,3rem)] font-semibold">
          That page isn&rsquo;t here.
        </h1>
        <p className="measure mt-5 leading-relaxed text-text-mid">
          The site was rebuilt and some addresses changed. Everything from the old site is
          still here — it may just have moved. Try one of these.
        </p>

        <RooflineRule className="mt-10" />

        <ul className="mt-8 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {ROUTES.map((r) => (
            <li key={r.href} className="border-b border-ink-700">
              <Link
                href={r.href}
                prefetch={false}
                className="block py-3 text-[0.97rem] text-text-mid transition-colors hover:text-text-hi"
              >
                {r.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
