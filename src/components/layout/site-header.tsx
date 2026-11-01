import Link from "next/link";
import { Braces } from "lucide-react";
import { profile } from "@/data/profile";
import { Container } from "./container";
import { MobileNav } from "./mobile-nav";

// Add routes only when their phase is complete. No links to unfinished pages.
export const navigation = [
  { label: "Work", href: "/work" },
  { label: "Writing", href: "/writing" },
  { label: "About", href: "/about" },
  { label: "Resume", href: "/resume" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <Container className="header-inner">
        <Link className="brand" href="/" aria-label={`${profile.name ?? profile.brand} — home`}>
          <Braces size={23} aria-hidden="true" />
          <span>{profile.name ?? profile.brand}</span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <MobileNav items={navigation} />
      </Container>
    </header>
  );
}
