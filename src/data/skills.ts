export type SkillCategory = { title: string; technologies: readonly string[] };
// Redis caching is owner-confirmed production experience in Appizap and Motivision.
// Kafka is a technical skill; this list does not attribute it to production projects.
export const skills: readonly SkillCategory[] = [
  {
    title: "Backend",
    technologies: [
      "Java",
      "Spring Boot",
      "Spring WebFlux",
      "Spring Security",
      "Node.js",
      "REST APIs",
      "OAuth2 / JWT",
    ],
  },
  {
    title: "Databases & Caching",
    technologies: ["PostgreSQL", "MongoDB", "TimescaleDB", "Redis", "Elasticsearch"],
  },
  {
    title: "Distributed Systems",
    technologies: [
      "Microservices",
      "Redis Caching",
      "AWS SQS",
      "BullMQ",
      "Apache Kafka",
      "Event-Driven Architecture",
      "Java Concurrency",
    ],
  },
  {
    title: "Cloud & Delivery",
    technologies: ["AWS", "AWS Lambda", "Amazon ECS", "Docker", "CI/CD"],
  },
];
