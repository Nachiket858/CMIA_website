#!/usr/bin/env node
/**
 * build-images.mjs — get photographs ready for a build, without ever failing it.
 *
 * Photographs are not in git (assets/source and public/img are ignored — ~50 MB
 * between them), so a fresh checkout has none. A deploy therefore has to fetch
 * and convert them, and that means depending on the *old* cmia.co.in being up
 * and reachable from the build machine. It sometimes isn't.
 *
 * This wrapper makes that dependency non-fatal:
 *
 *   1. harvest  — download originals   (allowed to fail)
 *   2. optimize — AVIF/WebP + manifest (allowed to fail)
 *   3. reconcile the manifest with what is actually on disk
 *
 * Step 3 is the part that matters. components/Picture.tsx imports the manifest
 * at build time and renders <img src> straight from it, so an entry whose files
 * are missing becomes a broken image on the live site. Pruning those entries
 * turns a broken image into no image: Picture returns null for anything absent
 * and hasImage() lets each layout fall back to its no-photograph form, which
 * every component on this site already handles.
 *
 * Net effect: a build always succeeds. With the source site reachable it ships
 * the full photography; without it, it ships a text-complete site instead of
 * failing the deployment.
 */

import { spawnSync } from "node:child_process";
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "img");
const MANIFEST = join(OUT, "manifest.json");

const exists = (p) =>
  access(p).then(
    () => true,
    () => false,
  );

/** Run a step, reporting failure rather than propagating it. */
function attempt(label, script) {
  console.log(`\n[images] ${label}`);
  const r = spawnSync(process.execPath, [join(ROOT, "scripts", script)], {
    stdio: "inherit",
    cwd: ROOT,
  });
  const ok = !r.error && r.status === 0;
  if (!ok) {
    const why = r.error ? r.error.message : `exit code ${r.status}`;
    console.warn(`[images] ${label} did not complete (${why}) — continuing.`);
  }
  return ok;
}

/**
 * Drop manifest entries and widths whose files are not on disk.
 *
 * Picture.tsx uses the largest width for the <img> src and every width in the
 * srcset, so a width is only usable if its .webp and .avif both exist.
 */
async function reconcile() {
  await mkdir(OUT, { recursive: true });

  if (!(await exists(MANIFEST))) {
    console.warn("[images] no manifest at all — writing an empty one.");
    await writeFile(MANIFEST, "{}\n");
    return { kept: 0, dropped: 0, empty: true };
  }

  let manifest;
  try {
    manifest = JSON.parse(await readFile(MANIFEST, "utf8"));
  } catch (err) {
    console.warn(`[images] manifest is unreadable (${err.message}) — replacing with an empty one.`);
    await writeFile(MANIFEST, "{}\n");
    return { kept: 0, dropped: 0, empty: true };
  }

  const out = {};
  let dropped = 0;

  for (const [name, entry] of Object.entries(manifest)) {
    const widths = [];
    for (const w of entry.widths ?? []) {
      const haveBoth =
        (await exists(join(OUT, `${name}-${w}.webp`))) &&
        (await exists(join(OUT, `${name}-${w}.avif`)));
      if (haveBoth) widths.push(w);
    }
    if (widths.length === 0) {
      dropped++;
      continue;
    }
    out[name] = { ...entry, widths };
  }

  await writeFile(MANIFEST, `${JSON.stringify(out, null, 2)}\n`);
  return { kept: Object.keys(out).length, dropped, empty: false };
}

attempt("harvest — downloading originals", "harvest.mjs");
attempt("optimize — AVIF/WebP + manifest", "optimize.mjs");

const { kept, dropped } = await reconcile();

console.log(`\n[images] ${kept} usable image${kept === 1 ? "" : "s"} in the manifest.`);
if (dropped) {
  console.warn(
    `[images] ${dropped} entr${dropped === 1 ? "y" : "ies"} pruned — files absent. ` +
      `Those layouts fall back to their no-photograph form.`,
  );
}
if (kept === 0) {
  console.warn(
    "[images] Building with NO photographs. The site will be text-complete but " +
      "image-less. Run `npm run images` locally to check the source site is reachable.",
  );
}
