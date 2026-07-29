/**
 * Pictograms drawn for this chamber specifically.
 *
 * Not an icon pack. Each one depicts something that appears in CMIA's own
 * content: the Certificate of Origin it is authorised to issue, the Export
 * Inspection Council's fortnightly visit, a Paithani loom, a truck ladder
 * frame, a bakery spiral mixer, a north-light shed roof.
 *
 * One drawing language: 24x24, stroke-only, 1.5 weight, mitred joins to match
 * the Roofline. Colour comes from `currentColor` so they inherit whatever
 * surface they sit on.
 */

export type PictogramName =
  | "shed"
  | "stamp"
  | "gsp"
  | "representation"
  | "circular"
  | "training"
  | "expo"
  | "gate"
  | "helpdesk"
  | "institution"
  | "globe-route"
  | "handshake-file"
  | "community"
  | "map-pin"
  | "press"
  | "publication"
  | "loom"
  | "truck-frame"
  | "mixer"
  | "furniture"
  | "gear-cnc"
  | "stitch"
  | "hall";

const P: Record<PictogramName, React.ReactNode> = {
  /* A north-light shed roof over a wall — the Marathwada industrial estate. */
  shed: (
    <>
      <path d="M2 11 6 5l4 6M10 11 14 5l4 6M18 11 22 5" />
      <path d="M2 11v8h20v-8" />
      <path d="M6 19v-4h4v4" />
    </>
  ),

  /* Certificate of Origin: a document with an embossed seal. */
  stamp: (
    <>
      <path d="M4 3h11l4 4v9" />
      <path d="M15 3v4h4" />
      <path d="M4 3v18h9" />
      <path d="M7 9h5M7 12h4" />
      <circle cx="17" cy="18" r="3.5" />
      <path d="M17 16.4v3.2M15.6 18h2.8" />
    </>
  ),

  /* GSP: a crate with an inspection tag, cleared for export. */
  gsp: (
    <>
      <path d="M3 8.5 10 5l7 3.5v7L10 19l-7-3.5z" />
      <path d="M10 12v7M3 8.5 10 12l7-3.5" />
      <path d="M15.5 4.5h5.5v4h-5.5z" />
      <path d="M17 6.5l1.1 1.1 1.9-2" />
    </>
  ),

  /* Representation: a case carried to a columned authority. */
  representation: (
    <>
      <path d="M13 4h9M13 4v16h9" />
      <path d="M15.5 8v8M18 8v8M20.5 8v8" />
      <path d="M2 10h8v6H2z" />
      <path d="M4.5 10V8.5h3V10" />
      <path d="M10 13h3" />
    </>
  ),

  /* Circular: a stack of notices, dated. */
  circular: (
    <>
      <path d="M6 3h9l4 4v11H6z" />
      <path d="M15 3v4h4" />
      <path d="M3 7v14h13" />
      <path d="M9 11h7M9 14h5" />
    </>
  ),

  /* Training: a vernier caliper on a workpiece — measured skill. */
  training: (
    <>
      <path d="M3 5h18" />
      <path d="M6 5v6a2 2 0 0 0 2 2h1" />
      <path d="M17 5v9a2 2 0 0 1-2 2h-1" />
      <path d="M4.5 5V2.5M19.5 5V2.5" />
      <path d="M8 19h8v3H8z" />
      <path d="M12 16v3" />
    </>
  ),

  /* Maha Expo: an exhibition canopy over a display panel. */
  expo: (
    <>
      <path d="M2 8 12 3l10 5" />
      <path d="M2 8v2h20V8" />
      <path d="M5 10v11M19 10v11" />
      <path d="M8 13h8v6H8z" />
      <path d="M2 21h20" />
    </>
  ),

  /* Facilitation: a boom barrier lifting. */
  gate: (
    <>
      <path d="M4 21V9" />
      <circle cx="4" cy="7" r="2" />
      <path d="M6 6.2 21 3" />
      <path d="M9.5 5.5 10 8M13 4.8 13.5 7.3M16.5 4.1 17 6.6" />
      <path d="M2 21h6" />
    </>
  ),

  /* Help desk: a counter with a call bell. */
  helpdesk: (
    <>
      <path d="M3 14h18v5H3z" />
      <path d="M5 19v2M19 19v2" />
      <path d="M9 14a3 3 0 0 1 6 0" />
      <path d="M12 11v-1.5" />
      <circle cx="12" cy="8" r="1" />
    </>
  ),

  /* Institution: a university portico. */
  institution: (
    <>
      <path d="M2 9 12 4l10 5" />
      <path d="M4 9v10M8 9v10M12 9v10M16 9v10M20 9v10" />
      <path d="M2 19h20M2 21h20" />
      <path d="M3 9h18" />
    </>
  ),

  /* Exports: a globe with a departure arc. */
  "globe-route": (
    <>
      <circle cx="11" cy="12" r="8" />
      <path d="M3 12h16" />
      <path d="M11 4c-2.4 2.2-2.4 13.6 0 16 2.4-2.4 2.4-13.8 0-16z" />
      <path d="M14 6c3.5-1.2 6.5-.6 7 1.2" />
      <path d="M21 7.2 18.6 8.4M21 7.2l-.4-2.6" />
    </>
  ),

  /* MOU: a folder with two parties meeting. */
  "handshake-file": (
    <>
      <path d="M3 6h6l2 2h10v11H3z" />
      <path d="M7 13h3l1.5 1.5L13 13h4" />
      <path d="M10 13v3M14 13v3" />
    </>
  ),

  /* Community: a sapling in cupped ground. */
  community: (
    <>
      <path d="M12 20v-8" />
      <path d="M12 12c0-3 2-5 5-5 0 3-2 5-5 5z" />
      <path d="M12 14c0-3-2-5-5-5 0 3 2 5 5 5z" />
      <path d="M4 20a8 8 0 0 0 16 0" />
    </>
  ),

  "map-pin": (
    <>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),

  press: (
    <>
      <path d="M3 5h14v14H3z" />
      <path d="M17 9h4v8a2 2 0 0 1-2 2h-2z" />
      <path d="M6 8h8M6 11h8M6 14h5" />
    </>
  ),

  publication: (
    <>
      <path d="M4 4h7v16H4z" />
      <path d="M11 4h9v16h-9z" />
      <path d="M14 8h3M14 11h3" />
      <path d="M6.5 4v16" />
    </>
  ),

  /* Paithani: warp threads on a loom with the shuttle mid-pass. */
  loom: (
    <>
      <path d="M3 4v16M21 4v16" />
      <path d="M6 4v16M9 4v16M12 4v16M15 4v16M18 4v16" />
      <path d="M2 12h20" />
      <path d="M8.5 10.5h7l1 1.5-1 1.5h-7l-1-1.5z" fill="currentColor" fillOpacity="0.15" />
    </>
  ),

  /* Truck body building: a ladder chassis on wheels. */
  "truck-frame": (
    <>
      <path d="M2 9h16l4 3v3H2z" />
      <path d="M2 12h16" />
      <path d="M6 9v6M10 9v6M14 9v6" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </>
  ),

  /* Bakery: a spiral dough mixer. */
  mixer: (
    <>
      <path d="M4 12h16l-1.5 8h-13z" />
      <path d="M12 12V4" />
      <path d="M12 6c2.5 0 2.5 3 0 3s-2.5 3 0 3" />
      <path d="M8 4h8" />
    </>
  ),

  /* Steel furniture: a tubular chair frame. */
  furniture: (
    <>
      <path d="M7 4v9M17 4v9" />
      <path d="M7 6h10M7 9h10" />
      <path d="M5 13h14" />
      <path d="M6 13v7M18 13v7" />
      <path d="M6 16h12" />
    </>
  ),

  /* Precision machining: spindle over a gear. */
  "gear-cnc": (
    <>
      <path d="M12 2v4M9.5 3.5 12 6l2.5-2.5" />
      <circle cx="12" cy="14" r="4" />
      <circle cx="12" cy="14" r="1.5" />
      <path d="M12 8v-1M12 21v-1M5.5 14h-1M19.5 14h-1M7.4 9.4 6.7 8.7M17.3 20.3l-.7-.7M7.4 18.6l-.7.7M17.3 7.7l-.7.7" />
    </>
  ),

  /* Garment: needle and thread. */
  stitch: (
    <>
      <path d="M20 4 8 16" />
      <path d="M20 4l-1 4-3-1z" />
      <path d="M8 16l-2 4 4-2z" />
      <path d="M4 12c2-2 4 2 6 0s4 2 6 0" />
    </>
  ),

  /* The chamber's seminar hall: seating rows facing a screen. */
  hall: (
    <>
      <path d="M5 4h14v6H5z" />
      <path d="M3 14h18M3 17h18M3 20h18" />
      <path d="M7 14v-1.5M12 14v-1.5M17 14v-1.5" />
    </>
  ),
};

export function Pictogram({
  name,
  className = "",
  size,
  title,
}: {
  name: PictogramName | string;
  className?: string;
  size?: number;
  title?: string;
}) {
  const art = P[name as PictogramName];
  if (!art) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="miter"
      strokeLinecap="butt"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {art}
    </svg>
  );
}

export const pictogramNames = Object.keys(P) as PictogramName[];
