import { Picture } from "@/components/Picture";
import { members } from "@/lib/content";

/**
 * The member logo wall.
 *
 * Logos sit on bone tiles in their own colours. An earlier version knocked them
 * all to white silhouettes to sit on the ink ground, which looked tidy in the
 * abstract and destroyed about a third of them — several became unreadable
 * blobs. A member organisation's mark is its own; showing it as it is beats
 * showing it as a shape that matches the page.
 */
export function MemberLogos({ limit }: { limit?: number }) {
  const logos = limit ? members.logos.slice(0, limit) : members.logos;

  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
      {logos.map((m) => (
        <li
          key={m.logo}
          className="flex aspect-[3/2] items-center justify-center bg-bone-100 p-4"
          title={m.unidentified ? undefined : m.name}
        >
          <Picture
            src={m.logo}
            alt={m.unidentified ? "" : m.name}
            sizes="180px"
            imgClassName="max-h-full max-w-full object-contain"
          />
        </li>
      ))}
    </ul>
  );
}
