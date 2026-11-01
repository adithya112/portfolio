export type { CaseStudyMetadata } from "@/types/content";

export type WorkHighlight = {
  id: string;
  slug: string;
  domain: string;
  title: string;
  problem: string;
  contribution: string;
  technologies: readonly string[];
};

// Generalized summaries of the three README-supported contributions.
// Links are shown only when the corresponding MDX study is published.
export const workHighlights: readonly WorkHighlight[] = [
  {
    id: "analytics",
    slug: "analytics-performance",
    domain: "Performance engineering",
    title: "Making analytics responsive",
    problem: "Expensive queries and request-time aggregation slowed analytics APIs.",
    contribution:
      "I optimized query patterns, separated analytics workloads, and moved repeated aggregation into precomputed data models.",
    technologies: ["PostgreSQL", "TimescaleDB", "dbt"],
  },
  {
    id: "background-processing",
    slug: "reliable-background-processing",
    domain: "Asynchronous systems",
    title: "Giving background work its own boundaries",
    problem: "Long-running jobs shared resources with the application’s API workload.",
    contribution:
      "I separated execution with managed queues, atomic MongoDB job claims, retries, and an admin recovery workflow for stale jobs.",
    technologies: ["Spring Boot", "Queues", "Serverless workers"],
  },
  {
    id: "exports",
    slug: "concurrent-video-exports",
    domain: "Java concurrency",
    title: "Redesigning memory-intensive video exports",
    problem:
      "Synchronous exports held all selected videos in application memory, causing memory pressure and failures for larger archives.",
    contribution:
      "I moved exports to background processing with bounded I/O, streaming multipart uploads, retries, cleanup, and reconnect-safe status tracking.",
    technologies: ["Java", "CompletableFuture", "S3"],
  },
];
