"use client";

import { useMemo, useState } from "react";
import { FilterBar } from "@/components/FilterBar";
import { PhotoRecord } from "@/components/Cards";
import { Reveal } from "@/components/Reveal";
import { Pictogram, type PictogramName } from "@/components/Pictogram";
import { events, archive, archiveCounts, type ArchiveItem } from "@/lib/content";

/**
 * The chamber's record of past work — 51 entries recovered from the old CMIA in
 * Action page.
 *
 * Most have no photograph (the old site's event images are gone from its
 * server), so the archive is designed to read well without them: category
 * pictograms and typography carry the grid, and the photographed records get a
 * strip of their own at the top.
 */
export function EventArchive() {
  const [filter, setFilter] = useState("all");

  const shown = useMemo(
    () => (filter === "all" ? archive : archive.filter((a) => a.category === filter)),
    [filter],
  );

  const withPhotos = shown.filter((a): a is ArchiveItem & { photo: string } => Boolean(a.photo));
  const withoutPhotos = shown.filter((a) => !a.photo);

  const categoryOf = (id: string) => events.categories.find((c) => c.id === id);

  return (
    <div>
      <FilterBar
        ariaLabel="Filter the archive by kind of work"
        options={events.categories.map((c) => ({
          id: c.id,
          label: c.label,
          count: archiveCounts[c.id],
        }))}
        value={filter}
        onChange={setFilter}
        allLabel="Everything"
        allCount={archive.length}
      />

      <p className="tnum mt-5 text-sm text-text-lo" aria-live="polite">
        {shown.length} {shown.length === 1 ? "record" : "records"}
        {withPhotos.length > 0 && `, ${withPhotos.length} photographed`}
      </p>

      {/* Photographed records lead. */}
      {withPhotos.length > 0 && (
        <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {withPhotos.map((a, i) => (
            <Reveal as="li" key={a.id} delay={Math.min(i * 45, 300)}>
              <PhotoRecord
                title={a.title}
                detail={a.detail}
                meta={a.dateLabel}
                category={categoryOf(a.category)?.label}
                photo={a.photo}
              />
            </Reveal>
          ))}
        </ul>
      )}

      {/* The rest as a dense typographic record. This is the honest form for
          content that has a caption and no image. */}
      {withoutPhotos.length > 0 && (
        <ul className="mt-8 grid gap-x-8 border-t border-ink-600 sm:grid-cols-2">
          {withoutPhotos.map((a) => {
            const cat = categoryOf(a.category);
            return (
              <li
                key={a.id}
                className="group border-b border-ink-700 py-4 transition-colors duration-200"
              >
                <div className="flex gap-3.5">
                  <Pictogram
                    name={(cat?.pictogram ?? "shed") as PictogramName}
                    className="mt-0.5 h-5 w-5 shrink-0 text-agri transition-colors duration-200 group-hover:text-agri-lift"
                  />
                  <div className="min-w-0">
                    <h3 className="text-[0.98rem] leading-snug font-medium text-text-hi">
                      {a.title}
                    </h3>
                    {a.dateLabel && (
                      <p className="tnum mt-1 text-xs text-agri">{a.dateLabel}</p>
                    )}
                    {a.detail && (
                      <p className="mt-1.5 text-[0.88rem] leading-relaxed text-text-mid">
                        {a.detail}
                      </p>
                    )}
                    <p className="mt-1.5 text-[0.7rem] tracking-wide text-text-lo uppercase">
                      {cat?.label}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {shown.length === 0 && (
        <div className="sheet-in mt-8 rounded-md border border-dashed border-ink-500 p-8 text-center">
          <p className="text-text-mid">No records in this category yet.</p>
        </div>
      )}
    </div>
  );
}
