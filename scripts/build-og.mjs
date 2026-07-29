#!/usr/bin/env node
/**
 * build-og.mjs — render the Open Graph card to a static PNG.
 *
 * Static export rules out Next's runtime ImageResponse, so the card is composed
 * as SVG here and rasterised with sharp at build time. It uses the Roofline and
 * the same three logo colours, so a link preview is recognisably CMIA.
 */

import { mkdir, writeFile, readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public");

const site = JSON.parse(await readFile(join(ROOT, "content", "site.json"), "utf8"));

const W = 1200;
const H = 630;

/** The hero ridge: seven gables across the lower third. */
function ridge(y, height, peaks) {
  const bay = W / peaks.length;
  const pts = [`M 0 ${y}`];
  peaks.forEach((h, i) => {
    pts.push(`L ${bay * (i + 0.5)} ${y - h * height}`, `L ${bay * (i + 1)} ${y}`);
  });
  return pts.join(" ");
}

const PEAKS = [0.92, 0.7, 1, 0.52, 0.78, 0.58, 0.66];

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#CC9866" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#CC9866" stop-opacity="0.02"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="#0E0C0A"/>

  <!-- The ridge, filled and stroked -->
  <path d="${ridge(H - 70, 190, PEAKS)} L ${W} ${H - 70} L 0 ${H - 70} Z" fill="url(#g)"/>
  <path d="${ridge(H - 70, 190, PEAKS)}" fill="none" stroke="#CC9866" stroke-width="3" stroke-linejoin="miter"/>
  <rect x="0" y="${H - 70}" width="${W}" height="2" fill="#CC9866" opacity="0.5"/>

  <!-- Three small gables as the mark, top left -->
  <g fill="none" stroke-width="6" stroke-linejoin="miter">
    <path d="M64 106 L86 68 L108 106" stroke="#CC9866"/>
    <path d="M92 106 L114 68 L136 106" stroke="#FF6634"/>
    <path d="M120 106 L142 68 L164 106" stroke="#3398CC"/>
  </g>

  <text x="64" y="200" font-family="Arial Black, Arial, sans-serif" font-size="34" font-weight="900"
        letter-spacing="4" fill="#CC9866">CMIA · EST. ${site.foundedYear}</text>

  <text x="64" y="290" font-family="Arial Black, Arial, sans-serif" font-size="66" font-weight="900" fill="#F5EDE6">
    The voice of Marathwada
  </text>
  <text x="64" y="364" font-family="Arial Black, Arial, sans-serif" font-size="66" font-weight="900" fill="#F5EDE6">
    industry since ${site.foundedYear}.
  </text>

  <text x="64" y="428" font-family="Arial, sans-serif" font-size="28" fill="#C7BBAF">
    Chamber of Marathwada Industries and Agriculture
  </text>

  <g font-family="Arial, sans-serif" font-size="24" fill="#94887C">
    <text x="64" y="${H - 24}">${site.stats.members} members</text>
    <text x="300" y="${H - 24}">${site.yearsActive} years</text>
    <text x="470" y="${H - 24}">${site.stats.presidentialTerms} terms</text>
    <text x="650" y="${H - 24}">${site.stats.clusters} clusters</text>
  </g>
</svg>`;

await mkdir(OUT, { recursive: true });
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(join(OUT, "og.png"));

// A 512px maskable icon for Android home screens.
const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#161310"/>
  <g fill="none" stroke-linejoin="miter" stroke-width="3">
    <path d="M3 24 L9.5 13 L16 24" stroke="#CC9866"/>
    <path d="M11 24 L17.5 13 L24 24" stroke="#FF6634"/>
    <path d="M19 24 L25.5 13 L32 24" stroke="#3398CC"/>
  </g>
  <rect x="0" y="25.5" width="32" height="1.5" fill="#CC9866"/>
</svg>`;
await sharp(Buffer.from(icon)).png().toFile(join(OUT, "icon-512.png"));
await sharp(Buffer.from(icon)).resize(180, 180).png().toFile(join(OUT, "apple-touch-icon.png"));

console.log("Wrote public/og.png, public/icon-512.png, public/apple-touch-icon.png");
