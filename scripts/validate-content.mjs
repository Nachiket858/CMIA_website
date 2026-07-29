#!/usr/bin/env node
/**
 * validate-content.mjs — check content/*.json before a build.
 *
 * Written for whoever edits the JSON, not for whoever wrote the site. Every
 * failure names the file, the exact path to the field, what is wrong, and what
 * a correct value looks like. Runs automatically on `npm run build`.
 */

import { readFile, readdir, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = join(ROOT, "content");
const IMG = join(ROOT, "public", "img");

const problems = [];
const warnings = [];
const placeholders = [];

const fail = (file, path, msg, example) =>
  problems.push({ file, path, msg, example });
const warn = (file, msg) => warnings.push({ file, msg });

/* ------------------------------------------------------------- schemas */

const photo = z.string().min(1).nullable().optional();

const person = z.object({
  name: z.string().min(2),
  role: z.string().min(2),
  photo: photo,
});

const schemas = {
  "site.json": z.object({
    name: z.string().min(3),
    shortName: z.string().min(2),
    foundedYear: z.number().int().min(1900).max(2100),
    yearsActive: z.number().int().min(1).max(200),
    stats: z.object({ members: z.string(), presidentialTerms: z.number() }),
    address: z.object({
      line1: z.string(),
      city: z.string(),
      pincode: z.string().regex(/^\d{6}$/, "a six-digit PIN code"),
      state: z.string(),
    }),
    contact: z.object({
      phone: z.string().min(8),
      emails: z
        .array(z.object({ label: z.string(), address: z.string().email() }))
        .min(1),
      hours: z.string(),
      geo: z.object({ lat: z.number(), lng: z.number() }),
    }),
    social: z.array(z.object({ network: z.string(), url: z.string().url() })),
    affiliations: z.array(
      z.object({ name: z.string(), abbr: z.string(), url: z.string().url() }),
    ),
    focus: z.array(z.object({ title: z.string(), detail: z.string() })).min(1),
  }),

  "office-bearers.json": z.object({
    term: z.string().regex(/^\d{4}-\d{2}$/, 'a term like "2026-27"'),
    presidentsMessage: z.object({
      byName: z.string(),
      body: z.array(z.string()).min(1),
    }),
    groups: z
      .array(
        z.object({
          id: z.string(),
          title: z.string(),
          people: z.array(person).min(1),
        }),
      )
      .min(1),
  }),

  "past-presidents.json": z.object({
    terms: z
      .array(
        z.object({
          year: z
            .string()
            .regex(/^\d{4}-(\d{2}|\d{4})$/, 'a term like "2025-26" or "1999-2000"'),
          president: z.string().min(3),
          secretary: z.string().min(3),
        }),
      )
      .min(1),
  }),

  "timeline.json": z.object({
    eras: z
      .array(
        z.object({
          id: z.string(),
          abbr: z.string(),
          name: z.string(),
          from: z.number().int(),
          to: z.number().int().nullable(),
        }),
      )
      .min(1),
    milestones: z
      .array(
        z.object({
          year: z.number().int().min(1900).max(2100),
          title: z.string().min(3),
        }),
      )
      .min(1),
    vision: z.object({ statement: z.string().min(10) }),
  }),

  "clusters.json": z.object({
    clusters: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          location: z.string(),
          x: z.number().min(0).max(100),
          y: z.number().min(0).max(100),
          purpose: z.string().min(10),
          facilities: z.array(z.string()).min(1),
          photo: photo,
        }),
      )
      .min(1),
  }),

  "membership.json": z.object({
    gstPercent: z.number().min(0).max(100),
    classes: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          annual: z.number().int().positive("a number of rupees, e.g. 3000"),
          admission: z.number().int().nonnegative(),
        }),
      )
      .min(1),
    tenures: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          years: z.number().int().positive(),
          annualMultiple: z.number().positive(),
        }),
      )
      .min(1),
    benefits: z.array(z.object({ title: z.string(), detail: z.string() })).min(1),
  }),

  "services.json": z.object({
    strands: z
      .array(
        z.object({
          id: z.string(),
          title: z.string(),
          items: z.array(z.object({ title: z.string(), detail: z.string() })).min(1),
        }),
      )
      .min(1),
  }),

  "initiatives.json": z.object({
    initiatives: z
      .array(z.object({ id: z.string(), title: z.string(), summary: z.string() }))
      .min(1),
    skillHub: z.object({
      name: z.string(),
      facilities: z.array(z.object({ title: z.string() })).min(1),
      gallery: z.array(z.object({ photo: z.string(), caption: z.string() })),
    }),
  }),

  "events.json": z.object({
    categories: z.array(z.object({ id: z.string(), label: z.string() })).min(1),
    upcoming: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        dateStart: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, "a date like 2026-02-20"),
        category: z.string(),
      }),
    ),
    archive: z
      .array(
        z.object({ id: z.string(), title: z.string(), category: z.string() }),
      )
      .min(1),
  }),

  "gallery.json": z.object({
    albums: z
      .array(
        z.object({
          id: z.string(),
          title: z.string(),
          category: z.string(),
          cover: z.string(),
          photos: z
            .array(
              z.object({
                file: z.string(),
                alt: z
                  .string()
                  .min(10, "alt text describing the picture, at least a short sentence"),
              }),
            )
            .min(1),
        }),
      )
      .min(1),
  }),

  "news.json": z.object({
    items: z.array(
      z.object({
        id: z.string(),
        type: z.enum(["circular", "press", "publication"]),
        title: z.string(),
      }),
    ),
    types: z.array(
      z.object({ id: z.string(), label: z.string(), emptyMessage: z.string() }),
    ),
  }),

  "resources.json": z.object({
    groups: z
      .array(
        z.object({
          id: z.string(),
          title: z.string(),
          links: z
            .array(
              z.object({
                label: z.string(),
                url: z.string().url("a full URL starting with https://"),
              }),
            )
            .min(1),
        }),
      )
      .min(1),
  }),

  "venue.json": z.object({
    building: z.object({ name: z.string(), address: z.string() }),
    rooms: z.array(z.object({ id: z.string(), name: z.string() })).min(1),
  }),

  "members.json": z.object({
    logos: z.array(z.object({ name: z.string(), logo: z.string() })).min(1),
  }),
};

/* ------------------------------------------------------------- checks */

const exists = (p) =>
  access(p).then(
    () => true,
    () => false,
  );

/** Walk any structure and collect every `photo`/`cover`/`file`/`logo` value. */
function collectImageRefs(node, file, path = "") {
  const refs = [];
  const KEYS = new Set(["photo", "cover", "file", "logo", "image"]);
  const walk = (n, p) => {
    if (Array.isArray(n)) return n.forEach((v, i) => walk(v, `${p}[${i}]`));
    if (n && typeof n === "object") {
      for (const [k, v] of Object.entries(n)) {
        if (k.startsWith("_")) continue;
        const np = p ? `${p}.${k}` : k;
        if (KEYS.has(k) && typeof v === "string" && v && !v.startsWith("http")) {
          refs.push({ ref: v, path: np });
        } else walk(v, np);
      }
    }
  };
  walk(node, path);
  return refs;
}

/** Collect every editor note that flags a placeholder, for the summary. */
function collectPlaceholders(node, file) {
  const walk = (n) => {
    if (Array.isArray(n)) return n.forEach(walk);
    if (n && typeof n === "object") {
      for (const [k, v] of Object.entries(n)) {
        if (
          k.startsWith("_") &&
          typeof v === "string" &&
          /PLACEHOLDER/i.test(v)
        ) {
          placeholders.push({ file, key: k, note: v });
        } else walk(v);
      }
    }
  };
  walk(node);
}

async function main() {
  const files = (await readdir(CONTENT)).filter((f) => f.endsWith(".json")).sort();

  const manifestPath = join(IMG, "manifest.json");
  const onDisk = (await exists(manifestPath))
    ? JSON.parse(await readFile(manifestPath, "utf8"))
    : null;

  /*
    An empty manifest means the image pipeline could not run — no photographs
    were harvested, so scripts/build-images.mjs pruned every entry. That is a
    statement about the environment (the source site was unreachable), not
    about the content, so image references go unchecked exactly as they do when
    the manifest file is absent altogether. Checking them here would fail the
    build with 146 "missing image" errors for content that is perfectly correct.

    A populated manifest still gets the full check, so a mistyped photo path is
    caught in normal use.
  */
  const manifest = onDisk && Object.keys(onDisk).length > 0 ? onDisk : null;
  if (!manifest) {
    warn(
      "public/img/manifest.json",
      onDisk
        ? "Image manifest is empty, so image references were not checked. Run `npm run images`."
        : "Image manifest is missing, so image references were not checked. Run `npm run images`.",
    );
  }

  const data = {};

  for (const file of files) {
    let parsed;
    try {
      parsed = JSON.parse(await readFile(join(CONTENT, file), "utf8"));
    } catch (err) {
      fail(
        file,
        "(whole file)",
        `This file is not valid JSON — ${err.message}`,
        'Check for a missing comma between entries, or a trailing comma after the last one. JSON needs double quotes around every name and text value: { "title": "Annual General Meeting" }',
      );
      continue;
    }
    data[file] = parsed;
    collectPlaceholders(parsed, file);

    const schema = schemas[file];
    if (!schema) {
      warn(file, "No schema defined for this file, so only its JSON syntax was checked.");
      continue;
    }

    const result = schema.safeParse(parsed);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const path = issue.path.join(".") || "(top level)";
        let msg = issue.message;
        let example = "";
        if (issue.code === "invalid_type" && issue.received === "undefined") {
          msg = `Required field "${issue.path.at(-1)}" is missing.`;
          example = `Add it inside ${issue.path.slice(0, -1).join(".") || "the top level"}.`;
        } else if (issue.code === "too_small") {
          example = `Needs at least ${issue.minimum} ${issue.origin === "array" ? "entries" : "characters"}.`;
        }
        fail(file, path, msg, example);
      }
    }

    // Image references must resolve to something the optimizer produced.
    if (manifest) {
      for (const { ref, path } of collectImageRefs(parsed, file)) {
        if (!manifest[ref]) {
          fail(
            file,
            path,
            `Image "${ref}" has no optimized version.`,
            "The value should be the path under assets/source/ with no file extension — e.g. \"people/anuj-bansal\" for assets/source/people/anuj-bansal.jpg. Add the file, then run `npm run images`. Use null if there is no photograph yet.",
          );
        }
      }
    }
  }

  /* ------------------------------------------- cross-file consistency */

  const bearers = data["office-bearers.json"];
  const presidents = data["past-presidents.json"];
  if (bearers && presidents) {
    const president = bearers.groups
      ?.flatMap((g) => g.people ?? [])
      .find((p) => p.role === "President");
    const currentRow = presidents.terms?.find((t) => t.current);
    if (president && currentRow && currentRow.president !== undefined) {
      const a = president.name.replace(/^(Shri|Smt|Dr|Capt|Cdr)\.?\s*/i, "").trim();
      const b = currentRow.president.replace(/^(Shri|Smt|Dr|Capt|Cdr)\.?\s*/i, "").trim();
      if (a !== b) {
        warn(
          "office-bearers.json / past-presidents.json",
          `The President in office-bearers.json is "${president.name}" but the term marked \`current\` in past-presidents.json is "${currentRow.president}". One of them needs updating.`,
        );
      }
    }
    if (bearers.term && currentRow && bearers.term !== currentRow.year) {
      warn(
        "office-bearers.json / past-presidents.json",
        `Term mismatch: office-bearers.json says "${bearers.term}", past-presidents.json's current row says "${currentRow.year}".`,
      );
    }
  }

  // Events must use a category that exists.
  const ev = data["events.json"];
  if (ev?.categories) {
    const valid = new Set(ev.categories.map((c) => c.id));
    for (const list of ["upcoming", "archive"]) {
      for (const [i, item] of (ev[list] ?? []).entries()) {
        if (item.category && !valid.has(item.category)) {
          fail(
            "events.json",
            `${list}[${i}].category`,
            `"${item.category}" is not a known category.`,
            `Use one of: ${[...valid].join(", ")}`,
          );
        }
      }
    }
    const ids = (ev.archive ?? []).map((a) => a.id);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    if (dupes.length)
      fail("events.json", "archive[].id", `Duplicate ids: ${[...new Set(dupes)].join(", ")}`, "Every id must be unique.");
  }

  // Name spellings that differ across the presidents table.
  if (presidents?.terms) {
    const names = new Set();
    for (const t of presidents.terms) {
      names.add(t.president);
      names.add(t.secretary);
    }
    const norm = (s) =>
      s
        .toLowerCase()
        .replace(/^(shri|smt|dr|capt|cdr)\.?\s*/, "")
        .replace(/\(retd\)/, "")
        .replace(/[^a-z]/g, "");

    // Levenshtein, capped — two names within 2 edits are probably one person.
    const distance = (a, b) => {
      if (Math.abs(a.length - b.length) > 2) return 99;
      let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
      for (let i = 1; i <= a.length; i++) {
        const cur = [i];
        for (let j = 1; j <= b.length; j++) {
          cur[j] = Math.min(
            prev[j] + 1,
            cur[j - 1] + 1,
            prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
          );
        }
        prev = cur;
      }
      return prev[b.length];
    };

    const list = [...names].map((raw) => ({ raw, n: norm(raw) }));
    const reported = new Set();
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i];
        const b = list[j];
        if (a.n === b.n || a.n.length < 6) continue;
        const d = distance(a.n, b.n);
        if (d > 0 && d <= 2) {
          const key = [a.raw, b.raw].sort().join("|");
          if (reported.has(key)) continue;
          reported.add(key);
          warn(
            "past-presidents.json",
            `"${a.raw}" and "${b.raw}" differ by ${d} character${d > 1 ? "s" : ""} — probably the same person. ` +
              `If so, spell them identically so the secretary-to-president pipeline links up.`,
          );
        }
      }
    }
  }

  /* -------------------------------------------------------- reporting */

  const line = "-".repeat(72);

  if (problems.length) {
    console.error(`\n${problems.length} problem${problems.length > 1 ? "s" : ""} to fix:\n`);
    let last = "";
    for (const p of problems) {
      if (p.file !== last) {
        console.error(`${line}\ncontent/${p.file}`);
        last = p.file;
      }
      console.error(`\n  at  ${p.path}`);
      console.error(`  ->  ${p.msg}`);
      if (p.example) console.error(`      ${p.example}`);
    }
    console.error(`\n${line}\n`);
  }

  if (warnings.length) {
    console.warn(`${warnings.length} thing${warnings.length > 1 ? "s" : ""} worth a look:\n`);
    for (const w of warnings) console.warn(`  ${w.file}\n    ${w.msg}\n`);
  }

  if (placeholders.length) {
    console.log(
      `${placeholders.length} marked placeholder${placeholders.length > 1 ? "s" : ""} ` +
        `— content the old site never had, waiting on the chamber:\n`,
    );
    for (const p of placeholders) {
      console.log(`  content/${p.file}  ${p.key}`);
      console.log(`    ${p.note.replace(/^PLACEHOLDER[^—-]*[—-]\s*/i, "").slice(0, 150)}\n`);
    }
  }

  if (problems.length) {
    console.error("Content is not valid. Fix the problems above and run `npm run validate` again.");
    process.exit(1);
  }
  console.log(`Content is valid. ${files.length} files checked.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
