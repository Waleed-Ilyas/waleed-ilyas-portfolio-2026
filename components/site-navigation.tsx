"use client";

import { Icon } from "@/components/icon";
import { useEffect, useState, useSyncExternalStore } from "react";

const links = [
  ["projects", "Projects"],
  ["skills", "Skills"],
  ["experience", "Experience"],
  ["about", "About"],
  ["contact", "Contact"],
] as const;

const themeEvent = "portfolio-theme-change";

function subscribeTheme(callback: () => void) {
  window.addEventListener(themeEvent, callback);
  return () => window.removeEventListener(themeEvent, callback);
}

function getThemeSnapshot() {
  return document.documentElement.dataset.theme === "light";
}

export function SiteNavigation() {
  const [active, setActive] = useState("projects");
  const light = useSyncExternalStore(subscribeTheme, getThemeSnapshot, () => false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("portfolio-theme");
      const useLight = saved === "light";
      document.documentElement.dataset.theme = useLight ? "light" : "dark";
      window.dispatchEvent(new Event(themeEvent));
    } catch {
      document.documentElement.dataset.theme = "dark";
    }
    const sections = links
      .map(([id]) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);
    let frame = 0;
    const updateActive = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const marker = window.innerHeight * 0.32;
        let current = sections[0];
        for (const section of sections) {
          if (section.getBoundingClientRect().top <= marker) current = section;
          else break;
        }
        if (current) setActive(current.id);
      });
    };
    window.addEventListener("scroll", updateActive, { passive: true });
    updateActive();
    return () => {
      window.removeEventListener("scroll", updateActive);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  function toggleTheme() {
    const next = !light;
    document.documentElement.dataset.theme = next ? "light" : "dark";
    window.dispatchEvent(new Event(themeEvent));
    try {
      window.localStorage.setItem("portfolio-theme", next ? "light" : "dark");
    } catch {
      /* preference remains available for this page view */
    }
  }

  return (
    <header className="site-header">
      <a className="brand" href="#home">
        <span className="brand-mark" aria-hidden="true">
          WI
        </span>
        <span>
          Waleed Ilyas
          <span className="brand-dot" aria-hidden="true">
            .
          </span>
        </span>
      </a>
      <a className="menu-toggle" href="#primary-nav" aria-controls="primary-nav">
        Menu
      </a>
      <nav id="primary-nav" className="primary-nav" aria-label="Main navigation">
        <a className="nav-close" href="#home" aria-label="Close navigation">
          Close menu
        </a>
        {links.map(([id, label]) => (
          <a key={id} href={`#${id}`} aria-current={active === id ? "location" : undefined}>
            {label}
          </a>
        ))}
        <button
          className="theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${light ? "dark" : "light"} theme`}
          aria-pressed={light}
        >
          {light ? "Light" : "Dark"} mode
        </button>
        <a href="/resume/waleed-ilyas-resume.pdf" download>
          Resume
        </a>
        <a className="nav-cta" href="#contact">
          Let&apos;s talk <Icon name="arrow" />
        </a>
      </nav>
    </header>
  );
}
