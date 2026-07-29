/**
 * Typed access to everything in content/.
 *
 * The JSON files are the editable layer — a staffer changes those, not this.
 * Keys beginning with an underscore are editor notes and are never rendered;
 * `stripNotes` is available for anywhere that iterates keys generically.
 */

import siteJson from "@/content/site.json";
import officeBearersJson from "@/content/office-bearers.json";
import pastPresidentsJson from "@/content/past-presidents.json";
import timelineJson from "@/content/timeline.json";
import clustersJson from "@/content/clusters.json";
import membershipJson from "@/content/membership.json";
import servicesJson from "@/content/services.json";
import initiativesJson from "@/content/initiatives.json";
import eventsJson from "@/content/events.json";
import galleryJson from "@/content/gallery.json";
import newsJson from "@/content/news.json";
import resourcesJson from "@/content/resources.json";
import venueJson from "@/content/venue.json";
import membersJson from "@/content/members.json";

export const site = siteJson;
export const officeBearers = officeBearersJson;
export const pastPresidents = pastPresidentsJson;
export const timeline = timelineJson;
export const clusters = clustersJson;
export const membership = membershipJson;
export const services = servicesJson;
export const initiatives = initiativesJson;
export const events = eventsJson;
export const gallery = galleryJson;
export const news = newsJson;
export const resources = resourcesJson;
export const venue = venueJson;
export const members = membersJson;

/* ---------------------------------------------------------------- helpers */

export function stripNotes<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => !k.startsWith("_")),
  ) as Partial<T>;
}

export const fullAddress = [
  site.address.line1,
  site.address.line2,
  site.address.line3,
  `${site.address.city} ${site.address.pincode}`,
  site.address.state,
].join(", ");

/** Rupee formatting, Indian grouping, no decimals. */
export function rupees(n: number): string {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

/** First year of a term string like "2026-27" or "1999-2000". */
export function termStartYear(year: string): number {
  return parseInt(year.slice(0, 4), 10);
}

/* ------------------------------------------------- derived: leadership */

/**
 * Widened from the JSON literal types — TypeScript narrows each entry to the
 * exact keys present, which makes optional fields like `isCoChair` invisible on
 * the entries that happen not to carry them.
 */
export type Person = {
  name: string;
  role: string;
  photo?: string | null;
  lead?: boolean;
  isCoChair?: boolean;
  zone?: string;
  cell?: string;
};

export type BearerGroup = {
  id: string;
  title: string;
  blurb: string;
  paired?: boolean;
  people: Person[];
};

export const bearerGroups = officeBearers.groups as unknown as BearerGroup[];

export type Term = {
  year: string;
  president: string;
  secretary: string;
  current?: boolean;
  flag?: string;
};

export const terms = pastPresidents.terms as Term[];

/** Presidents who served more than one term, with the years they served. */
export function repeatPresidents(): { name: string; years: string[] }[] {
  const byName = new Map<string, string[]>();
  for (const t of terms) {
    const list = byName.get(t.president) ?? [];
    list.push(t.year);
    byName.set(t.president, list);
  }
  return [...byName.entries()]
    .filter(([, years]) => years.length > 1)
    .map(([name, years]) => ({ name, years: years.slice().reverse() }))
    .sort((a, b) => b.years.length - a.years.length);
}

/**
 * Honorary secretaries who later became president.
 *
 * A real pattern in the chamber's own record — not a claim added to it. Names
 * are matched on the exact strings the old site published, so the two entries
 * spelled inconsistently there ("Ram Bhogle"/"Ram Bhogale",
 * "Grupreet Singh Bagga"/"Gurpreet Bagga") will not match and are reported
 * separately by `npm run validate` rather than silently normalised here.
 */
export function secretaryToPresident(): {
  name: string;
  secretaryYears: string[];
  presidentYears: string[];
  gapYears: number;
}[] {
  const secYears = new Map<string, string[]>();
  const presYears = new Map<string, string[]>();
  for (const t of terms) {
    secYears.set(t.secretary, [...(secYears.get(t.secretary) ?? []), t.year]);
    presYears.set(t.president, [...(presYears.get(t.president) ?? []), t.year]);
  }
  const out: ReturnType<typeof secretaryToPresident> = [];
  for (const [name, sYears] of secYears) {
    const pYears = presYears.get(name);
    if (!pYears) continue;
    const firstSec = Math.min(...sYears.map(termStartYear));
    const firstPres = Math.min(...pYears.map(termStartYear));
    if (firstPres <= firstSec) continue; // president first — not the pipeline
    out.push({
      name,
      secretaryYears: sYears.slice().reverse(),
      presidentYears: pYears.slice().reverse(),
      gapYears: firstPres - firstSec,
    });
  }
  return out.sort((a, b) => a.gapYears - b.gapYears);
}

export const currentTerm = terms.find((t) => t.current) ?? terms[0];

/* ------------------------------------------------ derived: membership */

export type FeeClass = (typeof membership.classes)[number];
export type Tenure = (typeof membership.tenures)[number];

/** Fee including admission and GST for a class over a tenure. */
export function tenureCost(cls: FeeClass, tenure: Tenure) {
  const subscription = cls.annual * tenure.annualMultiple;
  const base = subscription + cls.admission;
  const gst = Math.round((base * membership.gstPercent) / 100);
  return {
    subscription,
    admission: cls.admission,
    base,
    gst,
    total: base + gst,
    perYear: Math.round((base + gst) / tenure.years),
  };
}

/* ------------------------------------------------------ derived: events */

export type ArchiveItem = (typeof events.archive)[number] & {
  detail?: string;
  date?: string;
  dateLabel?: string;
  photo?: string | null;
};

export const archive = events.archive as ArchiveItem[];

export type UpcomingEvent = {
  id: string;
  title: string;
  dateStart: string;
  dateEnd?: string;
  dateLabel: string;
  venue: string;
  category: string;
  openTo?: string;
  summary: string;
  photo?: string | null;
};

export const upcomingEvents = events.upcoming as unknown as UpcomingEvent[];

export function archiveByCategory(id: string) {
  return archive.filter((a) => a.category === id);
}

export const archiveCounts = Object.fromEntries(
  events.categories.map((c) => [c.id, archiveByCategory(c.id).length]),
) as Record<string, number>;

/** Records that carry a photograph, for the photo-led strip. */
export const archiveWithPhotos = archive.filter(
  (a): a is ArchiveItem & { photo: string } => Boolean(a.photo),
);

/* ----------------------------------------------------- derived: gallery */

export const allPhotos = gallery.albums.flatMap((a) =>
  a.photos.map((p) => ({ ...p, album: a.id, albumTitle: a.title, category: a.category })),
);

export const galleryCategories = [...new Set(gallery.albums.map((a) => a.category))];
