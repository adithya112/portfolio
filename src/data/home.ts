// Copy is generalized from README.md; no employer names or uncleared figures.
export const home = {
  headline: { primary: "Engineering reliable systems", accent: "at scale." },
  description:
    "I build and operate production SaaS backends, solve performance bottlenecks, and design asynchronous systems with reliability in mind. My work spans Java concurrency, distributed processing, analytics architecture, and cloud deployments.",
  outcomes: [
    {
      title: "Faster analytics",
      description: "Reduced response times through query optimization and precomputed data.",
    },
    {
      title: "Independent execution",
      description: "Separated background processing from API workloads.",
    },
    {
      title: "Controlled concurrency",
      description: "Built concurrent export workflows with bounded resource usage.",
    },
  ],
  about:
    "I’m a Bengaluru-based software engineer with 3+ years of experience building production SaaS applications. I take ownership from understanding a production bottleneck and evaluating tradeoffs to implementing, deploying, and supporting the result.",
  collaboration:
    "My focus is hands-on backend engineering. I also contribute across the stack, review code, and guide a two-engineer team.",
} as const;
