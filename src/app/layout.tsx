import type { Metadata, Viewport } from "next";
import { createPageMetadata, getPersonSchema, siteTitle, siteDescription } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/site";
import { StructuredData } from "@/components/seo/structured-data";
import { profile } from "@/data/profile";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import "@/styles/globals.css";

export const metadata: Metadata = {
  ...createPageMetadata({ title: siteTitle, description: siteDescription, path: "/" }),
  title: { default: siteTitle, template: `%s | ${profile.name ?? profile.brand}` },
  ...(getSiteSettings().origin ? { metadataBase: new URL(getSiteSettings().origin!) } : {}),
  authors: [{ name: profile.name ?? profile.brand }],
};
export const viewport: Viewport = { themeColor: "#0b1118", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <StructuredData data={getPersonSchema()} />
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
