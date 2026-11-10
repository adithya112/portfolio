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
  { title: "Frontend", technologies: ["React", "Next.js", "TypeScript", "JavaScript"] },
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
      "Grafana",
      "Prometheus",
      "CloudWatch",
      "System Design",
      "Performance Optimization",
      "Java Concurrency",
    ],
  },
  {
    title: "Applied AI",
    technologies: [
      "Embeddings",
      "Semantic Retrieval",
      "Similarity Search",
      "Clustering",
      "LLM Integrations",
    ],
  },
];
