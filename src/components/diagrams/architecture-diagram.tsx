import { useId } from "react";
import { DiagramFrame } from "./diagram-frame";

const diagrams = {
  "analytics-before": {
    title: "Before: analytics shares the application workload",
    summary:
      "Ingestion writes to a shared PostgreSQL workload. API requests read that data and perform expensive aggregation in the application.",
    steps: [
      {
        label: "Data ingestion",
        detail: "Writes analytic records",
        scope: "Ingestion responsibility",
      },
      {
        label: "Shared PostgreSQL",
        detail: "Application + analytics",
        scope: "Shared resource boundary",
      },
      {
        label: "API aggregation",
        detail: "Repeated work per request",
        scope: "Application responsibility",
      },
    ],
    annotation: "Pressure: database work and request-time aggregation overlap.",
  },
  "analytics-after": {
    title: "After: isolate workloads and precompute repeated work",
    summary:
      "The application workload is separated from analytics. The analytics path uses time-oriented storage, dbt transformations and precomputed marts, which APIs query.",
    steps: [
      {
        label: "Analytics storage",
        detail: "TimescaleDB hypertables",
        scope: "Separate data workload",
      },
      {
        label: "dbt → data marts",
        detail: "Compute before requests",
        scope: "Transformation responsibility",
      },
      { label: "API reads", detail: "Query prepared results", scope: "Application responsibility" },
    ],
    annotation: "Tradeoff: prepared results introduce a data-freshness boundary.",
  },
  "queue-before": {
    title: "Before: background workers share the API deployment",
    summary:
      "A Spring Boot deployment contains request handling and embedded RQueue workers. Long jobs compete for process resources and occupy worker capacity.",
    steps: [
      { label: "API requests", detail: "Interactive workload", scope: "Request responsibility" },
      {
        label: "Spring Boot + RQueue",
        detail: "Shared process resources",
        scope: "Combined execution boundary",
      },
      {
        label: "Background jobs",
        detail: "Long tasks occupy workers",
        scope: "Job responsibility",
      },
    ],
    annotation: "Pressure: CPU, heap, connections and worker capacity need separate analysis.",
  },
  "queue-after": {
    title: "After: queue-backed execution outside the API process",
    summary:
      "The producer hands jobs to a managed queue. Function workers process them outside the API process. Atomic MongoDB job claims coordinate execution; retries, failure queues and an admin status-reset workflow support recovery. The AWS path uses SQS and Lambda; the Azure path uses Queue Storage and Functions.",
    steps: [
      {
        label: "Job producer",
        detail: "Submit asynchronous work",
        scope: "Application responsibility",
      },
      {
        label: "Managed queue",
        detail: "Delivery + retry boundary",
        scope: "Messaging responsibility",
      },
      {
        label: "Function workers",
        detail: "Independent concurrency",
        scope: "Execution responsibility",
      },
    ],
    annotation: "Recovery: inspect logs → reset stale job status in admin → SQS DLQ redrive.",
  },
  "export-before": {
    title: "Before: synchronous exports retain videos in application memory",
    summary:
      "The request waits while the Java application downloads every selected video into memory, generates a ZIP archive and returns it to the client. Larger exports create memory pressure and export failures.",
    steps: [
      {
        label: "Export request",
        detail: "Client waits for completion",
        scope: "Synchronous request",
      },
      {
        label: "Videos in Java heap",
        detail: "All selected videos retained",
        scope: "Application memory",
      },
      { label: "ZIP → client", detail: "Generate and return archive", scope: "Request completion" },
    ],
    annotation: "Failure mode: larger archives create memory pressure and export failures.",
  },
  "export-after": {
    title: "Worker execution: bounded parallel I/O, ordered archive output",
    summary:
      "Dedicated executors fetch metadata and download objects. A single ZIP writer serializes archive output. Concurrent multipart uploads stream ZIP output to S3 before READY is persisted. SSE notifies the client; a status API returns persisted state after reconnect.",
    steps: [
      {
        label: "Metadata + downloads",
        detail: "Dedicated executors",
        scope: "Parallel I/O boundary",
      },
      {
        label: "Single ZIP writer",
        detail: "Serialize archive entries",
        scope: "Archive ownership boundary",
      },
      {
        label: "Multipart → READY",
        detail: "Finalize, then notify",
        scope: "Upload + status responsibility",
      },
    ],
    annotation:
      "Recovery: exponential-backoff retries · FAILED status · scheduled cleanup · persisted status API.",
  },
} as const;

export type DiagramVariant = keyof typeof diagrams;

export function ArchitectureDiagram({ variant }: { variant: DiagramVariant }) {
  const id = useId();
  const diagram = diagrams[variant];
  return (
    <DiagramFrame title={diagram.title} summary={diagram.summary}>
      <svg
        className="architecture-svg"
        viewBox="0 0 720 240"
        role="img"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-desc`}
      >
        <title id={`${id}-title`}>{diagram.title}</title>
        <desc id={`${id}-desc`}>{diagram.summary}</desc>
        <defs>
          <marker
            id={`${id}-arrow`}
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
          >
            <path d="M0 0 L8 4 L0 8" fill="#9adbdc" />
          </marker>
        </defs>
        {diagram.steps.map((step, index) => {
          const x = 8 + index * 240;
          return (
            <g key={step.label}>
              <text x={x + 8} y={28} fill="#a4b0bd" fontSize="10">
                {step.scope}
              </text>
              <rect x={x} y={48} width={220} height={104} rx={6} fill="#0b1118" stroke="#53747e" />
              <text x={x + 110} y={90} textAnchor="middle" fill="#e9edf2" fontSize="14">
                {step.label}
              </text>
              <text x={x + 110} y={118} textAnchor="middle" fill="#a4b0bd" fontSize="11">
                {step.detail}
              </text>
              {index < 2 && (
                <path
                  d={`M${x + 222} 100 H${x + 238}`}
                  stroke="#9adbdc"
                  markerEnd={`url(#${id}-arrow)`}
                />
              )}
            </g>
          );
        })}
        <text x={16} y={198} fill="#9adbdc" fontSize="10">
          {diagram.annotation}
        </text>
        <text x={16} y={223} fill="#a4b0bd" fontSize="10">
          Conceptual architecture
        </text>
      </svg>
    </DiagramFrame>
  );
}
