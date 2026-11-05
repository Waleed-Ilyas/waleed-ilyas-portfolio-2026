import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleExperience } from "@/components/article-experience";
import { articles, getArticleSummary } from "@/lib/articles";
import { getPostContent } from "@/lib/post-content";

const postModules: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  "scalable-mern-patterns": () => import("@/content/posts/scalable-mern-patterns.mdx"),
  "solana-anchor-workflows": () => import("@/content/posts/solana-anchor-workflows.mdx"),
  "useful-product-analytics": () => import("@/content/posts/useful-product-analytics.mdx"),
  "accessible-forms-as-a-system": () => import("@/content/posts/accessible-forms-as-a-system.mdx"),
  "small-team-api-contracts": () => import("@/content/posts/small-team-api-contracts.mdx"),
};

export const dynamicParams = false;
export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleSummary(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { title: article.title, description: article.excerpt, type: "article" },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPostContent(slug);
  const loadPost = postModules[slug];
  if (!article || !loadPost) notFound();
  const Post = (await loadPost()).default;
  return (
    <ArticleExperience article={article}>
      <Post />
    </ArticleExperience>
  );
}
