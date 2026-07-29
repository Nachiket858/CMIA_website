/**
 * Old URL -> new URL. The single source of truth for redirects.
 *
 * Every page that existed on the PHP site is here, so no inbound link or search
 * result breaks. `scripts/build-redirects.mjs` turns this list into the three
 * host config files (Apache, Netlify/Cloudflare, Vercel), because a static
 * export cannot serve redirects itself.
 */
export const REDIRECTS: { from: string; to: string }[] = [
  { from: "/index.php", to: "/" },

  // About
  { from: "/frontend/about_us.php", to: "/about/" },
  { from: "/frontend/history.php", to: "/about/history/" },
  { from: "/frontend/vision&policy.php", to: "/about/#vision" },
  { from: "/frontend/vision%26policy.php", to: "/about/#vision" },

  // Leadership
  { from: "/frontend/cmia_management.php", to: "/leadership/" },
  { from: "/frontend/president_message.php", to: "/leadership/#presidents-message" },
  { from: "/frontend/past_president.php", to: "/leadership/past-presidents/" },

  // What we do
  { from: "/frontend/services.php", to: "/what-we-do/" },
  { from: "/frontend/cluster.php", to: "/clusters/" },
  { from: "/frontend/cmia_initiative.php", to: "/initiatives/" },
  { from: "/frontend/skill_hub.php", to: "/initiatives/skill-hub/" },
  { from: "/training_program.php", to: "/initiatives/training/" },

  // Venue
  { from: "/frontend/infrastructure.php", to: "/venue/" },
  { from: "/frontend/hall_booking.php", to: "/venue/#book" },

  // Membership
  { from: "/membership.php", to: "/membership/" },

  // Events and media
  { from: "/frontend/upcoming_event.php", to: "/events/" },
  { from: "/frontend/past_event.php", to: "/events/" },
  { from: "/frontend/photo_gallery.php", to: "/gallery/" },
  { from: "/frontend/photo_gallaryimg.php", to: "/gallery/" },
  { from: "/frontend/video_gallery.php", to: "/gallery/" },
  { from: "/frontend/press_room.php", to: "/news/#press" },
  { from: "/frontend/circulars.php", to: "/news/#circular" },
  { from: "/frontend/newsletters.php", to: "/news/#publication" },

  // Everything else
  { from: "/frontend/importantlink.php", to: "/resources/" },
  { from: "/frontend/contact.php", to: "/contact/" },
  { from: "/login.php", to: "/members/login/" },
];

/** Routes for the sitemap, most important first. */
export const ROUTES = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/about/", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/about/history/", priority: 0.7, changeFrequency: "yearly" as const },
  { path: "/leadership/", priority: 0.9, changeFrequency: "yearly" as const },
  { path: "/leadership/past-presidents/", priority: 0.6, changeFrequency: "yearly" as const },
  { path: "/what-we-do/", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/clusters/", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/initiatives/", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/initiatives/skill-hub/", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/initiatives/training/", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/membership/", priority: 1.0, changeFrequency: "monthly" as const },
  { path: "/membership/apply/", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/events/", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/gallery/", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/news/", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/venue/", priority: 0.6, changeFrequency: "yearly" as const },
  { path: "/resources/", priority: 0.4, changeFrequency: "yearly" as const },
  { path: "/contact/", priority: 0.8, changeFrequency: "yearly" as const },
];
