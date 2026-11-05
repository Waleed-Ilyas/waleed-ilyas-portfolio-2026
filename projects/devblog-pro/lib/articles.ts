export type ArticleSummary = {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: "Engineering" | "Blockchain" | "Product";
  date: string;
  accent: "violet" | "teal" | "orange";
  tags: string[];
};

export const articles: ArticleSummary[] = [
  {
    slug: "scalable-mern-patterns",
    title: "Building Scalable MERN Applications",
    subtitle: "Practical architecture patterns for growing products",
    excerpt:
      "A grounded look at boundaries, data access, caching, and operational decisions that help a MERN application stay maintainable as requirements grow.",
    category: "Engineering",
    date: "2026-10-28",
    accent: "violet",
    tags: ["MERN", "Architecture", "Performance"],
  },
  {
    slug: "solana-anchor-workflows",
    title: "A Safer Solana Program Workflow",
    subtitle: "From local tests to careful transaction design",
    excerpt:
      "A walkthrough of the development loop around Anchor programs, including deterministic tests, account validation, and clear failure handling.",
    category: "Blockchain",
    date: "2026-10-16",
    accent: "teal",
    tags: ["Solana", "Anchor", "Testing"],
  },
  {
    slug: "useful-product-analytics",
    title: "Product Analytics That Answer Real Questions",
    subtitle: "Choose events that explain a user journey",
    excerpt:
      "How to design a small event model that connects product decisions to observable behavior without collecting more data than the team needs.",
    category: "Product",
    date: "2026-10-03",
    accent: "orange",
    tags: ["Analytics", "Product", "Privacy"],
  },
  {
    slug: "accessible-forms-as-a-system",
    title: "Accessible Forms as a Product System",
    subtitle: "Make validation, labels, and recovery part of the design",
    excerpt:
      "A form becomes easier to use when its labels, error states, keyboard flow, and recovery paths are designed together.",
    category: "Product",
    date: "2026-09-24",
    accent: "violet",
    tags: ["Accessibility", "Forms", "Design systems"],
  },
  {
    slug: "small-team-api-contracts",
    title: "API Contracts for Small Teams",
    subtitle: "Keep a simple agreement between the browser and server",
    excerpt:
      "A compact API contract can reduce integration guesswork without creating a documentation project of its own.",
    category: "Engineering",
    date: "2026-09-12",
    accent: "teal",
    tags: ["APIs", "TypeScript", "Reliability"],
  },
];

export function getArticleSummary(slug: string) {
  return articles.find((article) => article.slug === slug);
}
