import { create } from "zustand";

export type Member = {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Developer" | "Designer";
  status: "Active" | "Invited" | "Inactive";
  initials: string;
  color: string;
};

export type WorkItem = {
  id: number;
  title: string;
  project: string;
  priority: "Urgent" | "High" | "Medium" | "Low";
  owner: string;
  initials: string;
  color: string;
  due: string;
  status: "Todo" | "In progress" | "Review" | "Done";
};

type DashboardStore = {
  members: Member[];
  workItems: WorkItem[];
  dataReady: boolean;
  initialize: () => Promise<boolean>;
  addMember: (member: Omit<Member, "id" | "initials" | "color">) => Promise<void>;
  updateMember: (member: Member) => Promise<void>;
  removeMember: (id: number) => Promise<void>;
  addWorkItem: (item: Omit<WorkItem, "id">) => Promise<void>;
  moveWorkItem: (id: number, status: WorkItem["status"]) => Promise<void>;
};

const initialMembers: Member[] = [
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

const initialWorkItems: WorkItem[] = [
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

type DashboardResponse = { members: Member[]; workItems: WorkItem[]; error?: string };
let mutationQueue: Promise<void> = Promise.resolve();

async function sendDashboardAction(action: Record<string, unknown>) {
  const response = await fetch("/api/dashboard", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(action),
  });
  const data = (await response.json()) as DashboardResponse;
  if (!response.ok) throw new Error(data.error ?? "Dashboard change failed.");
  return data;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  members: initialMembers,
  workItems: initialWorkItems,
  dataReady: false,
  initialize: async () => {
    if (process.env.NODE_ENV === "production") {
      set({ dataReady: true });
      return false;
    }
    try {
      const response = await fetch("/api/dashboard", { cache: "no-store" });
      if (!response.ok) throw new Error("Dashboard data could not be loaded.");
      const data = (await response.json()) as DashboardResponse;
      set({ members: data.members, workItems: data.workItems, dataReady: true });
      return true;
    } catch {
      set({ dataReady: true });
      return false;
    }
  },
  addMember: (member) => queueMutation({ action: "add-member", ...member }, set, get),
  updateMember: (member) => queueMutation({ action: "update-member", ...member }, set, get),
  removeMember: (id) => queueMutation({ action: "remove-member", id }, set, get),
  addWorkItem: (item) => queueMutation({ action: "add-task", ...item }, set, get),
  moveWorkItem: (id, status) => queueMutation({ action: "move-task", id, status }, set, get),
}));

function queueMutation(
  action: Record<string, unknown>,
  set: (state: Partial<DashboardStore>) => void,
  get: () => DashboardStore,
) {
  const operation = mutationQueue.then(async () => {
    if (process.env.NODE_ENV === "production") {
      const { members, workItems } = get();
      if (action.action === "add-member") {
        const name = String(action.name).trim();
        const initials = name
          .split(/\s+/)
          .slice(0, 2)
          .map((part) => part[0]?.toUpperCase() ?? "")
          .join("");
        set({
          members: [
            ...members,
            {
              id: Math.max(0, ...members.map((member) => member.id)) + 1,
              name,
              email: String(action.email).trim().toLowerCase(),
              role: action.role as Member["role"],
              status: action.status as Member["status"],
              initials,
              color: "violet",
            },
          ],
        });
      } else if (action.action === "update-member") {
        const updated = action as unknown as Member;
        set({ members: members.map((member) => (member.id === updated.id ? updated : member)) });
      } else if (action.action === "remove-member") {
        set({ members: members.filter((member) => member.id !== Number(action.id)) });
      } else if (action.action === "add-task") {
        set({
          workItems: [
            ...workItems,
            {
              ...(action as unknown as Omit<WorkItem, "id">),
              id: Math.max(0, ...workItems.map((item) => item.id)) + 1,
            },
          ],
        });
      } else if (action.action === "move-task") {
        set({
          workItems: workItems.map((item) =>
            item.id === Number(action.id)
              ? { ...item, status: action.status as WorkItem["status"] }
              : item,
          ),
        });
      }
      return;
    }
    const data = await sendDashboardAction(action);
    set({ members: data.members, workItems: data.workItems });
  });
  mutationQueue = operation.catch(() => undefined);
  return operation;
}
