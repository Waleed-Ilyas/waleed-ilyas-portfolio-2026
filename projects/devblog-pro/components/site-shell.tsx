"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Moon, Rss, Sun } from "lucide-react";

type Theme = "light" | "dark";

export function SiteShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem("devblog-theme");
    // Apply the persisted preference after hydration to keep server HTML deterministic.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored === "dark" || stored === "light") setTheme(stored);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("devblog-theme", nextTheme);
  };

  return (
    <div className={`site-root theme-${theme}`} data-theme={theme}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-nav">
        <div className="nav-inner">
          <Link className="wordmark" href="/" aria-label="DevBlog Pro home">
            <span className="wordmark-symbol">
              d<span>.</span>
            </span>
            <span>
              devblog<span className="wordmark-light">pro</span>
            </span>
          </Link>
          <nav className="nav-links" aria-label="Main navigation">
            <Link href="/#articles">Articles</Link>
            <Link href="/admin">Studio</Link>
            <a href="/rss.xml" aria-label="RSS feed" className="rss-link">
              <Rss size={15} /> <span>RSS</span>
            </a>
          </nav>
          <div className="nav-actions">
            <button
              className="theme-button"
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <Link className="nav-cta" href="/#articles">
              Explore posts
            </Link>
          </div>
        </div>
      </header>
      {children}
      <footer className="site-footer">
        <div className="footer-inner">
          <Link className="footer-brand" href="/">
            devblog<span>pro</span>
          </Link>
          <p>Independent portfolio showcase · Fictional editorial sample content</p>
          <a href="/rss.xml">RSS feed</a>
        </div>
      </footer>
    </div>
  );
}
