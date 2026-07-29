import type { Metadata, Viewport } from "next";
import { Archivo, Inter, Mukta } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { site, fullAddress } from "@/lib/content";

/* The display face. Archivo's width axis gives the wide, flat-sided caps that
   echo the logo's chevrons — no serif anywhere on this site. */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"], // width axis — the source of the wide, flat-sided caps
  variable: "--font-archivo",
  display: "swap",
});

/* Body and UI. Chosen for its x-height at 14-16px on a mid-range Android. */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/* Devanagari. Declared but not preloaded — the browser fetches it only if
   Devanagari text actually appears on a page. */
const mukta = Mukta({
  subsets: ["devanagari", "latin"],
  weight: ["400", "600"],
  variable: "--font-mukta",
  display: "swap",
  preload: false,
});

const SITE_URL = "https://www.cmia.co.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.shortName} — ${site.name}`,
    template: `%s · ${site.shortName}`,
  },
  description:
    `The voice of Marathwada industry since ${site.foundedYear}. ` +
    `${site.stats.members} member organisations across manufacturing, auto components, ` +
    `pharma, agro-processing, engineering and agriculture.`,
  applicationName: site.shortName,
  keywords: [
    "CMIA",
    "Chamber of Marathwada Industries and Agriculture",
    "Marathwada industry",
    "Chhatrapati Sambhajinagar industry",
    "AURIC",
    "Waluj",
    "MIDC",
    "industry association Maharashtra",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.shortName,
    locale: "en_IN",
    url: SITE_URL,
    title: `${site.shortName} — ${site.name}`,
    description: `The voice of Marathwada industry since ${site.foundedYear}.`,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${site.shortName} — the voice of Marathwada industry since ${site.foundedYear}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@CMIAAurangabad",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#161310",
  width: "device-width",
  initialScale: 1,
};

/** Organisation structured data, from the same JSON the pages render. */
function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": ["Organization", "NGO"],
    name: site.name,
    alternateName: site.shortName,
    url: SITE_URL,
    foundingDate: String(site.foundedYear),
    description: site.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: [site.address.line1, site.address.line2, site.address.line3].join(", "),
      addressLocality: site.address.city,
      postalCode: site.address.pincode,
      addressRegion: site.address.state,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.contact.geo.lat,
      longitude: site.contact.geo.lng,
    },
    telephone: site.contact.phone,
    email: site.contact.emails[0].address,
    sameAs: site.social.map((s) => s.url),
    memberOf: site.affiliations.map((a) => ({
      "@type": "Organization",
      name: a.name,
      url: a.url,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      className={`${archivo.variable} ${inter.variable} ${mukta.variable}`}
      suppressHydrationWarning
    >
      <head>
        <OrganizationJsonLd />
        {/* Adds the `js` class so scroll-reveal styles apply only when they can
            actually be undone. Without JS every section renders visible. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only-focusable focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:h-auto focus:w-auto focus:overflow-visible focus:bg-signal focus:px-4 focus:py-2 focus:font-semibold focus:text-ink-900 focus:[clip-path:none]"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}

export { fullAddress };
