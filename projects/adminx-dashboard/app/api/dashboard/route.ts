import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import type { Member, WorkItem } from "../../../src/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const databaseDirectory = join(process.cwd(), ".data");
let database: DatabaseSync | undefined;

const seedMembers: Member[] = [
  {
    id: 1,
    name: "Avery Morgan",
    email: "avery@example.test",
    role: "Admin",
    status: "Active",
    initials: "AM",
    color: "violet",
  },
  {
    id: 2,
    name: "Jordan Lee",
    email: "jordan@example.test",
    role: "Manager",
    status: "Active",
    initials: "JL",
    color: "blue",
  },
  {
    id: 3,
    name: "Taylor Reed",
    email: "taylor@example.test",
    role: "Developer",
    status: "Active",
    initials: "TR",
    color: "orange",
  },
  {
    id: 4,
    name: "Casey Park",
    email: "casey@example.test",
    role: "Designer",
    status: "Invited",
    initials: "CP",
    color: "pink",
  },
  {
    id: 5,
    name: "Riley Shah",
    email: "riley@example.test",
    role: "Developer",
    status: "Active",
    initials: "RS",
    color: "green",
  },
  {
    id: 6,
    name: "Morgan Ellis",
    email: "morgan@example.test",
    role: "Manager",
    status: "Inactive",
    initials: "ME",
    color: "yellow",
  },
];

const seedTasks: WorkItem[] = [
  {
    id: 1,
    title: "Refine onboarding flow",
    project: "Website redesign",
    priority: "High",
    owner: "Avery Morgan",
    initials: "AM",
    color: "violet",
    due: "Today",
    status: "Todo",
  },
  {
    id: 2,
    title: "Review component library",
    project: "Design system",
    priority: "Medium",
    owner: "Jordan Lee",
    initials: "JL",
    color: "blue",
    due: "Nov 06",
    status: "Todo",
  },
  {
    id: 3,
    title: "Add workspace permissions",
    project: "AdminX dashboard",
    priority: "Urgent",
    owner: "Taylor Reed",
    initials: "TR",
    color: "orange",
    due: "Nov 05",
    status: "In progress",
  },
  {
    id: 4,
    title: "Update reporting filters",
    project: "Analytics",
    priority: "Low",
    owner: "Riley Shah",
    initials: "RS",
    color: "green",
    due: "Nov 08",
    status: "In progress",
  },
  {
    id: 5,
    title: "Test mobile navigation",
    project: "Website redesign",
    priority: "High",
    owner: "Casey Park",
    initials: "CP",
    color: "pink",
    due: "Nov 07",
    status: "Review",
  },
  {
    id: 6,
    title: "Document API responses",
    project: "Platform",
    priority: "Medium",
    owner: "Morgan Ellis",
    initials: "ME",
    color: "yellow",
    due: "Nov 04",
    status: "Done",
  },
];

function getDatabase() {
  if (database) return database;
  mkdirSync(databaseDirectory, { recursive: true });
  database = new DatabaseSync(join(databaseDirectory, "adminx.sqlite"));
  database.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL, status TEXT NOT NULL, initials TEXT NOT NULL, color TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS work_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, project TEXT NOT NULL,
      priority TEXT NOT NULL, owner TEXT NOT NULL, initials TEXT NOT NULL, color TEXT NOT NULL,
      due TEXT NOT NULL, status TEXT NOT NULL
    );
  `);
  database.exec("BEGIN IMMEDIATE");
  try {
    const memberCount = database.prepare("SELECT COUNT(*) AS count FROM members").get() as {
      count: number;
    };
    const taskCount = database.prepare("SELECT COUNT(*) AS count FROM work_items").get() as {
      count: number;
    };
    if (memberCount.count === 0) {
      const insert = database!.prepare(
        "INSERT INTO members (id,name,email,role,status,initials,color) VALUES (?,?,?,?,?,?,?)",
      );
      for (const member of seedMembers)
        insert.run(
          member.id,
          member.name,
          member.email,
          member.role,
          member.status,
          member.initials,
          member.color,
        );
    }
    if (taskCount.count === 0) {
      const insert = database!.prepare(
        "INSERT INTO work_items (id,title,project,priority,owner,initials,color,due,status) VALUES (?,?,?,?,?,?,?,?,?)",
      );
      for (const task of seedTasks)
        insert.run(
          task.id,
          task.title,
          task.project,
          task.priority,
          task.owner,
          task.initials,
          task.color,
          task.due,
          task.status,
        );
    }
    database.exec("COMMIT");
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
  return database;
}

function readDashboard(db: DatabaseSync) {
  return {
    members: db
      .prepare("SELECT id,name,email,role,status,initials,color FROM members ORDER BY id")
      .all() as Member[],
    workItems: db
      .prepare(
        "SELECT id,title,project,priority,owner,initials,color,due,status FROM work_items ORDER BY id DESC",
      )
      .all() as WorkItem[],
  };
}

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export async function GET() {
  if (process.env.NODE_ENV === "production")
    return errorResponse("This demo API is available in local development only.", 404);
  try {
    return Response.json(readDashboard(getDatabase()), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return errorResponse("Dashboard data could not be loaded.", 500);
  }
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production")
    return errorResponse("This demo API is available in local development only.", 404);
  if (!sameOrigin(request)) return errorResponse("Cross-origin requests are not accepted.", 403);
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 4096) return errorResponse("Request is too large.", 413);

  let body: unknown;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > 4096)
      return errorResponse("Request is too large.", 413);
    body = JSON.parse(raw);
  } catch {
    return errorResponse("Expected a JSON request body.", 400);
  }
  if (!body || typeof body !== "object") return errorResponse("Invalid request.", 400);
  const data = body as Record<string, unknown>;
  const db = getDatabase();

  try {
    if (data.action === "add-member") {
      if (
        typeof data.name !== "string" ||
        data.name.trim().length < 2 ||
        data.name.length > 80 ||
        typeof data.email !== "string" ||
        data.email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ||
        !["Admin", "Manager", "Developer", "Designer"].includes(String(data.role))
      )
        return errorResponse("Member details are invalid.", 400);
      const colors = ["violet", "blue", "orange", "pink", "green", "yellow"];
      const memberCount = db.prepare("SELECT COUNT(*) AS count FROM members").get() as {
        count: number;
      };
      const color = colors[memberCount.count % colors.length];
      db.prepare(
        "INSERT INTO members (name,email,role,status,initials,color) VALUES (?,?,?,'Invited',?,?)",
      ).run(
        data.name.trim(),
        data.email.trim().toLowerCase(),
        String(data.role),
        initials(data.name),
        color,
      );
    } else if (data.action === "update-member") {
      if (
        !Number.isSafeInteger(data.id) ||
        Number(data.id) < 1 ||
        typeof data.name !== "string" ||
        data.name.trim().length < 2 ||
        data.name.length > 80 ||
        typeof data.email !== "string" ||
        data.email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ||
        !["Admin", "Manager", "Developer", "Designer"].includes(String(data.role))
      )
        return errorResponse("Member details are invalid.", 400);
      const result = db
        .prepare("UPDATE members SET name=?,email=?,role=?,initials=? WHERE id=?")
        .run(
          data.name.trim(),
          data.email.trim().toLowerCase(),
          String(data.role),
          initials(data.name),
          Number(data.id),
        );
      if (!result.changes) return errorResponse("Member was not found.", 404);
    } else if (data.action === "remove-member") {
      if (!Number.isSafeInteger(data.id) || Number(data.id) < 1)
        return errorResponse("Member id is invalid.", 400);
      const result = db.prepare("DELETE FROM members WHERE id=?").run(Number(data.id));
      if (!result.changes) return errorResponse("Member was not found.", 404);
    } else if (data.action === "add-task") {
      const values = [
        data.title,
        String(data.project),
        String(data.priority),
        String(data.owner),
        String(data.initials),
        String(data.color),
        String(data.due),
      ];
      if (
        values.some((value) => typeof value !== "string") ||
        String(data.title).trim().length < 2 ||
        String(data.title).length > 160 ||
        String(data.project).length > 120 ||
        String(data.owner).length > 80 ||
        !["Urgent", "High", "Medium", "Low"].includes(String(data.priority))
      )
        return errorResponse("Task details are invalid.", 400);
      db.prepare(
        "INSERT INTO work_items (title,project,priority,owner,initials,color,due,status) VALUES (?,?,?,?,?,?,?,'Todo')",
      ).run(
        String(data.title).trim(),
        String(data.project),
        String(data.priority),
        String(data.owner),
        String(data.initials),
        String(data.color),
        String(data.due),
      );
    } else if (data.action === "move-task") {
      if (
        !Number.isSafeInteger(data.id) ||
        Number(data.id) < 1 ||
        !["Todo", "In progress", "Review", "Done"].includes(String(data.status))
      )
        return errorResponse("Task update is invalid.", 400);
      const result = db
        .prepare("UPDATE work_items SET status=? WHERE id=?")
        .run(String(data.status), Number(data.id));
      if (!result.changes) return errorResponse("Task was not found.", 404);
    } else {
      return errorResponse("Unsupported action.", 400);
    }
    return Response.json(readDashboard(db), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof Error && error.message.includes("UNIQUE constraint failed"))
      return errorResponse("That email address is already on the team.", 409);
    return errorResponse("Dashboard changes could not be saved.", 500);
  }
}
