// Copy is generalized from README.md; no employer names or uncleared figures.
export const home = {
  headline: { primary: "Engineering reliable systems", accent: "at scale." },
  description:
    "I design, build, and operate production applications, with a strong focus on backend architecture, distributed systems, and performance optimization. My experience spans Java and Spring Boot, full-stack development, asynchronous processing, database engineering, and cloud deployments, complemented by Node.js, React, and applied AI engineering.",
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
    "I’m a Bengaluru-based Full Stack Engineer with 3+ years of experience building production SaaS applications. I take ownership from understanding a production bottleneck and evaluating tradeoffs to implementing, deploying, and supporting the result.",
  collaboration:
    "Alongside hands-on full-stack engineering, I contribute to technical design, code reviews, and mentoring two backend engineers.",
} as const;
