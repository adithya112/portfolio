import { SiteLink } from "@/components/ui/site-link";
import type { MDXComponents } from "mdx/types";
import { ArchitectureDiagram } from "@/components/diagrams/architecture-diagram";

const components: MDXComponents = {
  ArchitectureDiagram,
  a: SiteLink,
  pre: ({ children, ...props }) => (
    <pre {...props} tabIndex={0} role="region" aria-label="Illustrative code example">
      {children}
    </pre>
  ),
};

export function useMDXComponents(overrides: MDXComponents = {}): MDXComponents {
  return { ...components, ...overrides };
}
