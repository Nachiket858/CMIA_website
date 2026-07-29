/**
 * The Roofline.
 *
 * The CMIA logo's "MIA" is not really lettering — it is a row of gabled peaks,
 * the silhouette of an industrial shed row. The same chevrons appear in the MIA
 * mark of 1989, in blue. This module generates that ridge as geometry so it can
 * be used at any width, with any number of peaks, and with peak heights driven
 * by real content.
 *
 * It is used in exactly three places on the site:
 *   1. the home hero, where each peak is one of the chamber's territories
 *   2. the history and past-presidents spine
 *   3. a 2px rule between major sections
 *
 * Nothing else gets to use it.
 */

export type Peak = {
  /** 0–1, relative to the ridge's height. */
  height: number;
  label?: string;
  id?: string;
};

export type RidgeOptions = {
  width: number;
  height: number;
  peaks: Peak[];
  /** Fraction of each bay the apex is flattened over. 0 = sharp gable. */
  apexFlat?: number;
  /** Leave the valleys above the baseline, as a fraction of height. */
  valleyLift?: number;
};

export type Ridge = {
  /** Open polyline along the ridge — for a stroked line. */
  line: string;
  /** Closed path down to the baseline — for a filled silhouette. */
  fill: string;
  /** Apex coordinate of each peak, for labels and hit targets. */
  apexes: { x: number; y: number; peak: Peak; index: number }[];
  /** Total path length, so CSS can dash-animate the draw. */
  length: number;
};

/**
 * Build a gabled ridge across `width`, one bay per peak.
 *
 * Peaks sit at the centre of their bay; valleys sit on the bay boundaries. The
 * result reads as a row of pitched roofs rather than a chart line, which is the
 * point — the shape carries the chamber's identity, and the peak heights carry
 * whatever the content is.
 */
export function buildRidge({
  width,
  height,
  peaks,
  apexFlat = 0,
  valleyLift = 0,
}: RidgeOptions): Ridge {
  const n = peaks.length;
  if (n === 0) {
    return { line: `M 0 ${height} L ${width} ${height}`, fill: "", apexes: [], length: width };
  }

  const bay = width / n;
  const base = height;
  const valleyY = height - valleyLift * height;

  const pts: [number, number][] = [[0, valleyY]];
  const apexes: Ridge["apexes"] = [];

  peaks.forEach((peak, i) => {
    const centre = bay * (i + 0.5);
    const apexY = base - Math.max(0, Math.min(1, peak.height)) * height;
    const flat = (apexFlat * bay) / 2;

    if (flat > 0) {
      pts.push([centre - flat, apexY], [centre + flat, apexY]);
    } else {
      pts.push([centre, apexY]);
    }
    pts.push([bay * (i + 1), valleyY]);
    apexes.push({ x: centre, y: apexY, peak, index: i });
  });

  const round = (v: number) => Math.round(v * 100) / 100;
  const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${round(x)} ${round(y)}`).join(" ");

  // Straight segments, so the true length is just the sum of the hypotenuses.
  let length = 0;
  for (let i = 1; i < pts.length; i++) {
    length += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  }

  return {
    line: d,
    fill: `${d} L ${round(width)} ${round(base)} L 0 ${round(base)} Z`,
    apexes,
    length: Math.ceil(length),
  };
}

/**
 * A short repeating ridge for the section rule. Deliberately tiny and uniform —
 * it is a rule, not a diagram, so it carries no data.
 */
export function ruleRidge(bays = 24, height = 7, bay = 18): Ridge {
  return buildRidge({
    width: bays * bay,
    height,
    peaks: Array.from({ length: bays }, () => ({ height: 1 })),
  });
}

/**
 * The chamber's territory, west to east, as the hero ridge.
 *
 * Peak heights are a deliberate design choice, not a measurement: the three
 * zones the chamber actually organises itself into stand tallest, and the
 * districts it covers sit lower. There is no membership-per-district data on
 * the old site, so nothing here pretends to be a quantity — the ridge is
 * labelled with places, and the labels are the content.
 */
export const TERRITORY: Peak[] = [
  { id: "waluj", label: "Waluj", height: 0.92 },
  { id: "chikalthana", label: "Chikalthana", height: 0.7 },
  { id: "auric", label: "AURIC", height: 1 },
  { id: "paithan", label: "Paithan", height: 0.52 },
  { id: "jalna", label: "Jalna", height: 0.78 },
  { id: "beed", label: "Beed", height: 0.58 },
  { id: "latur", label: "Latur", height: 0.66 },
];
