import type { ReactNode } from "react";

export function CodeBlock({
  children,
  language,
  caption,
}: {
  children: ReactNode;
  language: string;
  caption: string;
}) {
  return (
    <figure className="code-block">
      <figcaption>
        {caption}
        <span>{language}</span>
      </figcaption>
      <pre tabIndex={0} role="region" aria-label={caption}>
        <code>{children}</code>
      </pre>
    </figure>
  );
}
