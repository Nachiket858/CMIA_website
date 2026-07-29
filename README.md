# CMIA website

The website of the **Chamber of Marathwada Industries and Agriculture**, Chhatrapati
Sambhajinagar.

A static site: Next.js builds it to plain HTML, so it can be hosted anywhere and loads fast
on a mid-range Android over patchy 4G — which is what most visitors are using.

All editable content lives in [`content/`](content/) as JSON. Nothing that a staff member
needs to change is buried in the code. See **[CONTENT-GUIDE.md](CONTENT-GUIDE.md)**.

---

## Running it locally

You need **Node 20 or newer**.

```bash
npm install
npm run images      # downloads and optimises photographs — first run only, ~2 min
npm run dev         # http://localhost:3000
```

`npm run images` fetches the photographs from the live cmia.co.in and converts them to AVIF
and WebP at five sizes. It only needs running once, or when new photographs are added.
Without it the site builds, but images will not appear.

### Every command

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Validates content, then builds to `out/` |
| `npm start` | Serves the built `out/` folder locally |
| `npm run validate` | Checks `content/*.json` and explains anything wrong |
| `npm run typecheck` | TypeScript check |
| `npm run harvest` | Downloads original photographs to `assets/source/` |
| `npm run optimize` | Converts `assets/source/` to AVIF + WebP in `public/img/` |
| `npm run images` | `harvest` then `optimize` |

---

## Deploying

`npm run build` produces a folder called `out/`. Upload its contents to the web root.
That is the whole deployment.

Redirects from the old `.php` URLs cannot be handled by static HTML, so the build writes
config for the three common hosts. **Keep the one that matches your host and delete the
other two:**

| Host | Keep | Notes |
|---|---|---|
| Apache / cPanel shared hosting | `.htaccess` | This is what cmia.co.in currently runs on |
| Netlify, Cloudflare Pages | `_redirects` | |
| Vercel | `vercel.json` | |

All three are generated from [`lib/redirects.ts`](lib/redirects.ts). To add a redirect, edit
that file and rebuild — do not edit the generated files.

### The contact and membership forms

The site is static, so it has no server to receive form submissions. Point the forms at any
Formspree-compatible endpoint by setting one environment variable before building:

```bash
# .env.local
NEXT_PUBLIC_FORM_ENDPOINT=https://formspree.io/f/your-form-id
```

Until that is set, both forms validate normally and then tell the visitor plainly that
online submission is not connected, offering the office phone number, email address and the
downloadable PDF instead. They never silently swallow a submission.

---

## How it is put together

```
app/                     One folder per page. layout.tsx is the shared shell.
components/              The shared component vocabulary
  charts/                Hand-written SVG charts — no chart library
  Roofline.tsx           The signature element
  Pictogram.tsx          Custom pictograms drawn for CMIA's trades
content/                 ← All editable content. JSON only.
lib/
  content.ts             Typed access to content/, plus derived figures
  roofline.ts            The Roofline geometry
  redirects.ts           Old URL → new URL, the single source of truth
scripts/
  harvest.mjs            Downloads photographs from the live site
  optimize.mjs           sharp → AVIF + WebP at 360/640/960/1280/1920
  validate-content.mjs   Content checks with plain-English errors
  build-redirects.mjs    Generates the three host config files
  build-og.mjs           Renders the social share image and icons
assets/source/           Original photographs (git-ignored, rebuilt by npm run images)
public/img/              Optimised images (git-ignored, rebuilt by npm run optimize)
```

### Design decisions worth knowing before changing anything

**The palette is derived, not chosen.** Every colour comes from three values sampled out of
the CMIA logo:

| | Hex | Where it comes from | What it is allowed to do |
|---|---|---|---|
| Brass | `#CC9866` | The sweeping "C" | Rules, the Roofline, section headings, the timeline spine |
| Signal | `#FF6634` | The "M" chevrons | **Action and now only** — buttons, "upcoming", the current term |
| Agri | `#3398CC` | The chevron in the "A" | **Agriculture and data only** — charts, the focus ring |

The page ground is a warm iron **hue-locked to the brass hue at 29–55% saturation**
(`#130E09` → `#594C3F`). The saturation matters: an earlier ramp sat at 20–30% and read as
plain black on a phone, which made the brand hues look like accents sprinkled on a default
dark theme. At these values the ground itself is visibly the logo's hue family. Long-form
reading happens on **bone** panels (`#F1E7DC`) that sit on the ink like paper on a workbench.

**The hero is where the palette does its loudest work.** Seven of the chamber's own
photographs are clipped to the shed profile and duotoned into brass → signal → agri in
rotation, so the logo's three colours are the page rather than an accent on it. The duotone
is a `mix-blend-mode: color` pass (which keeps the photograph's luminance and takes only its
hue) over a `multiply` pass for the darks. A single `multiply` at 50% was tried first and
muted everything into sepia and teal — tinted, but no longer recognisably CMIA.

Two rules that are easy to break by accident:

- **Brand hues are never text on bone.** They measure 1.6–2.7:1 there. Use `brass-deep`,
  `signal-deep` or `agri-deep` instead, which clear 5:1.
- **Buttons are signal fill with ink text** (6.7:1). White text on signal is 2.9:1 and fails.

**Charts carry at most two colour-coded series.** Verified with a palette validator: brass
against signal measures ΔE 0.8 under deuteranopia — genuinely indistinguishable. So brass
never encodes a data series, and `[agri, signal]` is the whole categorical palette
(ΔE 26.0 under protanopia, 35.2 normal). Anything needing more categories drops colour
encoding and labels its marks directly, which is what the cluster map does.

**The Roofline appears in exactly three places** — the home hero, the history and
past-presidents spine, and the section rule. It is the one bold element; keeping it rare is
what makes it work.

**Every chart ships a table.** `DataFigure` requires one, so no chart can be added without
a text equivalent.

**Typography.** Archivo (width axis) for display, Inter for body, Mukta for Devanagari. Mukta
is declared but not preloaded, so it costs nothing until Devanagari text appears.

### Accessibility commitments in the code

- Contrast ratios are computed, not eyeballed; the values are in the comments in
  `app/globals.css`.
- One focus treatment site-wide, at 8.8:1.
- `prefers-reduced-motion` removes every animation and renders final states.
- Scroll reveals only hide content when JavaScript is present to reveal it — a no-JS visitor
  sees the whole page.
- `alt` text is a required prop on `Picture`, with no decorative escape hatch.

---

## Known gaps, waiting on the chamber

`npm run validate` lists these on every run. None of them block the build.

1. **A vector logo.** The only file available is 150×80 pixels. It is fine at header size and
   nothing larger uses it, but an SVG or a high-resolution PNG would be better.
2. **A photograph of Bajaj Bhavan.** The only exterior shots on the old site are 310×210 —
   too small to use large on the venue and contact pages.
3. **The current president's message.** The message on the site is the 2025-26 one, which is
   what the old site still carried. It is labelled as such.
4. **Thirteen event photographs** from the 2017-18 tenure are referenced by the old site but
   return 404 from its server. The written records are all preserved.
5. **The Pulse annual magazine PDF** is also 404 on the old server.
6. **Five member logos** could not be identified from their filenames and render without a
   caption rather than with a guessed one.
7. **Two names in the past-presidents table** are spelled two ways, and the 1989-90 row was
   printed as "1998-90". Both are flagged on the page rather than silently corrected.

---

## Content that changed form, and why

Nothing from the old site was deleted. Some of it changed shape:

- **Long prose became structure.** The history essay is a timeline; the constitution sits
  behind an expander; the cluster machinery lists are expandable.
- **Four empty database pages** — past events, circulars, press room, video gallery, training
  programme — rendered as empty tables on the old site. They now show honest empty states, or
  in the case of training, what has actually been run.
- **The 51 "CMIA in Action" captions** became a filterable archive on the events page,
  categorised by the kind of work.
- **`vision&policy.php`** folded into `/about#vision`; **`infrastructure.php`** and
  **`hall_booking.php`** merged into `/venue`; **`press_room`**, **`circulars`** and
  **`newsletters`** merged into `/news`; **`photo_gallery`** and **`video_gallery`** merged
  into `/gallery`.
- **`login.php`** pointed at an admin panel that does not exist here. `/members/login/` now
  explains where circulars actually come from instead of showing a login form that cannot
  log anyone in.

The full old-URL-to-new-URL map is in [`lib/redirects.ts`](lib/redirects.ts).
