import express from "express";
import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = Number(process.env.API_PORT || 4105);
const dataPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "data.json");
const origins = new Set(["http://localhost:3005", "http://127.0.0.1:3005"]);
app.disable("x-powered-by");
app.use((req, res, next) => {
  const origin = req.get("origin");
  if (origin && !origins.has(origin)) return res.status(403).json({ error: "Origin not allowed" });
  if (origin) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});
app.use(express.json({ limit: "32kb", strict: true }));
async function loadStore() {
  return JSON.parse(await readFile(dataPath, "utf8"));
}
async function saveStore(store) {
  const temporary = `${dataPath}.${crypto.randomUUID()}.tmp`;
  await writeFile(temporary, `${JSON.stringify(store, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
  await rename(temporary, dataPath);
}
app.get("/api/health", (_req, res) => res.json({ status: "ok", storage: "local-json" }));
app.get("/api/users", async (_req, res, next) => {
  try {
    res.json({ data: (await loadStore()).users });
  } catch (error) {
    next(error);
  }
});
app.get("/api/posts", async (req, res, next) => {
  try {
    const store = await loadStore();
    const limit = Math.min(40, Math.max(1, Number(req.query.limit) || 20));
    const offset = Math.max(0, Number(req.query.offset) || 0);
    res.json({
      data: store.posts.slice(offset, offset + limit),
      pagination: {
        offset,
        limit,
        total: store.posts.length,
        hasMore: offset + limit < store.posts.length,
      },
    });
  } catch (error) {
    next(error);
  }
});
app.post("/api/posts", async (req, res, next) => {
  try {
    const body = typeof req.body?.body === "string" ? req.body.body.trim() : "";
    if (!body || body.length > 1000)
      return res.status(400).json({ error: "Post text must contain 1–1000 characters." });
    const store = await loadStore();
    const post = {
      id: crypto.randomUUID(),
      handle: "demo-member",
      body,
      topic: "Community",
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
    };
    store.posts.unshift(post);
    await saveStore(store);
    res.status(201).json({ data: post });
  } catch (error) {
    next(error);
  }
});
app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError)
    return res.status(400).json({ error: "Request body must be valid JSON." });
  if (error?.type === "entity.too.large")
    return res.status(413).json({ error: "Request body is too large." });
  console.error("SocialSphere API request failed", error);
  res.status(500).json({ error: "The local API could not complete the request." });
});
app.listen(port, "127.0.0.1", () =>
  console.log(`SocialSphere local API listening on http://127.0.0.1:${port}`),
);
