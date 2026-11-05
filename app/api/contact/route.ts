import nodemailer from "nodemailer";

export const runtime = "nodejs";

const subjects = new Set(["Hiring", "Freelance", "Collaboration", "Other"]);
const requestsByAddress = new Map<string, number[]>();
const requestWindowMs = 60 * 60 * 1000;
const requestLimit = 3;

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  website?: unknown;
};

function json(message: string, status: number) {
  return Response.json({ message }, { status, headers: { "Cache-Control": "no-store" } });
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return json("Request origin could not be verified.", 403);
  try {
    if (new URL(origin).host !== host) return json("Request origin could not be verified.", 403);
  } catch {
    return json("Request origin could not be verified.", 403);
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json("Send the form as JSON.", 415);
  }
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > 8_192) return json("The message is too large.", 413);

  let payload: ContactPayload;
  try {
    const body = await request.text();
    if (body.length > 8_192) return json("The message is too large.", 413);
    payload = JSON.parse(body) as ContactPayload;
  } catch {
    return json("The request body is invalid.", 400);
  }

  // Quietly accept honeypot submissions without sending mail.
  if (typeof payload.website === "string" && payload.website.trim()) {
    return json("Thanks. Your form submission was received.", 200);
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const subject = typeof payload.subject === "string" ? payload.subject : "";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";
  if (
    name.length < 2 ||
    name.length > 100 ||
    /[\r\n\u0000-\u001f]/.test(name) ||
    !isEmail(email) ||
    !subjects.has(subject) ||
    message.length < 10 ||
    message.length > 4_000
  ) {
    return json("Check your name, email, subject, and message, then try again.", 400);
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, CONTACT_TO } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) {
    return json("Email delivery is not configured yet. Use the direct email fallback.", 503);
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const address = forwardedFor?.split(",").at(-1)?.trim() || "unknown";
  const now = Date.now();
  if (requestsByAddress.size >= 10_000 && !requestsByAddress.has(address)) {
    for (const [key, timestamps] of requestsByAddress) {
      const fresh = timestamps.filter((timestamp) => now - timestamp < requestWindowMs);
      if (fresh.length) requestsByAddress.set(key, fresh);
      else requestsByAddress.delete(key);
    }
    if (requestsByAddress.size >= 10_000) {
      return json("The contact service is busy. Please try again later.", 429);
    }
  }
  const recentRequests = (requestsByAddress.get(address) ?? []).filter(
    (timestamp) => now - timestamp < requestWindowMs,
  );
  if (recentRequests.length >= requestLimit) {
    return json("Too many messages from this connection. Please try again later.", 429);
  }
  recentRequests.push(now);
  requestsByAddress.set(address, recentRequests);

  try {
    const port = Number(SMTP_PORT);
    if (!Number.isInteger(port) || port < 1 || port > 65_535) {
      return json("Email delivery is temporarily unavailable.", 503);
    }
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      requireTLS: port !== 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      connectionTimeout: 8_000,
      greetingTimeout: 8_000,
      socketTimeout: 10_000,
    });
    try {
      await transporter.sendMail({
        from: SMTP_FROM || SMTP_USER,
        to: CONTACT_TO,
        replyTo: { name, address: email },
        subject: `Portfolio inquiry: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
      });
    } finally {
      transporter.close();
    }
    return json("Your message was accepted by the configured mail server.", 200);
  } catch {
    return json("Email delivery failed. Please use the direct email fallback.", 502);
  }
}
