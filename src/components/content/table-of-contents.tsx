import type { TocEntry } from "@/types/content";

export function TableOfContents({ entries }: { entries: readonly TocEntry[] }) {
  return (
    <nav className="case-toc" aria-label="On this page">
      <details open>
        <summary>On this page</summary>
        <ol>
          {entries
            .filter((entry) => entry.depth === 2)
            .map((entry) => (
              <li key={entry.id}>
                <a href={`#${entry.id}`}>{entry.title}</a>
              </li>
            ))}
        </ol>
      </details>
    </nav>
  );
}
