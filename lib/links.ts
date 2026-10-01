// One source of truth for outbound links, used by the footer, the
// "Keep going" row and the Overnight CTO card. Change a URL here once.

export const LINKS = {
  founderOs: {
    title: "Founder OS",
    description: "Run your startup ops in one place.",
    href: "https://crework-founderos.vercel.app",
  },
  newsletter: {
    title: "Idea to Impact",
    description: "A newsletter on building from zero.",
    href: "https://substack.com/@ideatoimpactbysj",
  },
  creworkLabs: {
    title: "Crework Labs",
    description: "See everything else we build for founders.",
    href: "https://www.creworklabs.com",
  },
  overnightCto: {
    title: "Overnight CTO",
    description: "Production MVPs in 3 to 4 weeks.",
    href: "https://www.creworklabs.com/overnight-cto",
  },
} as const;

export type LinkKey = keyof typeof LINKS;
