#!/usr/bin/env node
/**
 * optimize.mjs — turn assets/source/** into responsive AVIF + WebP in public/img.
 *
 * The site's primary visitor is on a mid-range Android over patchy 4G, so this
 * is not optional polish. Source material runs up to 7.5 MB per photo; nothing
 * that large may ever reach a phone.
 *
 * Emits, per image:  <name>-{360,640,960,1280,1920}.avif  + matching .webp
 * Never upscales. Writes public/img/manifest.json with real dimensions so
 * <Picture> can set width/height and avoid layout shift.
 *
 *   node scripts/optimize.mjs            skip work already done
 *   node scripts/optimize.mjs --force    redo everything
 */

import { mkdir, readdir, writeFile, stat, access } from "node:fs/promises";
import { dirname, join, relative, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "assets", "source");
const OUT = join(ROOT, "public", "img");
const FORCE = process.argv.includes("--force");

const WIDTHS = [360, 640, 960, 1280, 1920];

/** Per-directory treatment. Logos keep alpha and never get AVIF blur. */
const RULES = {
  people: { widths: [360, 640], fit: "cover", position: "top", ratio: 3 / 4 },
  members: { widths: [360], contain: true, quality: 82 },
  identity: { widths: [360, 640], contain: true, quality: 88 },
  default: { widths: WIDTHS },
};

const exists = (p) =>
  access(p).then(
    () => true,
    () => false,
  );

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (/\.(jpe?g|png|gif|webp)$/i.test(entry.name)) yield p;
  }
}

async function processOne(file, manifest) {
  const rel = relative(SRC, file).replace(/\\/g, "/");
  const group = rel.split("/")[0];
  const rule = RULES[group] || RULES.default;
  const name = rel.slice(0, -extname(rel).length);
  const isLogo = rule.contain === true;

  const input = sharp(file, { failOn: "none" });
  const meta = await input.metadata();
  if (!meta.width || !meta.height) {
    console.log(`  skip (unreadable)  ${rel}`);
    return;
  }

  const targets = (rule.widths || WIDTHS).filter(
    (w, i, arr) => w <= meta.width || i === 0 || arr[i - 1] < meta.width,
  );

  const outDir = join(OUT, dirname(name));
  await mkdir(outDir, { recursive: true });

  const sources = [];
  let outW = meta.width;
  let outH = meta.height;

  for (const w of targets) {
    const width = Math.min(w, meta.width);
    let pipeline = sharp(file, { failOn: "none" }).rotate();

    if (rule.ratio) {
      // Portraits: consistent 3:4 crop anchored to the top so faces survive.
      const height = Math.round(width / rule.ratio);
      pipeline = pipeline.resize(width, height, {
        fit: "cover",
        position: rule.position || "centre",
      });
      if (w === targets[targets.length - 1]) {
        outW = width;
        outH = height;
      }
    } else {
      pipeline = pipeline.resize({ width, withoutEnlargement: true });
      if (w === targets[targets.length - 1]) {
        const m = await pipeline.clone().toBuffer({ resolveWithObject: true });
        outW = m.info.width;
        outH = m.info.height;
      }
    }

    const q = rule.quality ?? 62;
    const avifPath = join(OUT, `${name}-${width}.avif`);
    const webpPath = join(OUT, `${name}-${width}.webp`);

    if (FORCE || !(await exists(avifPath))) {
      await pipeline
        .clone()
        .avif({ quality: q, effort: 4, chromaSubsampling: isLogo ? "4:4:4" : "4:2:0" })
        .toFile(avifPath);
    }
    if (FORCE || !(await exists(webpPath))) {
      await pipeline
        .clone()
        .webp({ quality: q + 12, effort: 4, alphaQuality: 100 })
        .toFile(webpPath);
    }

    const size = (await stat(avifPath)).size;
    sources.push({ width, bytes: size });
  }

  manifest[name] = {
    widths: sources.map((s) => s.width),
    width: outW,
    height: outH,
  };

  const total = sources.reduce((n, s) => n + s.bytes, 0);
  const largest = sources[sources.length - 1];
  console.log(
    `  ${rel.padEnd(52)} ${String(meta.width).padStart(5)}x${String(meta.height).padEnd(5)}` +
      ` -> ${sources.length} widths, largest AVIF ${(largest.bytes / 1024).toFixed(0)} KB` +
      ` (set ${(total / 1024).toFixed(0)} KB)`,
  );
  return largest.bytes;
}

async function main() {
  if (!(await exists(SRC))) {
    console.error("assets/source is missing — run `npm run harvest` first.");
    process.exit(1);
  }
  await mkdir(OUT, { recursive: true });

  const files = [];
  for await (const f of walk(SRC)) files.push(f);
  files.sort();
  console.log(`Optimizing ${files.length} images -> public/img\n`);

  const manifest = {};
  const heroBudget = [];
  for (const f of files) {
    const largest = await processOne(f, manifest);
    if (largest) heroBudget.push({ file: relative(SRC, f), bytes: largest });
  }

  await writeFile(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));

  const over = heroBudget.filter((h) => h.bytes > 120 * 1024);
  console.log(`\n${Object.keys(manifest).length} images in public/img/manifest.json`);
  if (over.length) {
    console.log(`\n${over.length} exceed the 120 KB largest-AVIF budget:`);
    for (const o of over)
      console.log(`   ${(o.bytes / 1024).toFixed(0).padStart(5)} KB  ${o.file}`);
  } else {
    console.log("All images inside the 120 KB largest-AVIF budget.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
