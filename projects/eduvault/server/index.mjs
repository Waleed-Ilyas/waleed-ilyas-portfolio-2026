import express from "express";
import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = Number(process.env.API_PORT || 4106);
const dataPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "data.json");
const origins = new Set(["http://localhost:3006", "http://127.0.0.1:3006"]);
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
app.use(express.json({ limit: "16kb", strict: true }));
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
app.get("/api/courses", async (_req, res, next) => {
  try {
    res.json({ data: (await loadStore()).courses });
  } catch (error) {
    next(error);
  }
});
app.post("/api/enrollments", async (req, res, next) => {
  try {
    const courseId = typeof req.body?.courseId === "string" ? req.body.courseId : "";
    if (!courseId) return res.status(400).json({ error: "A course ID is required." });
    const store = await loadStore();
    if (!store.courses.some((course) => course.id === courseId))
      return res.status(404).json({ error: "Course not found." });
    const enrollment = {
      id: crypto.randomUUID(),
      courseId,
      learner: "Demo learner",
      progress: 0,
      createdAt: new Date().toISOString(),
    };
    store.enrollments.push(enrollment);
    await saveStore(store);
    res.status(201).json({ data: enrollment });
  } catch (error) {
    next(error);
  }
});
app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError)
    return res.status(400).json({ error: "Request body must be valid JSON." });
  if (error?.type === "entity.too.large")
    return res.status(413).json({ error: "Request body is too large." });
  console.error("EduVault API request failed", error);
  res.status(500).json({ error: "The local API could not complete the request." });
});
app.listen(port, "127.0.0.1", () =>
  console.log(`EduVault local API listening on http://127.0.0.1:${port}`),
);
