import Link from "next/link";
import type { ComponentProps } from "react";

export function ButtonLink({
  className = "",
  variant = "primary",
  ...props
}: ComponentProps<typeof Link> & { variant?: "primary" | "secondary" }) {
  return <Link className={`button button-${variant} ${className}`} {...props} />;
}
