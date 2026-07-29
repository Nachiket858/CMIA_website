import type { Metadata } from "next";
import { Container, Section, PageHeader, SectionHead, Eyebrow } from "@/components/Section";
import { GalleryGrid, AlbumStrip } from "@/components/GalleryGrid";
import { allPhotos, gallery, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    `${allPhotos.length} photographs of CMIA's work — CXO roundtables, government meetings, ` +
    `investment agreements, skill programmes, the clusters and Bajaj Bhavan.`,
  alternates: { canonical: "/gallery/" },
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="The chamber, photographed."
        lede="Roundtables, delegations, agreements, training sessions and the trades the clusters serve."
        figures={[
          { value: String(allPhotos.length), label: "photographs" },
          { value: String(gallery.albums.length), label: "albums" },
        ]}
      />

      <Section tight>
        <Container>
          <GalleryGrid />
        </Container>
      </Section>

      <Section rule ground="ink-deep">
        <Container>
          <SectionHead eyebrow="By album" title="Browse by event" />
          <div className="mt-10">
            <AlbumStrip />
          </div>
        </Container>
      </Section>

      <Section rule tight>
        <Container>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
            <div className="max-w-xl">
              <Eyebrow>Video</Eyebrow>
              <h2 className="mt-3 text-[clamp(1.3rem,3.4vw,1.8rem)] font-semibold">
                Video lives on the chamber&rsquo;s YouTube channel
              </h2>
              <p className="mt-3 leading-relaxed text-text-mid">
                The old site had a video gallery page with nothing in it. Rather than repeat an
                empty page, video points to where the chamber actually posts.
              </p>
              <p className="mt-5">
                <a
                  href={site.social.find((s) => s.network === "YouTube")!.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border-b border-brass/40 pb-1 text-sm font-medium text-brass-lift hover:border-brass hover:text-text-hi"
                >
                  CMIA on YouTube <span aria-hidden="true">↗</span>
                </a>
              </p>
            </div>

            <div className="border-l border-brass/30 pl-5 lg:pl-6">
              <Eyebrow>Adding photographs</Eyebrow>
              <p className="mt-2.5 text-sm leading-relaxed text-text-lo">
                The chamber&rsquo;s old photo gallery held five albums of one picture each.
                Everything usable from the old site has been brought across and grouped into{" "}
                {gallery.albums.length} albums here. New photographs go into a folder and an
                entry in the gallery content file — the office has a short guide.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
