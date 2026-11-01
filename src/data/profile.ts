export type PublicProfile = {
  name: string | null;
  brand: string;
  role: string;
  location: string;
  email: string | null;
  github: string | null;
  linkedin: string | null;
  siteUrl: string | null;
  resumePath: string | null;
  publication: { employers: boolean; metrics: boolean; diagrams: boolean };
};

// Public identity and PDF supplied by the owner. Domain and publication settings remain explicit.
export const profile: PublicProfile = {
  name: "Adithya G S",
  brand: "Engineering portfolio",
  role: "Backend Software Engineer",
  location: "Bengaluru, India",
  email: "adithyaaadi563@gmail.com",
  github: "https://github.com/adithya112",
  linkedin: "https://www.linkedin.com/in/adithya-g-s-ab3a10191",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.trim() || null,
  resumePath: "/resume.pdf",
  publication: { employers: false, metrics: false, diagrams: false },
};

export const publicContacts = [
  ...(profile.email ? [{ label: "Email", href: `mailto:${profile.email}` }] : []),
  ...(profile.github ? [{ label: "GitHub", href: profile.github }] : []),
  ...(profile.linkedin ? [{ label: "LinkedIn", href: profile.linkedin }] : []),
];
