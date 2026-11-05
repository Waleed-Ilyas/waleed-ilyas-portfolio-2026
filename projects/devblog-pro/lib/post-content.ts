import { readFile } from "node:fs/promises";
import path from "node:path";
import { getArticleSummary } from "./articles";

export type TocItem = { id: string; title: string; level: 2 | 3 };

function headingId(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

export async function getPostContent(slug: string) {
  const article = getArticleSummary(slug);
  if (!article) return null;
  const filePath = path.join(process.cwd(), "content", "posts", `${article.slug}.mdx`);
  const source = await readFile(filePath, "utf8");
  const toc: TocItem[] = Array.from(source.matchAll(/^(#{2,3})\s+(.+)$/gm), (match) => {
    const title = match[2].trim();
    return { id: headingId(title), title, level: match[1].length as 2 | 3 };
  });
  const plainText = source
    .replace(/^import\s.+$/gm, "")
    .replace(/^export\s.+$/gm, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_`>|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  return {
    ...article,
    toc,
    plainText,
    wordCount,
    readMinutes: Math.max(1, Math.ceil(wordCount / 220)),
  };
}
