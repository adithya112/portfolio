import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";
import { ContactCta } from "@/components/home/contact-cta";
import { SelectedWriting } from "@/components/home/selected-writing";
import type { ArticleMetadata } from "@/data/writing";

describe("homepage with current publication clearance", () => {
  it("shows actual engineering summaries and a usable work action", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Engineering reliable systems at scale.",
    );
    expect(screen.getByRole("link", { name: "Explore my work" })).toHaveAttribute("href", "#work");
    const work = screen.getByRole("region", { name: /Production problems/ });
    expect(within(work).getAllByRole("article")).toHaveLength(3);
    expect(within(work).getAllByRole("link")).toHaveLength(3);
    expect(screen.getByRole("heading", { name: /Hands-on engineering/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "The tools behind the work." })).toBeInTheDocument();
  });

  it("shows completed writing and resume actions without numerical outcome claims", () => {
    const { container } = render(<HomePage />);
    expect(screen.getByRole("link", { name: "View resume" })).toHaveAttribute("href", "/resume");
    expect(screen.getByRole("region", { name: /Let’s talk/ })).toBeInTheDocument();
    expect(
      within(screen.getByRole("region", { name: /Notes from/ })).getAllByRole("article"),
    ).toHaveLength(2);
    expect(container.textContent).not.toMatch(/12–40|10M|184|20,000|1–2 hours/);
    expect(container.textContent).not.toMatch(/foundation|milestone|TODO|Phase 01/i);
  });
});

it("does not publish draft writing alongside completed articles", () => {
  const fixture: ArticleMetadata = {
    slug: "test-published-article",
    title: "Published article fixture",
    description: "Unit test fixture only.",
    publishedAt: "2026-01-01",
    tags: [],
    published: true,
  };
  render(
    <SelectedWriting
      entries={[fixture, { ...fixture, slug: "draft", title: "Draft fixture", published: false }]}
    />,
  );
  expect(screen.getByRole("link", { name: fixture.title })).toHaveAttribute(
    "href",
    `/writing/${fixture.slug}`,
  );
  expect(screen.queryByText("Draft fixture")).not.toBeInTheDocument();
});

it("renders only supplied contact actions", () => {
  render(<ContactCta contacts={[{ label: "Email fixture", href: "mailto:test@example.test" }]} />);
  const contact = screen.getByRole("navigation", { name: "Get in touch" });
  expect(within(contact).getAllByRole("link")).toHaveLength(1);
  expect(within(contact).getByRole("link")).toHaveAttribute("href", "mailto:test@example.test");
});
