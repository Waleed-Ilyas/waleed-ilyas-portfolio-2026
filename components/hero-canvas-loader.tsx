"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef, useState } from "react";
import { Component, type ReactNode } from "react";

const HeroCanvas = dynamic(() => import("@/components/hero-canvas"), {
  ssr: false,
  loading: () => null,
});

type ConnectionHints = Navigator & {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};

const stages = [
  ["01", "UI", "React / Next.js"],
  ["02", "API", "Node / Express"],
  ["03", "DATA", "MongoDB / SQL"],
  ["04", "CHAIN", "Solana / Anchor"],
];

class SceneErrorBoundary extends Component<{
  children: ReactNode;
  onError: () => void;
}> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function StaticEarth({ enhanced }: { enhanced: boolean }) {
  return (
    <div
      className={`hero-static-earth${enhanced ? " hero-static-earth-enhanced" : ""}`}
      aria-hidden="true"
    >
      <div className="static-earth-halo" />
      <div className="static-earth-orbit static-earth-orbit-one" />
      <div className="static-earth-orbit static-earth-orbit-two" />
      <div className="static-earth-sphere">
        <div className="static-earth-grid" />
        <div className="static-earth-land" />
        <i className="static-earth-node static-earth-node-one" />
        <i className="static-earth-node static-earth-node-two" />
        <i className="static-earth-node static-earth-node-three" />
        <i className="static-earth-node static-earth-node-four" />
      </div>
    </div>
  );
}

export function HeroCanvasLoader() {
  const [eligible, setEligible] = useState(false);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [canvasReady, setCanvasReady] = useState(false);
  const [canvasFailed, setCanvasFailed] = useState(false);
  const painted = useRef(false);
  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerPreference = window.matchMedia(
      "(min-width: 900px) and (hover: hover) and (pointer: fine)",
    );
    const connection = navigator as ConnectionHints;
    const element = document.querySelector<HTMLElement>(".hero-art");
    const hero = element?.closest<HTMLElement>(".hero");
    const grid = hero?.querySelector<HTMLElement>(".hero-grid");

    const setGridHover = (event: PointerEvent) => {
      if (!grid || event.pointerType === "touch") return;
      const bounds = grid.getBoundingClientRect();
      grid.style.setProperty("--grid-pointer-x", `${event.clientX - bounds.left}px`);
      grid.style.setProperty("--grid-pointer-y", `${event.clientY - bounds.top}px`);
      grid.style.setProperty("--grid-pointer-opacity", "1");
    };
    const resetGridHover = () => grid?.style.setProperty("--grid-pointer-opacity", "0");

    const checkSupport = () => {
      const lowMemory = typeof connection.deviceMemory === "number" && connection.deviceMemory <= 4;
      const saveData = connection.connection?.saveData === true;
      const shouldEnhance =
        pointerPreference.matches && !motionPreference.matches && !lowMemory && !saveData;
      if (!shouldEnhance) {
        setEligible(false);
        setCanvasReady(false);
        return;
      }
      if (painted.current) setCanvasReady(true);

      try {
        const probe = document.createElement("canvas");
        const context = probe.getContext("webgl2") ?? probe.getContext("webgl");
        const supported = Boolean(context);
        context?.getExtension("WEBGL_lose_context")?.loseContext();
        setEligible(supported);
      } catch {
        setEligible(false);
      }
    };

    const visibility = () => setTabVisible(document.visibilityState === "visible");
    checkSupport();
    visibility();
    hero?.addEventListener("pointermove", setGridHover, { passive: true });
    hero?.addEventListener("pointerleave", resetGridHover);
    pointerPreference.addEventListener("change", checkSupport);
    motionPreference.addEventListener("change", checkSupport);
    document.addEventListener("visibilitychange", visibility);

    let observer: IntersectionObserver | undefined;
    let initialFrame = 0;
    let secondFrame = 0;
    let readyTimeout = 0;
    if (element && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
        rootMargin: "120px",
      });
      observer.observe(element);
    }

    // Start the optional canvas after the server-rendered hero has had two paints.
    initialFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        readyTimeout = window.setTimeout(() => {
          painted.current = true;
          setCanvasReady(true);
        }, 180);
      });
    });

    return () => {
      window.cancelAnimationFrame(initialFrame);
      window.cancelAnimationFrame(secondFrame);
      window.clearTimeout(readyTimeout);
      observer?.disconnect();
      hero?.removeEventListener("pointermove", setGridHover);
      hero?.removeEventListener("pointerleave", resetGridHover);
      pointerPreference.removeEventListener("change", checkSupport);
      motionPreference.removeEventListener("change", checkSupport);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  const showCanvas = eligible && inView && tabVisible && canvasReady && !canvasFailed;

  return (
    <>
      <StaticEarth enhanced={showCanvas} />
      <div className="hero-stage-overlay" aria-hidden="true">
        {stages.map(([number, name, detail], index) => (
          <span className={`hero-stage-label hero-stage-label-${index + 1}`} key={name}>
            <small>{number}</small>
            <strong>{name}</strong>
            <span>{detail}</span>
          </span>
        ))}
      </div>
      {showCanvas && (
        <SceneErrorBoundary onError={() => setCanvasFailed(true)}>
          <Suspense fallback={null}>
            <HeroCanvas />
          </Suspense>
        </SceneErrorBoundary>
      )}
    </>
  );
}
