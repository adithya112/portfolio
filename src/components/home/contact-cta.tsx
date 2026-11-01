import { SiteLink } from "@/components/ui/site-link";
import { ArrowUpRight } from "lucide-react";
import { profile, publicContacts } from "@/data/profile";
import { SectionHeading } from "@/components/ui/section-heading";

export function ContactCta({
  contacts = [
    ...publicContacts,
    ...(profile.resumePath ? [{ label: "Resume", href: "/resume" }] : []),
  ],
}: {
  contacts?: readonly { label: string; href: string }[];
}) {
  if (contacts.length === 0) return null;
  return (
    <section id="contact" className="home-section contact-cta" aria-labelledby="contact-title">
      <SectionHeading id="contact-title" eyebrow="Contact">
        Let’s talk engineering.
      </SectionHeading>
      <nav className="contact-actions" aria-label="Get in touch">
        {contacts.map((contact) => (
          <SiteLink className="button button-secondary" key={contact.label} href={contact.href}>
            {contact.label}
            <ArrowUpRight size={16} aria-hidden="true" />
          </SiteLink>
        ))}
      </nav>
    </section>
  );
}
