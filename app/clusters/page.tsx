import type { Metadata } from "next";
import { Container, Section, PageHeader, Eyebrow, Panel, Button } from "@/components/Section";
import { Picture } from "@/components/Picture";
import { Pictogram, type PictogramName } from "@/components/Pictogram";
import { Disclosure } from "@/components/Disclosure";
import { Reveal } from "@/components/Reveal";
import { ClusterMap } from "@/components/charts/ClusterMap";
import { clusters, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Clusters",
  description:
    "Seven Common Facility Centre projects under the MSE-CDP scheme: auto components, steel furniture, Paithani, garments, truck body building, bakery and general engineering.",
  alternates: { canonical: "/clusters/" },
};

const PICTOGRAM: Record<string, PictogramName> = {
  "auto-components": "gear-cnc",
  "steel-furniture": "furniture",
  paithani: "loom",
  garment: "stitch",
  "truck-body": "truck-frame",
  bakery: "mixer",
  "general-engineering": "shed",
};

export default function ClustersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Clusters"
        title="Machinery no single small unit could buy alone."
        lede={clusters.intro}
        figures={[
          { value: String(clusters.clusters.length), label: "cluster projects" },
          { value: clusters.schemeValue, label: "MSE-CDP scheme" },
          { value: "4", label: "districts" },
        ]}
      />

      {/* ---------------------------------------------------------- the map */}
      <Section tight>
        <Container>
          <ClusterMap />
        </Container>
      </Section>

      {/* ------------------------------------------------- each cluster */}
      {clusters.clusters.map((c, i) => (
        <Section key={c.id} id={c.id} rule ground={i % 2 === 1 ? "ink-deep" : "ink"}>
          <Container>
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
              {/* Photo first on mobile — it is the fastest way to know what
                  trade this is. */}
              <Reveal className={i % 2 === 1 ? "lg:order-2" : ""}>
                <figure>
                  <Picture
                    src={c.photo}
                    alt={`${c.name} — ${c.summary}`}
                    sizes="(max-width: 1024px) 92vw, 560px"
                    imgClassName="w-full border border-ink-500 object-cover aspect-[4/3]"
                  />
                </figure>

                {"figures" in c && c.figures && (
                  <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
                    {(c.figures as { value: string; label: string }[]).map((f) => (
                      <div key={f.label} className="border-l border-agri/30 pl-3.5">
                        <dd className="tnum font-display text-2xl leading-none font-semibold text-agri-lift">
                          {f.value}
                        </dd>
                        <dt className="mt-1.5 text-xs tracking-wide text-text-lo uppercase">
                          {f.label}
                        </dt>
                      </div>
                    ))}
                  </dl>
                )}
              </Reveal>

              <div>
                <div className="flex items-start gap-3.5">
                  <Pictogram
                    name={PICTOGRAM[c.id] ?? "shed"}
                    className="mt-1 h-8 w-8 shrink-0 text-agri"
                  />
                  <div>
                    <Eyebrow>
                      {c.location} · {c.district}
                    </Eyebrow>
                    <h2 className="mt-2 text-[clamp(1.5rem,4vw,2.2rem)] leading-tight font-semibold">
                      {c.name}
                    </h2>
                  </div>
                </div>

                <p className="measure mt-5 text-[1.02rem] leading-relaxed text-text-mid">
                  {c.summary}
                </p>

                <Panel className="mt-7 p-5 sm:p-6">
                  <h3 className="font-display text-[0.7rem] font-semibold tracking-[0.14em] text-signal-deep uppercase">
                    Purpose of the cluster
                  </h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed">{c.purpose}</p>
                </Panel>

                <div className="mt-6">
                  <Disclosure
                    summary={`What the Common Facility Centre would hold`}
                    meta={`${c.facilities.length} facilities proposed`}
                  >
                    <ul className="space-y-2">
                      {c.facilities.map((f) => (
                        <li key={f} className="flex gap-3">
                          <span
                            aria-hidden="true"
                            className="mt-2 h-1 w-1 shrink-0 bg-agri"
                          />
                          <span className="text-[0.95rem]">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </Disclosure>

                  <Disclosure summary="Why this cluster" meta="The case, as the chamber puts it">
                    <ul className="space-y-2.5">
                      {c.problem.map((p) => (
                        <li key={p.slice(0, 24)} className="flex gap-3">
                          <span
                            aria-hidden="true"
                            className="mt-2 h-1 w-1 shrink-0 bg-clay"
                          />
                          <span className="text-[0.95rem] leading-relaxed">{p}</span>
                        </li>
                      ))}
                    </ul>
                  </Disclosure>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      ))}

      {/* --------------------------------------------------------------- CTA */}
      <Section rule tight>
        <Container>
          <div className="gable-cut-lg border border-agri/25 bg-ink-900 p-7 shadow-[var(--shadow-lg)] sm:p-10">
            <div className="max-w-2xl">
              <Eyebrow>Interested in a cluster</Eyebrow>
              <h2 className="mt-3 text-[clamp(1.4rem,3.6vw,2rem)] font-semibold">
                Talk to the chamber about joining one
              </h2>
              <p className="mt-3 leading-relaxed text-text-mid">
                Cluster projects run under the {clusters.scheme}. The office can tell you which
                are open and what a member unit needs to do.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button href="/contact/">Contact the chamber</Button>
                <Button href="/membership/" variant="outline">
                  Become a member
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
