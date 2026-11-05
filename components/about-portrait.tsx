"use client";

import Image from "next/image";
import type { PointerEvent } from "react";

export function AboutPortrait() {
  function followPointer(event: PointerEvent<HTMLElement>) {
    if (
      event.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    event.currentTarget.style.setProperty("--tilt-x", `${(0.5 - y) * 5}deg`);
    event.currentTarget.style.setProperty("--tilt-y", `${(x - 0.5) * 5}deg`);
    event.currentTarget.style.setProperty("--spot-x", `${x * 100}%`);
    event.currentTarget.style.setProperty("--spot-y", `${y * 100}%`);
  }

  function resetPointer(event: PointerEvent<HTMLElement>) {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "-2deg");
    event.currentTarget.style.setProperty("--spot-x", "50%");
    event.currentTarget.style.setProperty("--spot-y", "50%");
  }

  return (
    <figure
      className="about-portrait"
      onPointerMove={followPointer}
      onPointerLeave={resetPointer}
      onPointerCancel={resetPointer}
    >
      <Image
        src="/images/waleed-profile-square.png"
        alt="Waleed Ilyas, full stack and Solana developer"
        width={800}
        height={800}
        sizes="(max-width: 640px) 70vw, (max-width: 900px) 42vw, 300px"
        quality={82}
      />
      <figcaption>
        WALEED ILYAS <span>· REMOTE</span>
      </figcaption>
    </figure>
  );
}
