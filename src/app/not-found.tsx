import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <Container className="not-found">
      <p className="eyebrow">404 / Page not found</p>
      <h1>No route here.</h1>
      <p className="intro">This page could not be found. Return to the portfolio homepage.</p>
      <ButtonLink href="/">Return home</ButtonLink>
    </Container>
  );
}
