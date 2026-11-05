import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Clock3, Sparkles } from "lucide-react";
import { ArticleExplorer } from "@/components/article-explorer";
import { articles } from "@/lib/articles";
import { getPostContent } from "@/lib/post-content";

export default async function HomePage() {
  const cards = await Promise.all(
    articles.map(async (article) => {
      const content = await getPostContent(article.slug);
      return {
        ...article,
        readMinutes: content?.readMinutes ?? 1,
        wordCount: content?.wordCount ?? 0,
      };
    }),
  );
  const featured = cards[0];

  return (
    <main id="main-content">
      <section className="journal-hero">
        <div className="hero-copy">
          <div className="hero-overline">
            <span className="hero-overline-line" /> AN INDEPENDENT ENGINEERING JOURNAL
          </div>
          <h1>
            Thoughtful
            <br />
            software, <span>made clear.</span>
          </h1>
          <p>
            Field notes on architecture, product decisions, and the craft of building dependable
            software.
          </p>
          <div className="hero-actions">
            <a className="button-dark" href="#articles">
              Explore the journal <ArrowDownRight size={16} />
            </a>
            <span className="issue-label">VOL. 01&nbsp; / &nbsp;2026</span>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-art-grid" />
          <div className="hero-orbit orbit-a" />
          <div className="hero-orbit orbit-b" />
          <div className="hero-core">
            <span>DB</span>
            <i />
          </div>
          <span className="hero-coordinate coordinate-top">40° 43′ 55.3″ N</span>
          <span className="hero-coordinate coordinate-bottom">IDEAS IN MOTION · 001</span>
          <div className="hero-art-caption">
            <span>READ / THINK / BUILD</span>
            <ArrowUpRight size={15} />
          </div>
        </div>
        <div className="hero-edge-note">
          <span>SCROLL TO DISCOVER</span>
          <i />
        </div>
      </section>

      <section className="featured-section" aria-labelledby="featured-title">
        <div className="featured-label">
          <span>THE LEAD STORY</span>
          <i />
        </div>
        <div className="featured-grid">
          <Link
            href={`/blog/${featured.slug}`}
            className="featured-art"
            aria-label={`Read ${featured.title}`}
          >
            <span>01</span>
            <i className="feature-ring feature-ring-one" />
            <i className="feature-ring feature-ring-two" />
            <b>ƒ</b>
            <small>
              ENGINEERING
              <br />
              SYSTEMS
            </small>
          </Link>
          <div className="featured-copy">
            <div className="article-meta">
              <span>{featured.category}</span>
              <span>{featured.readMinutes} min read</span>
            </div>
            <h2 id="featured-title">
              <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
            </h2>
            <p>{featured.excerpt}</p>
            <div className="featured-tags">
              {featured.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <Link className="read-link" href={`/blog/${featured.slug}`}>
              Read the story <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <ArticleExplorer articles={cards} />

      <section className="local-tools-note">
        <span className="local-tools-icon">
          <Sparkles size={17} />
        </span>
        <div>
          <strong>Small experiments, clearly labeled.</strong>
          <p>
            Search and comments run locally in this demo. Optional AI summaries are disabled until a
            server-side provider is configured; no database or email service is connected.
          </p>
        </div>
        <span className="note-code">OFFLINE / 01</span>
      </section>

      <section className="newsletter-band">
        <div>
          <span className="section-index">A QUIETER KIND OF UPDATE</span>
          <h2>
            Stay curious.
            <br />
            <em>Keep building.</em>
          </h2>
          <p>Use the RSS feed to follow new articles in your reader.</p>
          <Link className="button-dark" href="/rss.xml">
            Open RSS feed <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="newsletter-graphic" aria-hidden="true">
          <span className="newsletter-circle circle-1" />
          <span className="newsletter-circle circle-2" />
          <span className="newsletter-circle circle-3" />
          <span>◌</span>
          <small>
            LOW FREQUENCY
            <br />
            HIGH SIGNAL
          </small>
        </div>
      </section>
    </main>
  );
}
