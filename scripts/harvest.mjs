#!/usr/bin/env node
/**
 * harvest.mjs — pull the original photography off the live cmia.co.in.
 *
 * Every entry below was verified live with a HEAD request during the content
 * crawl. Twenty further images referenced by the old site return 404 and are
 * listed in BROKEN_ON_SOURCE so the gap is documented rather than forgotten.
 *
 * Output: assets/source/<dest>  (git-ignored — run `npm run images` to rebuild)
 * Then:   scripts/optimize.mjs turns these into AVIF + WebP at five widths.
 *
 *   node scripts/harvest.mjs            download anything missing
 *   node scripts/harvest.mjs --force    re-download everything
 */

import { mkdir, writeFile, access, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_DIR = join(ROOT, "assets", "source");
const BASE = "https://www.cmia.co.in/";
const FORCE = process.argv.includes("--force");

/**
 * src  — path on the live site (unencoded; encodeURI is applied per request)
 * dest — clean, lowercase, hyphenated filename we use from here on
 */
const ASSETS = [
  // --- Identity: three marks, three eras -----------------------------------
  ["images/cmia-logo.png", "identity/cmia-logo-original.png"],
  ["frontend/images/logo.jpg", "identity/mia-logo-1989.jpg"],
  ["frontend/images/logo1.jpg", "identity/adia-logo-1968.jpg"],
  ["frontend/images/Skillhub/logo.png", "identity/skill-hub-logo.png"],

  // --- Hero-grade event photography (1250x450) -----------------------------
  [
    "admin/slider_images/1738439743_CXO Roundtable with Shri Suresh Prabhu.jpeg",
    "events/cxo-roundtable-suresh-prabhu.jpg",
  ],
  [
    "admin/slider_images/1738439766_MOU Signing GoM & Toyota Kirloskar Motors.jpeg",
    "events/mou-gom-toyota-kirloskar.jpg",
  ],
  [
    "admin/slider_images/1738439808_CMIA team met Toyota Kirloskar Motors team.jpeg",
    "events/cmia-team-toyota-kirloskar.jpg",
  ],
  ["admin/slider_images/1753087693_Marathwada.jpeg", "events/marathwada.jpg"],
  ["admin/slider_images/1753087712_D.jpeg", "events/chamber-gathering.jpg"],
  ["admin/slider_images/1753087728_DSC_0739.JPG", "events/chamber-session-1.jpg"],
  ["admin/slider_images/1753087740_DSC_0789.JPG", "events/chamber-session-2.jpg"],

  // --- Gallery albums ------------------------------------------------------
  [
    "admin/gallery_upload/CXO Roundtable with Shri Hrishikesh Mafatlal, Chairman, Mafatlal Industries Ltd..jpeg",
    "gallery/cxo-roundtable-hrishikesh-mafatlal.jpg",
  ],
  ["admin/gallery_upload/OB Visit MSEDCL MD.jpeg", "gallery/ob-visit-msedcl-md.jpg"],

  // --- Initiatives ---------------------------------------------------------
  [
    "admin/upload_initiatives/1472806134_Falicitation of Hon. Minister Shri Bawankule.JPG",
    "initiatives/felicitation-minister-bawankule.jpg",
  ],
  [
    "admin/upload_initiatives/1472806359_CMIA lighting conclave registration huge response.JPG",
    "initiatives/lighting-conclave-registration.jpg",
  ],
  [
    "admin/upload_initiatives/1472806359_NGO Donation  from CMIA to Arambh Society.JPG",
    "initiatives/ngo-donation-arambh-society.jpg",
  ],
  [
    "admin/upload_initiatives/1493109507_CMIA JET UMBRELLA SCHEME.JPG",
    "initiatives/jet-airways-umbrella-scheme.jpg",
  ],
  [
    "admin/upload_initiatives/1496727215_CMIA University interaction on 7th June 17.JPG",
    "initiatives/bamu-university-interaction-2017.jpg",
  ],
  ["admin/upload_initiatives/1467623734_10.jpg", "initiatives/suryakumbh-1.jpg"],
  ["admin/upload_initiatives/1467623734_12.jpg", "initiatives/suryakumbh-2.jpg"],
  ["admin/upload_initiatives/1467623734_13.jpg", "initiatives/suryakumbh-3.jpg"],

  // --- Office bearers, 2026-27 term (598x665) ------------------------------
  ["images/AtharveshrajNandawat.jpg", "people/atharveshraj-nandawat.jpg"],
  ["images/Mihir Soundalgekar.JPG", "people/mihir-soundalgekar.jpg"],
  ["images/Ajinkya Savee.JPG", "people/ajinkya-save.jpg"],
  ["images/Saurabh Chhallani.jpg", "people/saurabh-chhallani.jpg"],
  ["images/Soham Kotak.jpg", "people/soham-kotak.jpg"],
  ["images/Rushikesh Jaju.jpg", "people/rushikesh-jaju.jpg"],
  ["images/UtsavMachhar.jpg", "people/utsav-machhar.jpg"],
  ["images/Harshit Modani.jpg", "people/harshit-modani.jpg"],
  ["images/Dr Vikrant Bhale.jpg", "people/vikrant-bhale.jpg"],
  ["images/Anuj Bansal.jpg", "people/anuj-bansal.jpg"],
  ["images/Rishikesh Gaoli.jpg", "people/rishikesh-gaoli.jpg"],
  ["images/Ravish Soni.jpg", "people/ravish-soni.jpg"],
  ["images/Gauri Mirashi.jpg", "people/gauri-mirashi.jpg"],
  ["images/Ankit Kale.jpg", "people/ankit-kale.jpg"],
  ["images/Utkarsha Patil.jpg", "people/utkarsha-patil.jpg"],
  ["images/Anand Modani.jpg", "people/anand-modani.jpg"],
  ["images/Rohit Dashrathi.jpg", "people/rohit-dashrathi.jpg"],
  ["images/Yashraj Peety.jpg", "people/yashraj-peety.jpg"],
  ["images/Amol Mohite.jpg", "people/amol-mohite.jpg"],
  ["images/Mukund Soni.jpg", "people/mukund-soni.jpg"],
  ["images/Aniket Patil.jpg", "people/aniket-patil.jpg"],
  ["images/Priyank Chopra.jpg", "people/priyank-chopra.jpg"],

  // --- Clusters ------------------------------------------------------------
  ["frontend/images/auto_components.jpg", "clusters/auto-components.jpg"],
  ["frontend/images/steel_industry.jpg", "clusters/steel-furniture.jpg"],
  ["frontend/images/paithani.jpg", "clusters/paithani.jpg"],
  ["frontend/images/GARMENT.jpg", "clusters/garment.jpg"],
  ["frontend/images/boss_freight_body.jpg", "clusters/truck-body.jpg"],
  ["frontend/images/bakery.jpg", "clusters/bakery.jpg"],
  ["frontend/images/S73F1680.jpg", "clusters/general-engineering.jpg"],

  // --- Venue: Bajaj Bhavan -------------------------------------------------
  ["frontend/images/infra/Bajaj Bhavan 1.jpeg", "venue/bajaj-bhavan-front.jpg"],
  ["images/Side view Bajaj Bhavan.jpeg", "venue/bajaj-bhavan-side.jpg"],
  ["frontend/images/infra/Function hall pic.jpeg", "venue/function-hall.jpg"],
  ["frontend/images/infra/board Room pic.jpg", "venue/board-room.jpg"],
  ["frontend/images/infra/IMG_3942.JPG", "venue/office.jpg"],
  ["frontend/images/hall/Conference Hall.jpeg", "venue/conference-hall.jpg"],
  ["frontend/images/hall/IMG_3950.jpg", "venue/hall-1.jpg"],
  ["frontend/images/hall/IMG_3951.jpg", "venue/hall-2.jpg"],
  ["frontend/images/hall/IMG_3952.jpg", "venue/hall-3.jpg"],

  // --- Skill Hub -----------------------------------------------------------
  ["frontend/images/Skillhub/skills.jpg", "skill-hub/skills.jpg"],
  [
    "frontend/images/Skiillhub_gallery/Skill Hub meeting at CMIA 22-02-18.jpg",
    "skill-hub/skill-hub-meeting-2018.jpg",
  ],
  ["frontend/images/Skiillhub_gallery/RASCI.JPG", "skill-hub/rasci.jpg"],
  [
    "frontend/images/Skiillhub_gallery/CMIA Excel Training 16th March 18.JPG",
    "skill-hub/excel-training-2018.jpg",
  ],
  [
    "frontend/images/Skiillhub_gallery/CMIA training Communication skill.jpg",
    "skill-hub/communication-skill-training.jpg",
  ],
  [
    "frontend/images/Skiillhub_gallery/CMIA  training on Presentation skill.jpg",
    "skill-hub/presentation-skill-training.jpg",
  ],
  [
    "frontend/images/Skiillhub_gallery/Police Boys Communication skill training.JPG",
    "skill-hub/police-boys-communication-training.jpg",
  ],
  [
    "frontend/images/Skiillhub_gallery/Skill development programme fo Police dept.Childrens.JPG",
    "skill-hub/police-dept-children-programme.jpg",
  ],
  [
    "frontend/images/Skiillhub_gallery/police boys Industrial Visit 04-09-18.JPG",
    "skill-hub/police-boys-industrial-visit-2018.jpg",
  ],
  [
    "frontend/images/Skiillhub_gallery/energy cell student visit to Sanjay Techno plast.JPG",
    "skill-hub/energy-cell-student-visit.jpg",
  ],
  [
    "frontend/images/Skiillhub_gallery/1512363377_ritesh mishra talking start up week end.JPG",
    "skill-hub/startup-weekend-ritesh-mishra.jpg",
  ],
  ["frontend/images/Skiillhub_gallery/startup1.jpg", "skill-hub/startup-weekend.jpg"],

  // --- Credentials ---------------------------------------------------------
  ["frontend/images/ISO Certificate 001.jpg", "documents/iso-certificate.jpg"],

  // --- Member / partner logos ---------------------------------------------
  ["images/clients/2000px-Siemens-logo.svg.png", "members/siemens.png"],
  ["images/clients/Varroc-Logo.png", "members/varroc.png"],
  ["images/clients/Sterlite.png", "members/sterlite.png"],
  ["images/clients/NRB Logo.png", "members/nrb-bearings.png"],
  ["images/clients/Cosmofilms.png", "members/cosmo-films.png"],
  ["images/clients/nirlep.png", "members/nirlep.png"],
  ["images/clients/bkt.jpg", "members/bkt-tires.png"],
  ["images/clients/753845dhoot_transmissions_logo.png", "members/dhoot-transmission.png"],
  ["images/clients/ICICI_Bank.svg.png", "members/icici-bank.png"],
  ["images/clients/Ajeet.png", "members/ajeet-seeds.png"],
  ["images/clients/fdc.png", "members/fdc.png"],
  ["images/clients/innoventuregroup.png", "members/innoventure-group.png"],
  ["images/clients/WH_Logo.png", "members/wh.png"],
  ["images/clients/kg.png", "members/kg.png"],
  ["images/clients/logo-india.png", "members/logo-india.png"],
  ["images/clients/logo_fal.png", "members/fal.png"],
  ["images/clients/car_logo_PNG1664.png", "members/auto.png"],
  ["images/clients/1.png", "members/member-1.png"],
  ["images/clients/3749945.png", "members/member-2.png"],
  ["images/clients/logo (1).png", "members/member-3.png"],
  ["images/clients/logo bgfght.png", "members/member-4.png"],
  ["images/clients/download (3).jpg", "members/member-5.png"],
];

/**
 * Referenced by the old site but returning 404. Recorded here so the
 * gap is auditable; content/*.json marks the matching slots as placeholders.
 */
const BROKEN_ON_SOURCE = [
  ...Array.from({ length: 13 }, (_, i) => `frontend/images/2017-18/${i + 1}`),
  "admin/upload_initiatives/1558087568_STRIVE news.JPG",
  "admin/upload_initiatives/1563432840_MOU2.JPG",
  "admin/upload_initiatives/1472806134_CMIA -CSMSS lighting conclave (truncated src)",
  "admin/upload_initiatives/1472806134_CMIA Past president Ram Bhogale (truncated src)",
  "admin/upload_initiatives/1472806359_CMIA -CSMSS lighting conclave (truncated src)",
  "admin/newsletter/Pulse Annual magazine.pdf",
  "frontend/img/spin.svg",
];

const exists = (p) =>
  access(p).then(
    () => true,
    () => false,
  );

async function download(src, dest) {
  const target = join(SOURCE_DIR, dest);
  if (!FORCE && (await exists(target))) return { dest, status: "cached" };

  await mkdir(dirname(target), { recursive: true });
  const url = BASE + encodeURI(src);

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "CMIA-site-build/1.0" },
        signal: AbortSignal.timeout(60_000),
      });
      if (!res.ok) {
        if (attempt === 3) return { dest, status: `HTTP ${res.status}` };
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 100) return { dest, status: "too small" };
      await writeFile(target, buf);
      return { dest, status: "ok", bytes: buf.length };
    } catch (err) {
      if (attempt === 3) return { dest, status: err.name || "failed" };
      await new Promise((r) => setTimeout(r, 400 * attempt));
    }
  }
  return { dest, status: "failed" };
}

async function main() {
  await mkdir(SOURCE_DIR, { recursive: true });
  console.log(`Harvesting ${ASSETS.length} assets from ${BASE}\n`);

  const results = [];
  const QUEUE = [...ASSETS];
  const workers = Array.from({ length: 8 }, async () => {
    for (;;) {
      const item = QUEUE.shift();
      if (!item) return;
      const r = await download(item[0], item[1]);
      results.push(r);
      if (r.status === "ok") {
        console.log(`  ok       ${(r.bytes / 1024).toFixed(0).padStart(6)} KB  ${r.dest}`);
      } else if (r.status === "cached") {
        console.log(`  cached              ${r.dest}`);
      } else {
        console.log(`  FAIL     ${r.status.padStart(9)}  ${r.dest}`);
      }
    }
  });
  await Promise.all(workers);

  const ok = results.filter((r) => r.status === "ok" || r.status === "cached");
  const failed = results.filter((r) => !(r.status === "ok" || r.status === "cached"));
  const bytes = results.reduce((n, r) => n + (r.bytes || 0), 0);

  console.log(
    `\n${ok.length}/${ASSETS.length} available` +
      (bytes ? `, ${(bytes / 1024 / 1024).toFixed(1)} MB downloaded` : ""),
  );
  if (failed.length) {
    console.log(`\n${failed.length} failed:`);
    for (const f of failed) console.log(`   ${f.status}  ${f.dest}`);
  }
  console.log(
    `\n${BROKEN_ON_SOURCE.length} assets are already 404 on the live site ` +
      `(see BROKEN_ON_SOURCE in this file).\nNext: npm run optimize`,
  );

  await writeFile(
    join(SOURCE_DIR, "harvest-report.json"),
    JSON.stringify(
      { harvested: results, brokenOnSource: BROKEN_ON_SOURCE },
      null,
      2,
    ),
  );
  if (failed.length && failed.length > ASSETS.length / 4) process.exitCode = 1;
}

main();
