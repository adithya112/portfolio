import { SiteLink } from "@/components/ui/site-link";
import { Mail, ExternalLink } from "lucide-react";
import { profile, publicContacts } from "@/data/profile";
import { Container } from "./container";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Container className="footer-inner">
        <div>
          <p>{profile.name ?? profile.brand}</p>
          <p className="muted">{profile.location}</p>
        </div>
        {publicContacts.length > 0 && (
          <nav aria-label="Contact links">
            {publicContacts.map((link) => (
              <SiteLink
                className="footer-contact"
                key={link.label}
                href={link.href}
                aria-label={link.label}
                title={link.label}
              >
                <ContactIcon label={link.label} />
              </SiteLink>
            ))}
          </nav>
        )}
        <p className="muted">© {new Date().getFullYear()}</p>
      </Container>
    </footer>
  );
}

function ContactIcon({ label }: { label: string }) {
  if (label === "Email") return <Mail size={20} aria-hidden="true" />;
  if (label === "GitHub")
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.64-1.25-1.64-1.02-.7.08-.68.08-.68 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.29-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.1 1.15a10.8 10.8 0 0 1 5.63 0c2.15-1.45 3.1-1.15 3.1-1.15.61 1.55.23 2.7.11 2.98.72.79 1.16 1.79 1.16 3.02 0 4.32-2.64 5.27-5.15 5.55.4.35.76 1.04.76 2.1v3.12c0 .3.2.65.78.54A11.25 11.25 0 0 0 12 .75Z" />
      </svg>
    );
  if (label === "LinkedIn")
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.45 2H3.55C2.7 2 2 2.68 2 3.52v16.96c0 .84.7 1.52 1.55 1.52h16.9c.85 0 1.55-.68 1.55-1.52V3.52c0-.84-.7-1.52-1.55-1.52ZM7.93 18.75H4.98V9.2h2.95v9.55ZM6.46 7.9a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.29 10.85H15.8V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.5V9.2h2.83v1.31h.04c.39-.74 1.35-1.52 2.79-1.52 2.98 0 3.59 1.96 3.59 4.5v5.26Z" />
      </svg>
    );
  return <ExternalLink size={20} aria-hidden="true" />;
}
