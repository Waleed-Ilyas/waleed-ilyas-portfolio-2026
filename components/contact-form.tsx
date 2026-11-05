"use client";

import { type FormEvent, useState } from "react";
import { Icon } from "@/components/icon";

type ContactResult = {
  kind: "success" | "error";
  message: string;
  fallback?: string;
};

export function ContactForm() {
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<ContactResult | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const subject = String(data.get("subject") ?? "Other");
    const message = String(data.get("message") ?? "").trim();
    const fallbackQuery = new URLSearchParams({
      subject: `Portfolio inquiry: ${subject}`,
      body: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
    });
    const fallback = `mailto:waleedilyas99@gmail.com?${fallbackQuery.toString()}`;
    setSending(true);
    setResult(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          website: String(data.get("website") ?? ""),
        }),
      });
      const responseBody = (await response.json()) as { message?: string };
      if (!response.ok) {
        setResult({
          kind: "error",
          message:
            responseBody.message ?? "Email delivery is unavailable. Use the direct email fallback.",
          fallback: response.status === 400 ? undefined : fallback,
        });
        return;
      }
      form.reset();
      setResult({
        kind: "success",
        message: responseBody.message ?? "Your message was accepted by the configured mail server.",
      });
    } catch {
      setResult({
        kind: "error",
        message: "The contact service could not be reached. Use the direct email fallback.",
        fallback,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="contact-form" onSubmit={submit}>
      <h3>Send a message</h3>
      <p>Messages use the configured mail service when available, with a direct email fallback.</p>
      <div className="contact-form-row">
        <label>
          Your name
          <input
            name="name"
            type="text"
            autoComplete="name"
            minLength={2}
            maxLength={100}
            required
          />
        </label>
        <label>
          Email address
          <input name="email" type="email" autoComplete="email" maxLength={254} required />
        </label>
      </div>
      <label>
        Subject
        <select name="subject" defaultValue="Hiring" required>
          <option>Hiring</option>
          <option>Freelance</option>
          <option>Collaboration</option>
          <option>Other</option>
        </select>
      </label>
      <label>
        Message
        <textarea name="message" minLength={10} maxLength={4000} rows={5} required />
      </label>
      <div className="contact-honeypot" aria-hidden="true">
        <label>
          Leave this field empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <button className="contact-submit" type="submit" disabled={sending}>
        {sending ? "Preparing message…" : "Send message"}
        <Icon name="arrow" />
      </button>
      <p className="contact-form-result" role="status" aria-live="polite">
        {result && (
          <>
            <span className={result.kind}>{result.message}</span>
            {result.fallback && <a href={result.fallback}>Open your email app with this message</a>}
          </>
        )}
      </p>
    </form>
  );
}
