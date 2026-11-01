import { useId, type ReactNode } from "react";

export function DiagramFrame({
  title,
  summary,
  children,
}: {
  title: string;
  summary: string;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <figure
      className="diagram-frame"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-summary`}
    >
      <figcaption id={`${id}-title`}>{title}</figcaption>
      <div
        className="diagram-scroll"
        tabIndex={0}
        role="group"
        aria-label={`${title} visualization`}
      >
        {children}
      </div>
      <p id={`${id}-summary`} className="muted">
        {summary}
      </p>
    </figure>
  );
}
