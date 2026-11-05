"use client";

import { useEffect } from "react";

export function ScrollReveals() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cancelled = false;
    let context: { revert: () => void } | undefined;

    const mountAnimations = async () => {
      if (preference.matches) return;
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || preference.matches) return;

      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-scroll-reveal]").forEach((element) => {
          const direction = element.dataset.scrollReveal;
          const offset = direction === "left" ? { x: -22, y: 0 } : { x: 0, y: 22 };
          gsap.fromTo(
            element,
            { autoAlpha: 0, ...offset },
            {
              autoAlpha: 1,
              x: 0,
              y: 0,
              duration: 0.65,
              ease: "power2.out",
              scrollTrigger: { trigger: element, start: "top 88%", once: true },
            },
          );
        });
      });
    };

    const onMotionChange = () => {
      if (preference.matches) {
        context?.revert();
        context = undefined;
      } else {
        void mountAnimations();
      }
    };

    void mountAnimations();
    preference.addEventListener("change", onMotionChange);
    return () => {
      cancelled = true;
      preference.removeEventListener("change", onMotionChange);
      context?.revert();
    };
  }, []);

  return null;
}
