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

const layers = [
  ["01", "UI", "React / Next.js"],
  ["02", "API", "Node / Express"],
  ["03", "DATABASE", "MongoDB / SQL"],
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

function StaticStack({ enhanced }: { enhanced: boolean }) {
  return (
    <div
      className={`hero-static-stack${enhanced ? " hero-static-stack-enhanced" : ""}`}
      aria-hidden="true"
    >
      <div className="static-stack-halo" />
      {layers.map(([number, name, detail], index) => (
        <div className={`static-stack-layer static-stack-layer-${index + 1}`} key={name}>
          <span className="static-layer-number">{number}</span>
          <span className="static-layer-copy">
            <strong>{name}</strong>
            <small>{detail}</small>
          </span>
          <span className="static-layer-port" />
        </div>
      ))}
      <div className="static-particle-stream" />
      <div className="static-chain-links">
        <i />
        <i />
        <i />
      </div>
      <span className="static-stack-caption">ONE PRODUCT / EVERY LAYER</span>
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
      pointerPreference.removeEventListener("change", checkSupport);
      motionPreference.removeEventListener("change", checkSupport);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  const showCanvas = eligible && inView && tabVisible && canvasReady && !canvasFailed;

  return (
    <>
      <StaticStack enhanced={showCanvas} />
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
