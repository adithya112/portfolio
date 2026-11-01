// Background and interests supplied in README.md.
export const about = {
  heading: "Hands-on engineering. Thoughtful ownership.",
  experience:
    "I’m a Bengaluru-based software engineer with 3+ years of experience building and operating production SaaS applications.",
  approach:
    "I enjoy following a problem from its first symptoms to a working production change: understanding a bottleneck, weighing tradeoffs, implementing a solution, and supporting it after deployment.",
  collaboration:
    "My work is primarily backend engineering. I also contribute across the stack, review code, and guide a two-engineer team. I value clear implementation boundaries and explanations that help the next engineer maintain the system.",
  interests: "Outside engineering, I enjoy trekking and fitness.",
  principles: [
    {
      title: "Start with the mechanism",
      description:
        "Understand where the time, memory, or contention goes before choosing a different tool.",
    },
    {
      title: "Make boundaries explicit",
      description:
        "Separate request handling, background execution, shared state, and external side effects.",
    },
    {
      title: "Design for the next attempt",
      description:
        "Consider retries, stale state, cleanup, and recovery alongside the successful path.",
    },
  ],
} as const;
