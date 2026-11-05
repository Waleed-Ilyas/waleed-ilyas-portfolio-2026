"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Clock3, Search, X } from "lucide-react";
import type { ArticleSummary } from "@/lib/articles";

type ArticleCard = ArticleSummary & { readMinutes: number; wordCount: number };
const categories = ["All", "Engineering", "Blockchain", "Product"] as const;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(`${value}T12:00:00`),
  );
}

export function ArticleExplorer({ articles }: { articles: ArticleCard[] }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 220);
    return () => window.clearTimeout(timer);
  }, [query]);

  const filteredArticles = useMemo(
    () =>
      articles.filter((article) => {
        const matchesCategory = category === "All" || article.category === category;
        const matchesQuery =
          !debouncedQuery ||
          `${article.title} ${article.subtitle} ${article.excerpt} ${article.tags.join(" ")}`
            .toLowerCase()
            .includes(debouncedQuery);
        return matchesCategory && matchesQuery;
      }),
    [articles, category, debouncedQuery],
  );

  return (
    <section id="articles" className="article-section" aria-labelledby="articles-title">
      <div className="section-head">
        <div>
          <span className="section-index">01 / THE JOURNAL</span>
          <h2 id="articles-title">Ideas, in the open.</h2>
          <p>Notes on building useful software, one considered detail at a time.</p>
        </div>
        <a className="all-articles-link" href="/rss.xml">
          Get the feed <ArrowRight size={15} />
        </a>
      </div>
      <div className="article-tools">
        <div className="category-tabs" role="group" aria-label="Filter articles by category">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={category === item ? "category-tab selected" : "category-tab"}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <label className="search-field">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the journal"
            aria-label="Search articles"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
              <X size={14} />
            </button>
          )}
          <kbd>↵</kbd>
        </label>
      </div>
      <div className="article-grid" aria-live="polite">
        {filteredArticles.map((article, index) => (
          <article className={`article-card article-${article.accent}`} key={article.slug}>
            <Link
              className="article-art"
              href={`/blog/${article.slug}`}
              aria-label={`Read ${article.title}`}
            >
              <span className="art-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="art-shape shape-one" />
              <span className="art-shape shape-two" />
              <span className="art-symbol">
                {article.category === "Blockchain"
                  ? "⌁"
                  : article.category === "Product"
                    ? "◉"
                    : "{}"}
              </span>
              <span className="art-category">{article.category.toUpperCase()}</span>
            </Link>
            <div className="article-card-body">
              <div className="article-meta">
                <span>{formatDate(article.date)}</span>
                <span>
                  <Clock3 size={12} /> {article.readMinutes} min read
                </span>
              </div>
              <Link href={`/blog/${article.slug}`} className="article-title-link">
                <h3>{article.title}</h3>
              </Link>
              <p className="article-subtitle">{article.subtitle}</p>
              <p className="article-excerpt">{article.excerpt}</p>
              <div className="article-card-foot">
                <div className="tag-row">
                  {article.tags.slice(0, 2).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <Link href={`/blog/${article.slug}`} aria-label={`Open ${article.title}`}>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </article>
        ))}
        {filteredArticles.length === 0 && (
          <div className="empty-search">
            <span>NO MATCHES</span>
            <h3>Try another search.</h3>
            <p>Search article titles, topics, or tags.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
      <div className="journal-footer">
        <span>
          Showing {filteredArticles.length} of {articles.length} essays
        </span>
        <span>Fresh notes, no noise.</span>
      </div>
    </section>
  );
}
