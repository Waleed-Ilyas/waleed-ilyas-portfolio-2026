"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const ContactForm = dynamic(
  () => import("@/components/contact-form").then((module) => module.ContactForm),
  {
    ssr: false,
    loading: () => (
      <div className="form-skeleton" aria-label="Loading contact form">
        <span />
        <span />
        <span />
        <span />
      </div>
    ),
  },
);

export function ContactFormLoader() {
  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = container.current;
    if (!element || !("IntersectionObserver" in window)) {
      const frame = window.requestAnimationFrame(() => setReady(true));
      return () => window.cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setReady(true);
        observer.disconnect();
      },
      { rootMargin: "180px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="contact-form-loader" ref={container}>
      {ready ? (
        <ContactForm />
      ) : (
        <div className="contact-form-placeholder">
          <h3>Send a message</h3>
          <p>The contact form loads when this section is near.</p>
          <div className="form-skeleton" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <a href="mailto:waleedilyas99@gmail.com">Or email me directly</a>
        </div>
      )}
    </div>
  );
}
