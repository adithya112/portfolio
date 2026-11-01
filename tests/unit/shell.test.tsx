import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { ProjectCard } from "@/components/content/project-card";
import { publicContacts } from "@/data/profile";
import type { CaseStudyMetadata } from "@/data/projects";

describe("mobile navigation", () => {
  it("opens with the keyboard, exposes links, and returns focus on Escape", async () => {
    const user = userEvent.setup();
    render(<MobileNav items={[{ label: "Home", href: "/" }]} />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    await user.tab();
    expect(toggle).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    await user.tab();
    expect(screen.getByRole("link", { name: "Home" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(toggle).toHaveFocus();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
  it("closes after following a link", async () => {
    const user = userEvent.setup();
    render(<MobileNav items={[{ label: "Home", href: "/" }]} />);
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("link", { name: "Home" }));
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
  });
});

it("uses only the configured public contact destinations", () => {
  render(<SiteFooter />);
  expect(screen.getAllByRole("link")).toHaveLength(publicContacts.length);
  for (const contact of publicContacts) {
    expect(
      screen.getByRole("link", {
        name: contact.href.startsWith("https://")
          ? `${contact.label} (opens in a new tab)`
          : contact.label,
      }),
    ).toHaveAttribute("href", contact.href);
  }
});
it("does not render an unpublished case study", () => {
  const project: CaseStudyMetadata = {
    slug: "draft",
    title: "Unapproved",
    summary: "Draft",
    domain: "Backend",
    technologies: [],
    published: false,
    updatedAt: "",
  };
  const { container } = render(<ProjectCard project={project} />);
  expect(container).toBeEmptyDOMElement();
});
