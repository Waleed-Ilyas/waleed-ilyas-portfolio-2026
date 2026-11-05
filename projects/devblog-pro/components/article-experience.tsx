"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  MessageCircle,
  Reply,
  Send,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import type { ArticleSummary } from "@/lib/articles";
import type { TocItem } from "@/lib/post-content";

type Comment = { id: string; name: string; body: string; createdAt: string; replies: Comment[] };
type PostDetails = ArticleSummary & { toc: TocItem[]; plainText: string; readMinutes: number };

function localSummary(source: string) {
  const sentences = source
    .replace(/[#*_`>|]/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 45);
  return sentences.slice(0, 2).join(" ");
}

function CommentBranch({
  comment,
  onReply,
}: {
  comment: Comment;
  onReply: (parentId: string) => void;
}) {
  return (
    <div className="comment-branch">
      <article className="comment-card">
        <div className="comment-avatar" aria-hidden="true">
          {comment.name.slice(0, 1).toUpperCase()}
        </div>
        <div className="comment-body">
          <div className="comment-meta">
            <strong>{comment.name}</strong>
            <time>{comment.createdAt}</time>
          </div>
          <p>{comment.body}</p>
          <button type="button" onClick={() => onReply(comment.id)}>
            <Reply size={13} /> Reply
          </button>
        </div>
      </article>
      {comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map((reply) => (
            <CommentBranch key={reply.id} comment={reply} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
}

export function ArticleExperience({
  article,
  children,
}: {
  article: PostDetails;
  children: React.ReactNode;
}) {
  const [progress, setProgress] = useState(0);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [assistResult, setAssistResult] = useState("");
  const [assistError, setAssistError] = useState("");
  const [assistBusy, setAssistBusy] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsReady, setCommentsReady] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [name, setName] = useState("Reader");
  const [body, setBody] = useState("");
  const [formError, setFormError] = useState("");
  const storageKey = `devblog-comments-${article.slug}`;

  useEffect(() => {
    const updateProgress = () => {
      const range = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(range > 0 ? Math.min(100, Math.max(0, (window.scrollY / range) * 100)) : 0);
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as unknown;
        // Hydrate browser-only comments after mount; server rendering must stay empty.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (Array.isArray(parsed)) setComments(parsed as Comment[]);
      }
    } catch {
      localStorage.removeItem(storageKey);
    }
    setCommentsReady(true);
  }, [storageKey]);

  useEffect(() => {
    if (commentsReady) localStorage.setItem(storageKey, JSON.stringify(comments));
  }, [comments, commentsReady, storageKey]);

  const addComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanBody = body.trim();
    if (cleanBody.length < 3) {
      setFormError("Write at least a few words before posting.");
      return;
    }
    const comment: Comment = {
      id: crypto.randomUUID(),
      name: name.trim().slice(0, 36) || "Reader",
      body: cleanBody.slice(0, 1200),
      createdAt: new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date()),
      replies: [],
    };
    if (replyTo) {
      setComments((current) =>
        current.map((item) =>
          item.id === replyTo ? { ...item, replies: [...item.replies, comment] } : item,
        ),
      );
    } else {
      setComments((current) => [...current, comment]);
    }
    setBody("");
    setReplyTo(null);
    setFormError("");
  };

  const suggestTags = () => {
    const source = `${article.title} ${article.subtitle} ${article.plainText}`.toLowerCase();
    const candidates = [
      "architecture",
      "testing",
      "performance",
      "security",
      "privacy",
      "product",
      "database",
      "api",
      "solana",
      "react",
      "typescript",
      "analytics",
    ];
    const found = candidates.filter((tag) => source.includes(tag)).slice(0, 4);
    setSuggestedTags(
      found.length ? found : article.tags.slice(0, 3).map((tag) => tag.toLowerCase()),
    );
  };

  const requestAssist = async (action: "summary" | "tags") => {
    setAssistBusy(true);
    setAssistError("");
    setAssistResult("");
    try {
      const response = await fetch("/api/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          text: `${article.title}\n${article.subtitle}\n${article.plainText}`,
        }),
      });
      const payload = (await response.json()) as { result?: unknown; error?: unknown };
      if (!response.ok || typeof payload.result !== "string") {
        if (action === "summary") {
          setAssistResult(localSummary(article.plainText) || article.excerpt);
          setAssistError("AI is not configured; showing a local extractive preview.");
        } else {
          suggestTags();
          setAssistError("AI is not configured; showing locally matched tags.");
        }
        return;
      }
      if (action === "tags") {
        setSuggestedTags(
          payload.result
            .split(/[\n,;]/)
            .map((tag) => tag.replace(/^[-*#\s]+/, "").trim())
            .filter(Boolean)
            .slice(0, 5),
        );
      } else {
        setAssistResult(payload.result);
      }
    } catch {
      setAssistError("The reading assistant is unavailable. Please try again shortly.");
    } finally {
      setAssistBusy(false);
    }
  };

  return (
    <main id="main-content" className="article-page">
      <div className="reading-progress" aria-hidden="true">
        <i style={{ width: `${progress}%` }} />
      </div>
      <div className="article-back">
        <Link href="/#articles">
          <ArrowLeft size={15} /> All articles
        </Link>
        <span>EDITORIAL / {article.category.toUpperCase()}</span>
      </div>
      <header className={`article-hero article-hero-${article.accent}`}>
        <div className="article-hero-copy">
          <div className="article-meta">
            <span>{article.category}</span>
            <span>
              {new Intl.DateTimeFormat("en", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }).format(new Date(`${article.date}T12:00:00`))}
            </span>
            <span>
              <Clock3 size={13} /> {article.readMinutes} min read
            </span>
          </div>
          <h1>{article.title}</h1>
          <p>{article.subtitle}</p>
          <div className="article-byline">
            <span className="byline-mark">DB</span>
            <span>
              <strong>DevBlog Pro Editorial</strong>
              <small>Independent sample publication</small>
            </span>
          </div>
        </div>
        <div className="article-hero-art" aria-hidden="true">
          <span className="article-art-ring ring-one" />
          <span className="article-art-ring ring-two" />
          <span className="article-art-letter">
            {article.category === "Blockchain" ? "⌁" : article.category === "Product" ? "◉" : "{}"}
          </span>
          <span className="article-art-index">
            FIELD NOTE / {article.slug.slice(0, 2).toUpperCase()}
          </span>
        </div>
      </header>
      <div className="article-layout">
        <aside className="article-sidebar">
          <span className="toc-label">IN THIS ARTICLE</span>
          <nav aria-label="Table of contents">
            {article.toc.map((item) => (
              <a className={item.level === 3 ? "toc-child" : ""} href={`#${item.id}`} key={item.id}>
                {item.title}
              </a>
            ))}
          </nav>
          <div className="tool-card">
            <div className="tool-card-icon">
              <Sparkles size={15} />
            </div>
            <strong>Reading assistant</strong>
            <p>
              Optional server-side AI assistance. Article text is sent only when the provider is
              configured.
            </p>
            <button
              type="button"
              disabled={assistBusy}
              onClick={() => {
                setSummaryOpen((open) => !open);
                void requestAssist("summary");
              }}
            >
              {assistBusy ? "Working…" : summaryOpen ? "Refresh summary" : "Create summary"}{" "}
              <ArrowRight size={13} />
            </button>
            {summaryOpen && (
              <div className="summary-result">
                {assistResult || localSummary(article.plainText) || article.excerpt}
                <small>{assistError ? "Local extractive preview" : "Article summary"}</small>
              </div>
            )}
            <button
              className="suggest-button"
              type="button"
              disabled={assistBusy}
              onClick={() => void requestAssist("tags")}
            >
              {assistBusy ? "Working…" : "Suggest topic tags"}
            </button>
            {assistError && <p role="status">{assistError}</p>}
            {suggestedTags.length > 0 && (
              <div className="suggested-tags">
                {suggestedTags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            )}
          </div>
        </aside>
        <article className="article-content">
          <div className="article-disclosure">
            <Sparkles size={14} /> Sample editorial content · Published for this independent
            portfolio demo.
          </div>
          <div className="prose">{children}</div>
          <div className="article-endmark">
            <i /> END OF ARTICLE <i />
          </div>
          <div className="article-tags">
            {article.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <section className="comments-section" aria-labelledby="comments-title">
            <div className="comments-heading">
              <div>
                <span className="section-index">DISCUSSION / {comments.length}</span>
                <h2 id="comments-title">Add a thoughtful note.</h2>
                <p>Comments stay in this browser and are not sent to a server.</p>
              </div>
              <MessageCircle size={22} />
            </div>
            <form className="comment-form" onSubmit={addComment}>
              <label>
                Your display name
                <input
                  value={name}
                  maxLength={36}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
              <label>
                {replyTo ? "Your reply" : "Your comment"}
                <textarea
                  value={body}
                  maxLength={1200}
                  onChange={(event) => setBody(event.target.value)}
                  placeholder="Share a question or observation..."
                  rows={4}
                />
              </label>
              {formError && (
                <p className="form-error" role="alert">
                  {formError}
                </p>
              )}
              <div className="comment-form-actions">
                {replyTo && (
                  <button className="cancel-reply" type="button" onClick={() => setReplyTo(null)}>
                    Cancel reply
                  </button>
                )}
                <span>Local browser demo · Max 1,200 characters</span>
                <button className="button-dark" type="submit">
                  <Send size={14} /> Post {replyTo ? "reply" : "comment"}
                </button>
              </div>
            </form>
            <div className="comment-list">
              {comments.length ? (
                comments.map((comment) => (
                  <CommentBranch key={comment.id} comment={comment} onReply={setReplyTo} />
                ))
              ) : (
                <div className="empty-comments">
                  No comments yet. Start the discussion with a useful question.
                </div>
              )}
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
