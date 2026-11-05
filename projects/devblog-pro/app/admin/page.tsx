import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Eye,
  MessageCircle,
  Plus,
  TrendingUp,
} from "lucide-react";
import { articles } from "@/lib/articles";

export const metadata = { title: "Studio · Sample analytics" };

export default function StudioPage() {
  const metrics = [
    { label: "Published stories", value: "03", change: "Editorial samples", icon: BookOpen },
    { label: "Reading sessions", value: "1,284", change: "Illustrative demo data", icon: Eye },
    {
      label: "Discussion notes",
      value: "36",
      change: "Illustrative demo data",
      icon: MessageCircle,
    },
    { label: "Avg. completion", value: "68%", change: "Illustrative demo data", icon: TrendingUp },
  ];
  return (
    <main id="main-content" className="studio-page">
      <div className="studio-topline">
        <Link href="/">
          <ArrowLeft size={14} /> Back to journal
        </Link>
        <span>DEVBLOG PRO / STUDIO</span>
      </div>
      <div className="studio-heading">
        <div>
          <span className="section-index">EDITORIAL WORKSPACE / 01</span>
          <h1>
            Your writing,
            <br />
            <em>in focus.</em>
          </h1>
          <p>A local interface concept for managing an independent technical publication.</p>
        </div>
        <Link className="button-dark" href="/#articles">
          <Plus size={15} /> New story concept
        </Link>
      </div>
      <div className="demo-notice">
        <span>DEMO DATA</span> All metrics are illustrative and all changes remain in this browser.
        No analytics service, account system, or publishing backend is connected.
      </div>
      <section className="metric-grid" aria-label="Sample publication metrics">
        {metrics.map(({ label, value, change, icon: Icon }) => (
          <article className="metric-card" key={label}>
            <div className="metric-label">
              {label}
              <Icon size={16} />
            </div>
            <strong>{value}</strong>
            <small>{change}</small>
          </article>
        ))}
      </section>
      <section className="studio-content">
        <div className="studio-panel">
          <div className="panel-heading">
            <div>
              <span className="section-index">YOUR LIBRARY</span>
              <h2>Story drafts &amp; notes</h2>
            </div>
            <span className="status-pill">3 samples</span>
          </div>
          <div className="studio-list">
            {articles.map((article, index) => (
              <Link className="studio-story" href={`/blog/${article.slug}`} key={article.slug}>
                <span className={`studio-story-index accent-${article.accent}`}>0{index + 1}</span>
                <span className="studio-story-copy">
                  <strong>{article.title}</strong>
                  <small>
                    {article.category} · {article.date}
                  </small>
                </span>
                <span className="story-state">SAMPLE</span>
                <ArrowUpRight size={15} />
              </Link>
            ))}
          </div>
        </div>
        <aside className="studio-aside">
          <span className="section-index">A SMALL REMINDER</span>
          <h2>Write for the reader.</h2>
          <p>
            Useful writing starts with a question someone is already asking. Keep the scope honest,
            share the tradeoffs, and make the next step easy to find.
          </p>
          <Link href="/#articles">
            Read the sample journal <ArrowUpRight size={14} />
          </Link>
        </aside>
      </section>
      <p className="studio-footnote">
        This studio is a front-end showcase. Authentication, persistent authoring, moderation, and
        real analytics require a separately configured backend.
      </p>
    </main>
  );
}
