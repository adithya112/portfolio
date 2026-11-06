export type SkillCategory = { title: string; technologies: readonly string[] };
export const skills: readonly SkillCategory[] = [
  {
    title: "Backend",
    technologies: [
      "Java 17/21",
      "Spring Boot",
      "Spring WebFlux",
      "Spring Security",
      "Spring Data JPA",
      "Hibernate",
      "Node.js",
      "REST APIs",
      "OAuth2 / JWT",
    ],
  },
  { title: "Full Stack", technologies: ["TypeScript", "JavaScript", "React", "Next.js"] },
  {
    title: "Databases & Search",
    technologies: [
      "PostgreSQL",
      "TimescaleDB",
      "MongoDB",
      "Redis Caching",
      "Elasticsearch",
      "pgvector",
    ],
  },
  {
    title: "Distributed Systems",
    technologies: [
      "Microservices",
      "Event-Driven Architecture",
      "Asynchronous Processing",
      "BullMQ",
      "AWS SQS",
      "Apache Kafka",
    ],
  },
  {
    title: "Cloud & DevOps",
    technologies: [
      "AWS",
      "AWS Lambda",
      "S3",
      "RDS",
      "ECS exposure",
      "Docker",
      "Kubernetes application deployments",
      "CI/CD",
      "GitHub Actions",
    ],
  },
  {
    title: "Testing & Engineering",
    technologies: [
      "JUnit",
      "Mockito",
      "Integration Testing",
      "System Design",
      "Performance Optimization",
      "Java Concurrency",
    ],
  },
];
