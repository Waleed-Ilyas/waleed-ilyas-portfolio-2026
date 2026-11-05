"use client";

import { useEffect, useState, type CSSProperties } from "react";

export function SiteEffects() {
  const [showLoader, setShowLoader] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const progress = document.querySelector<HTMLElement>(".scroll-progress");
    const header = document.querySelector<HTMLElement>(".site-header");
    const cursor = document.querySelector<HTMLElement>(".custom-cursor-dot");
    const cursorTrail = document.querySelector<HTMLElement>(".custom-cursor-trail");
    const contactSection = document.querySelector<HTMLElement>(".contact-section");
    const floatingContact = document.querySelector<HTMLElement>(".floating-contact");
    const contactObserver =
      contactSection && floatingContact && "IntersectionObserver" in window
        ? new IntersectionObserver(
            ([entry]) => {
              floatingContact.classList.toggle("floating-contact-hidden", entry.isIntersecting);
            },
            { threshold: 0.08 },
          )
        : undefined;
    if (contactObserver && contactSection) contactObserver.observe(contactSection);
    let frame = 0;
    let previousY = window.scrollY;
    let sequenceIndex = 0;
    let easterEggTimeout = 0;
    const sequence = [
      "arrowup",
      "arrowup",
      "arrowdown",
      "arrowdown",
      "arrowleft",
      "arrowright",
      "arrowleft",
      "arrowright",
      "b",
      "a",
    ];

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
        progress?.style.setProperty("--scroll-progress", `${Math.min(100, ratio * 100)}%`);
        const currentY = window.scrollY;
        if (header && !motion.matches && !location.hash.startsWith("#primary-nav")) {
          header.classList.toggle("site-header-hidden", currentY > 160 && currentY > previousY + 4);
          if (currentY < 80 || currentY < previousY - 4)
            header.classList.remove("site-header-hidden");
        }
        previousY = currentY;
      });
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!finePointer.matches || motion.matches || !cursor) return;
      document.documentElement.classList.add("custom-cursor-enabled");
      const position = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      cursor.style.transform = position;
      if (cursorTrail) cursorTrail.style.transform = position;
      cursor.classList.add("custom-cursor-visible");
      cursorTrail?.classList.add("custom-cursor-visible");
    };
    const onPointerLeave = () => {
      cursor?.classList.remove("custom-cursor-visible");
      cursorTrail?.classList.remove("custom-cursor-visible");
    };
    const onMotionChange = () => {
      if (motion.matches) {
        document.documentElement.classList.remove("custom-cursor-enabled");
        onPointerLeave();
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
      )
        return;
      const key = event.key.toLowerCase();
      sequenceIndex =
        key === sequence[sequenceIndex] ? sequenceIndex + 1 : key === sequence[0] ? 1 : 0;
      if (sequenceIndex === sequence.length) {
        sequenceIndex = 0;
        setShowEasterEgg(true);
        window.clearTimeout(easterEggTimeout);
        easterEggTimeout = window.setTimeout(() => setShowEasterEgg(false), 2800);
      }
    };
    const loaderKey = "portfolio-loader-seen-v1";
    let timeout = 0;
    let loaderFrame = 0;
    let loaderSeen = true;
    try {
      loaderSeen = window.sessionStorage.getItem(loaderKey) === "1";
      if (!loaderSeen) window.sessionStorage.setItem(loaderKey, "1");
    } catch {
      loaderSeen = false;
    }
    if (!motion.matches && !loaderSeen) {
      loaderFrame = window.requestAnimationFrame(() => {
        setShowLoader(true);
        timeout = window.setTimeout(() => setShowLoader(false), 520);
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("keydown", onKeyDown);
    motion.addEventListener("change", onMotionChange);
    onScroll();
    return () => {
      window.clearTimeout(timeout);
      window.clearTimeout(easterEggTimeout);
      window.cancelAnimationFrame(loaderFrame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("keydown", onKeyDown);
      motion.removeEventListener("change", onMotionChange);
      contactObserver?.disconnect();
      document.documentElement.classList.remove("custom-cursor-enabled");
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <div className="custom-cursor custom-cursor-trail" aria-hidden="true" />
      <div className="custom-cursor custom-cursor-dot" aria-hidden="true" />
      {showLoader && (
        <div className="page-loader" aria-hidden="true">
          <span className="page-loader-mark">WI</span>
          <span className="page-loader-track">
            <span />
          </span>
        </div>
      )}
      {showEasterEgg && (
        <div className="easter-egg" role="status" aria-live="polite" aria-atomic="true">
          <span>You found the hidden surprise!</span>
          <span className="confetti" aria-hidden="true">
            {Array.from({ length: 18 }, (_, index) => (
              <i key={index} style={{ "--confetti-angle": `${index * 20}deg` } as CSSProperties} />
            ))}
          </span>
        </div>
      )}
    </>
  );
}
