import { profile } from "@/data/profile";

export type SiteSettings = { origin: string | null; indexable: boolean };

export function resolveSiteSettings(
  siteUrl: string | null | undefined,
  deploymentEnvironment?: string,
): SiteSettings {
  const value = siteUrl?.trim();
  if (!value) return { origin: null, indexable: false };
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an absolute HTTPS production origin");
  }
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== "/"
  ) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be an HTTPS origin without a path, query or credentials",
    );
  }
  return { origin: url.origin, indexable: deploymentEnvironment === "production" };
}

export function getSiteSettings(): SiteSettings {
  return resolveSiteSettings(profile.siteUrl, process.env.VERCEL_ENV);
}

export function absoluteSiteUrl(
  pathname: string,
  settings = getSiteSettings(),
): string | undefined {
  if (!pathname.startsWith("/") || pathname.startsWith("//"))
    throw new Error("Site paths must be root-relative");
  return settings.origin ? new URL(pathname, settings.origin).href : undefined;
}
