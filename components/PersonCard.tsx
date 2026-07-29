import { Picture, PhotoFrame, hasImage } from "@/components/Picture";

type Person = {
  name: string;
  role: string;
  photo?: string | null;
  lead?: boolean;
  isCoChair?: boolean;
};

/** Initials, for the fallback. Handles "Shri.", "Smt", "Dr", "Capt", "Cdr". */
function initials(name: string) {
  return name
    .replace(/^(Shri|Smt|Dr|Capt|Cdr)\.?\s*/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * One person.
 *
 * Names and designations here are long — "Shri. Shankar R. Jhunjhunwala",
 * "Head — Business Facilitation Cell" — so the card gives the name up to two
 * lines and the role up to two more, and reserves the height either way so a
 * grid of them never goes ragged.
 */
export function PersonCard({
  person,
  size = "default",
}: {
  person: Person;
  size?: "default" | "lead" | "compact";
}) {
  const showPhoto = hasImage(person.photo);
  const lead = size === "lead";
  const compact = size === "compact";

  return (
    <figure className="group">
      <PhotoFrame
        ratio="3/4"
        className="gable-cut border border-ink-500 transition-colors duration-300 group-hover:border-brass/45"
      >
        {showPhoto ? (
          <Picture
            src={person.photo!}
            alt={`${person.name}, ${person.role}`}
            sizes={
              lead
                ? "(max-width: 640px) 88vw, 380px"
                : "(max-width: 480px) 44vw, (max-width: 1024px) 30vw, 220px"
            }
            imgClassName="media-zoom h-full w-full object-cover object-top grayscale-[15%] transition-[filter] duration-500 group-hover:grayscale-0"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-ink-600"
            aria-hidden="true"
          >
            <span className="font-display text-3xl font-semibold text-clay transition-colors duration-300 group-hover:text-brass">
              {initials(person.name)}
            </span>
          </div>
        )}

        {/* A brass hairline along the base ties the grid together. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-brass/35" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink-900/45 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        {person.lead && (
          <div className="absolute top-0 left-0 bg-signal px-2.5 py-1 font-display text-[0.62rem] font-semibold tracking-[0.12em] text-ink-900 uppercase">
            President
          </div>
        )}
      </PhotoFrame>

      <figcaption className={compact ? "pt-2.5" : "pt-3.5"}>
        <p
          className={`font-display leading-tight font-semibold text-text-hi ${
            lead ? "text-xl" : compact ? "text-[0.9rem]" : "text-[1.02rem]"
          }`}
        >
          {person.name}
        </p>
        <p
          className={`mt-1 leading-snug ${
            person.isCoChair ? "text-text-lo" : "text-brass"
          } ${lead ? "text-sm" : "text-[0.8rem]"}`}
        >
          {person.role}
        </p>
      </figcaption>
    </figure>
  );
}

/** Grid that holds its shape from 360px (2 across) to desktop (5 across). */
export function PersonGrid({
  people,
  compact = false,
}: {
  people: Person[];
  compact?: boolean;
}) {
  return (
    <ul
      className={`grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:gap-x-6 ${
        compact ? "xl:grid-cols-5" : "lg:grid-cols-4"
      }`}
    >
      {people.map((p) => (
        <li key={`${p.name}-${p.role}`}>
          <PersonCard person={p} size={compact ? "compact" : "default"} />
        </li>
      ))}
    </ul>
  );
}
