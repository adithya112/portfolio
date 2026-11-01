import type { ComponentProps } from "react";

/** Keep local navigation in place; announce external browsing contexts. */
export function SiteLink({
  href,
  children,
  newTab = false,
  "aria-label": label,
  ...props
}: ComponentProps<"a"> & { newTab?: boolean }) {
  const opensNewTab = newTab || /^https?:\/\//i.test(href ?? "");
  return (
    <a
      {...props}
      href={href}
      target={opensNewTab ? "_blank" : undefined}
      rel={opensNewTab ? "noopener noreferrer" : undefined}
      aria-label={label && opensNewTab ? `${label} (opens in a new tab)` : label}
    >
      {children}
      {opensNewTab && !label && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
