"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const HeroCanvas = dynamic(() => import("@/components/hero-canvas"), {
  ssr: false,
  loading: () => null,
});

export function HeroCanvasLoader() {
  const [inView, setInView] = useState(false);
  const [supportsWebGL, setSupportsWebGL] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [enhancementReady, setEnhancementReady] = useState(false);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerPreference = window.matchMedia(
      "(min-width: 900px) and (hover: hover) and (pointer: fine)",
    );
    const updateEnhancementSupport = () => {
      const enabled = pointerPreference.matches && !motionPreference.matches;
      setReducedMotion(!enabled);
      if (!enabled) {
        setSupportsWebGL(false);
        setEnhancementReady(false);
        return;
      }
      const probe = document.createElement("canvas");
      const context = probe.getContext("webgl2") ?? probe.getContext("webgl");
      context?.getExtension("WEBGL_lose_context")?.loseContext();
      setSupportsWebGL(Boolean(context));
    };
    pointerPreference.addEventListener("change", updateEnhancementSupport);
    motionPreference.addEventListener("change", updateEnhancementSupport);
    updateEnhancementSupport();
    const element = document.querySelector(".hero-art");
    const initialFrame = window.requestAnimationFrame(() => {
      if (!element || !("IntersectionObserver" in window)) setInView(true);
    });

    if (!element || !("IntersectionObserver" in window))
      return () => {
        window.cancelAnimationFrame(initialFrame);
        pointerPreference.removeEventListener("change", updateEnhancementSupport);
        motionPreference.removeEventListener("change", updateEnhancementSupport);
      };
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { rootMargin: "160px" },
    );
    observer.observe(element);
    return () => {
      window.cancelAnimationFrame(initialFrame);
      observer.disconnect();
      pointerPreference.removeEventListener("change", updateEnhancementSupport);
      motionPreference.removeEventListener("change", updateEnhancementSupport);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const onFirstPointerMove = () => {
      setEnhancementReady(true);
    };
    window.addEventListener("pointermove", onFirstPointerMove, {
      once: true,
      passive: true,
    });
    return () => {
      window.removeEventListener("pointermove", onFirstPointerMove);
    };
  }, [reducedMotion]);

  if (!inView || !supportsWebGL || reducedMotion || !enhancementReady) return null;
  return <HeroCanvas />;
}
