"use client";

import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Command,
  Download,
  Ellipsis,
  FileText,
  Filter,
  LayoutDashboard,
  ListTodo,
  Menu,
  MessageSquare,
  Moon,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  Trash2,
  Users,
  X,
} from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Line as ChartLine,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDashboardStore, type Member, type WorkItem } from "../src/store";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type View = "Overview" | "Projects" | "Tasks" | "Calendar" | "Team" | "Reports" | "Settings";
type Theme = "light" | "dark" | "violet";
type CalendarEvent = {
  id: number;
  year: number;
  month: number;
  day: number;
  time: string;
  title: string;
  type: "meeting" | "review" | "planning";
};

const navItems: { label: View; icon: typeof LayoutDashboard; badge?: string }[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Projects", icon: FileText },
  { label: "Tasks", icon: ListTodo, badge: "8" },
  { label: "Calendar", icon: CalendarDays },
  { label: "Team", icon: Users },
  { label: "Reports", icon: Activity },
];

const weeklyActivity = [
  { day: "Mon", current: 34, previous: 22 },
  { day: "Tue", current: 45, previous: 30 },
  { day: "Wed", current: 39, previous: 27 },
  { day: "Thu", current: 62, previous: 35 },
  { day: "Fri", current: 51, previous: 31 },
  { day: "Sat", current: 72, previous: 43 },
  { day: "Sun", current: 58, previous: 38 },
];

const projectActivity = [
  { name: "Mon", completed: 18 },
  { name: "Tue", completed: 24 },
  { name: "Wed", completed: 21 },
  { name: "Thu", completed: 30 },
  { name: "Fri", completed: 25 },
  { name: "Sat", completed: 34 },
  { name: "Sun", completed: 29 },
];

const teamMetrics = [
  { area: "Delivery", team: 78, target: 75 },
  { area: "Planning", team: 84, target: 80 },
  { area: "Quality", team: 91, target: 88 },
  { area: "Focus", team: 72, target: 76 },
  { area: "Support", team: 86, target: 82 },
  { area: "Growth", team: 68, target: 70 },
];

const taskDistribution = [
  { name: "Completed", value: 46, color: "#7666ef" },
  { name: "In progress", value: 29, color: "#39b6a0" },
  { name: "In review", value: 16, color: "#f4b84b" },
  { name: "To do", value: 9, color: "#d9dbe8" },
];

const projectList = [
  {
    name: "Website redesign",
    initials: "WR",
    color: "violet",
    owner: "Avery Morgan",
    progress: 78,
    tasks: "18 / 24",
    due: "Nov 12",
    state: "On track",
  },
  {
    name: "Design system",
    initials: "DS",
    color: "blue",
    owner: "Jordan Lee",
    progress: 56,
    tasks: "14 / 25",
    due: "Nov 18",
    state: "On track",
  },
  {
    name: "Mobile app",
    initials: "MA",
    color: "orange",
    owner: "Taylor Reed",
    progress: 32,
    tasks: "8 / 25",
    due: "Nov 22",
    state: "At risk",
  },
  {
    name: "Analytics v2",
    initials: "A2",
    color: "green",
    owner: "Riley Shah",
    progress: 91,
    tasks: "20 / 22",
    due: "Nov 09",
    state: "On track",
  },
];

const eventSeed = [
  {
    id: 1,
    year: 2026,
    month: 10,
    day: 4,
    time: "10:30",
    title: "Product standup",
    type: "meeting",
  },
  {
    id: 2,
    year: 2026,
    month: 10,
    day: 4,
    time: "14:00",
    title: "Review sprint goals",
    type: "review",
  },
  { id: 3, year: 2026, month: 10, day: 6, time: "11:00", title: "Design critique", type: "review" },
  {
    id: 4,
    year: 2026,
    month: 10,
    day: 10,
    time: "13:30",
    title: "Project kickoff",
    type: "meeting",
  },
  {
    id: 5,
    year: 2026,
    month: 10,
    day: 13,
    time: "15:00",
    title: "Analytics demo",
    type: "meeting",
  },
  {
    id: 6,
    year: 2026,
    month: 10,
    day: 18,
    time: "09:30",
    title: "Sprint planning",
    type: "planning",
  },
  {
    id: 7,
    year: 2026,
    month: 10,
    day: 25,
    time: "16:00",
    title: "Monthly wrap-up",
    type: "meeting",
  },
] satisfies CalendarEvent[];

function Avatar({
  initials,
  color,
  size = "normal",
}: {
  initials: string;
  color: string;
  size?: "normal" | "small";
}) {
  return (
    <span
      className={`avatar avatar-${color} ${size === "small" ? "avatar-small" : ""}`}
      aria-label={`Avatar ${initials}`}
    >
      {initials}
    </span>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { color?: string; name?: string; value?: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <strong>{label}</strong>
      {payload.map((entry) => (
        <span key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </span>
      ))}
    </div>
  );
}

function ChartSkeleton({ kind = "area" }: { kind?: "area" | "donut" | "bar" | "line" | "radar" }) {
  return (
    <div className={`chart-skeleton skeleton-${kind}`} role="status" aria-label="Loading chart">
      {kind === "donut" ? (
        <i />
      ) : (
        <div className="skeleton-columns">
          {[34, 56, 42, 75, 61, 88, 68].map((height, index) => (
            <i key={index} style={{ height: `${height}%` }} />
          ))}
        </div>
      )}
      <span>Loading chart</span>
    </div>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    (
      (dialog.querySelector("[autofocus]") as HTMLElement | null) ??
      dialog.querySelector<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
    )?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-head">
          <h2 id="modal-title">{title}</h2>
          <button className="icon-button" type="button" aria-label="Close dialog" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

export default function AdminXDashboard() {
  const [view, setView] = useState<View>("Overview");
  const [theme, setTheme] = useState<Theme>("light");
  const [mobileNav, setMobileNav] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unread, setUnread] = useState(3);
  const [search, setSearch] = useState("");
  const [taskFilter, setTaskFilter] = useState("All tasks");
  const [modal, setModal] = useState<
    "member" | "edit-member" | "task" | "event" | "edit-event" | null
  >(null);
  const [toast, setToast] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>(eventSeed);
  const [calendarDate, setCalendarDate] = useState(() => new Date(2026, 10, 1));
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [memberForm, setMemberForm] = useState({
    name: "",
    email: "",
    role: "Developer" as Member["role"],
  });
  const [taskForm, setTaskForm] = useState({
    title: "",
    project: "AdminX dashboard",
    priority: "Medium" as WorkItem["priority"],
  });
  const [eventForm, setEventForm] = useState({ title: "", day: "", time: "10:00" });
  const [userFilter, setUserFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [draggedTask, setDraggedTask] = useState<number | null>(null);
  const [chartsReady, setChartsReady] = useState(false);
  const globalSearchRef = useRef<HTMLInputElement>(null);
  const calendarYear = calendarDate.getFullYear();
  const calendarMonth = calendarDate.getMonth();
  const calendarOffset = (new Date(calendarYear, calendarMonth, 1).getDay() + 6) % 7;
  const calendarDays = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const calendarCellCount = Math.ceil((calendarOffset + calendarDays) / 7) * 7;
  const members = useDashboardStore((state) => state.members);
  const workItems = useDashboardStore((state) => state.workItems);
  const initialize = useDashboardStore((state) => state.initialize);
  const addMember = useDashboardStore((state) => state.addMember);
  const updateMember = useDashboardStore((state) => state.updateMember);
  const removeMember = useDashboardStore((state) => state.removeMember);
  const addWorkItem = useDashboardStore((state) => state.addWorkItem);
  const moveWorkItem = useDashboardStore((state) => state.moveWorkItem);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }, []);

  const closeModal = useCallback(() => setModal(null), []);
  const openMemberEdit = useCallback((member: Member) => {
    setEditingMember(member);
    setMemberForm({ name: member.name, email: member.email, role: member.role });
    setModal("edit-member");
  }, []);
  const openNewMember = useCallback(() => {
    setEditingMember(null);
    setMemberForm({ name: "", email: "", role: "Developer" });
    setModal("member");
  }, []);
  const openEventEdit = useCallback((event: CalendarEvent) => {
    setEditingEventId(event.id);
    setEventForm({ title: event.title, day: String(event.day), time: event.time });
    setModal("edit-event");
  }, []);
  const openNewEvent = useCallback(() => {
    setEditingEventId(null);
    setEventForm({ title: "", day: "", time: "10:00" });
    setModal("event");
  }, []);

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        globalSearchRef.current?.focus();
        globalSearchRef.current?.select();
      }
    };
    window.addEventListener("keydown", focusSearch);
    setChartsReady(true);
    void initialize().then((ready) => {
      if (!ready) showToast("Dashboard storage is unavailable. Check the local server and retry.");
    });
    return () => window.removeEventListener("keydown", focusSearch);
  }, [initialize, showToast]);

  const columns = useMemo<ColumnDef<Member>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Member",
        cell: ({ row }) => (
          <div className="member-cell">
            <Avatar initials={row.original.initials} color={row.original.color} />
            <span>
              <strong>{row.original.name}</strong>
              <small>{row.original.email}</small>
            </span>
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ getValue }) => <span className="role-cell">{String(getValue())}</span>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => (
          <span className={`status-pill status-${String(getValue()).toLowerCase()}`}>
            <i />
            {String(getValue())}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="table-actions">
            <button
              className="table-action"
              aria-label={`Edit ${row.original.name}`}
              type="button"
              onClick={() => openMemberEdit(row.original)}
            >
              <Pencil size={14} />
            </button>
            <button
              className="table-action"
              aria-label={`Remove ${row.original.name}`}
              type="button"
              onClick={() => {
                void removeMember(row.original.id)
                  .then(() => showToast(`${row.original.name} removed from this demo workspace`))
                  .catch((error: unknown) =>
                    showToast(
                      error instanceof Error ? error.message : "Member could not be removed.",
                    ),
                  );
              }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ),
      },
    ],
    [openMemberEdit, removeMember, showToast],
  );

  // TanStack Table is intentionally stateful; React Compiler safely skips memoizing this component.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: members,
    columns,
    state: { sorting, globalFilter: userFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setUserFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  const filteredTasks = workItems.filter(
    (item) =>
      `${item.title} ${item.project} ${item.owner}`.toLowerCase().includes(search.toLowerCase()) &&
      (taskFilter === "All tasks" || item.status === taskFilter),
  );

  const handleAddMember = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!memberForm.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberForm.email)) return;
    try {
      if (editingMember) {
        await updateMember({
          ...editingMember,
          name: memberForm.name.trim(),
          email: memberForm.email.trim(),
          role: memberForm.role,
        });
        showToast("Member details saved to this demo workspace");
      } else {
        await addMember({
          name: memberForm.name.trim(),
          email: memberForm.email.trim(),
          role: memberForm.role,
          status: "Invited",
        });
        showToast("Invite added to the demo workspace");
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Member could not be saved.");
      return;
    }
    setEditingMember(null);
    setMemberForm({ name: "", email: "", role: "Developer" });
    setModal(null);
  };

  const handleAddTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!taskForm.title.trim()) return;
    try {
      await addWorkItem({
        title: taskForm.title.trim(),
        project: taskForm.project,
        priority: taskForm.priority,
        owner: "You",
        initials: "YO",
        color: "violet",
        due: "Unscheduled",
        status: "Todo",
      });
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Task could not be saved.");
      return;
    }
    setTaskForm({ title: "", project: "AdminX dashboard", priority: "Medium" });
    setModal(null);
    showToast("Task added to the board");
  };

  const handleAddEvent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const day = Number(eventForm.day);
    if (!eventForm.title.trim() || day < 1 || day > calendarDays) return;
    if (editingEventId !== null) {
      setEvents((current) =>
        current.map((item) =>
          item.id === editingEventId
            ? {
                ...item,
                year: calendarYear,
                month: calendarMonth,
                day,
                time: eventForm.time,
                title: eventForm.title.trim(),
              }
            : item,
        ),
      );
      showToast("Calendar event updated");
    } else {
      setEvents((current) => [
        ...current,
        {
          id: Date.now(),
          year: calendarYear,
          month: calendarMonth,
          day,
          time: eventForm.time,
          title: eventForm.title.trim(),
          type: "planning",
        },
      ]);
      showToast("Event added to the demo calendar");
    }
    setEditingEventId(null);
    setEventForm({ title: "", day: "", time: "10:00" });
    setModal(null);
  };

  const deleteCalendarEvent = () => {
    if (editingEventId === null) return;
    setEvents((current) => current.filter((event) => event.id !== editingEventId));
    setEditingEventId(null);
    setModal(null);
    showToast("Calendar event removed");
  };

  const exportCsv = () => {
    const rows = [
      ["Name", "Email", "Role", "Status"],
      ...members.map((member) => [member.name, member.email, member.role, member.status]),
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "adminx-demo-members.csv";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast("CSV export downloaded");
  };

  const moveMonth = (delta: number) =>
    setCalendarDate((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));

  return (
    <main className="adminx-shell" data-theme={theme}>
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <a
          className="workspace-brand"
          href="#overview"
          onClick={() => {
            setView("Overview");
            setMobileNav(false);
          }}
        >
          <span className="brand-icon">
            <Command size={19} strokeWidth={2.3} />
          </span>
          <span>
            admin<span>X</span>
            <small>WORKSPACE</small>
          </span>
        </a>
        <button
          className="workspace-switcher"
          type="button"
          onClick={() => showToast("Sample Workspace · Demo data only")}
        >
          <span className="workspace-symbol">S</span>
          <span>
            <strong>Sample Workspace</strong>
            <small>Free plan</small>
          </span>
          <ChevronDown size={15} />
        </button>
        <div className="side-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Workspace navigation">
          {navItems.map(({ label, icon: Icon, badge }) => (
            <button
              className={`nav-item ${view === label ? "nav-active" : ""}`}
              type="button"
              key={label}
              onClick={() => {
                setView(label);
                setMobileNav(false);
              }}
              aria-current={view === label ? "page" : undefined}
            >
              <Icon size={17} />
              <span>{label}</span>
              {badge && <small>{badge}</small>}
            </button>
          ))}
        </nav>
        <div className="side-label side-label-projects">
          YOUR PROJECTS{" "}
          <button
            type="button"
            aria-label="Add a project"
            onClick={() => showToast("Project creation is a demo-only interaction")}
          >
            <Plus size={14} />
          </button>
        </div>
        <div className="side-projects">
          <button type="button" onClick={() => setView("Projects")}>
            <i className="project-dot dot-purple" /> Website redesign <span>6</span>
          </button>
          <button type="button" onClick={() => setView("Projects")}>
            <i className="project-dot dot-blue" /> Design system <span>3</span>
          </button>
          <button type="button" onClick={() => setView("Projects")}>
            <i className="project-dot dot-orange" /> Mobile app <span>4</span>
          </button>
        </div>
        <div className="sidebar-bottom">
          <button className="nav-item" type="button" onClick={() => setView("Settings")}>
            <Settings size={17} />
            <span>Settings</span>
          </button>
          <button
            className="nav-item"
            type="button"
            onClick={() => showToast("Help center is not connected in this local demo")}
          >
            <CircleHelp size={17} />
            <span>Help center</span>
          </button>
          <div className="profile-row">
            <Avatar initials="WI" color="violet" />
            <span>
              <strong>Workspace Admin</strong>
              <small>admin@example.test</small>
            </span>
            <button
              type="button"
              aria-label="Profile options"
              onClick={() => showToast("Profile menu is demo only")}
            >
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>
      </aside>
      {mobileNav && (
        <button
          className="mobile-scrim"
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileNav(false)}
        />
      )}

      <section className="main-area">
        <header className="topbar">
          <button
            className="mobile-menu icon-button"
            type="button"
            aria-label="Open navigation"
            onClick={() => setMobileNav(true)}
          >
            <Menu size={19} />
          </button>
          <div className="breadcrumbs">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <strong>{view}</strong>
          </div>
          <div className="topbar-right">
            <label className="global-search">
              <Search size={15} />
              <input
                ref={globalSearchRef}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search anything..."
                aria-label="Search tasks and projects"
              />
              <kbd>⌘ K</kbd>
            </label>
            <button
              className="icon-button theme-toggle"
              type="button"
              aria-label={`Change color theme, current ${theme}`}
              onClick={() =>
                setTheme((value) =>
                  value === "light" ? "dark" : value === "dark" ? "violet" : "light",
                )
              }
            >
              {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <div className="notification-wrap">
              <button
                className="icon-button notification-button"
                type="button"
                aria-label={`Notifications, ${unread} unread`}
                aria-expanded={notificationsOpen}
                onClick={() => setNotificationsOpen((value) => !value)}
              >
                <Bell size={18} />
                {unread > 0 && <i />}
              </button>
              {notificationsOpen && (
                <div className="notification-popover">
                  <div className="popover-head">
                    <strong>Notifications</strong>
                    <button
                      type="button"
                      onClick={() => {
                        setUnread(0);
                        showToast("All notifications marked as read");
                      }}
                    >
                      <CheckCheck size={14} /> Mark all read
                    </button>
                  </div>
                  <div className="notification-item">
                    <Avatar initials="JL" color="blue" size="small" />
                    <p>
                      <strong>Jordan Lee</strong> commented on <b>Design system</b>
                      <small>12 min ago</small>
                    </p>
                    <i />
                  </div>
                  <div className="notification-item">
                    <Avatar initials="TR" color="orange" size="small" />
                    <p>
                      <strong>Taylor Reed</strong> completed a task in <b>Mobile app</b>
                      <small>1 hour ago</small>
                    </p>
                  </div>
                  <div className="notification-item">
                    <Avatar initials="AM" color="violet" size="small" />
                    <p>
                      <strong>Avery Morgan</strong> invited you to review sprint goals
                      <small>Yesterday</small>
                    </p>
                  </div>
                </div>
              )}
            </div>
            <button
              className="help-button"
              type="button"
              onClick={() => showToast("AdminX showcase · fictional sample workspace")}
            >
              ?
            </button>
          </div>
        </header>

        <div className="page-content">
          <div className="demo-banner">
            <Sparkles size={15} />
            <span>
              <strong>Portfolio demo</strong> · Fictional data; member and task changes persist
              locally.
            </span>
            <button
              type="button"
              onClick={() => showToast("This is an independent AdminX showcase concept.")}
              aria-label="About this demo"
            >
              <CircleHelp size={15} />
            </button>
          </div>

          {view === "Overview" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="greeting-label">WEDNESDAY, NOVEMBER 4, 2026</div>
                  <h1>
                    Good morning, Waleed <span>✦</span>
                  </h1>
                  <p>Here’s what’s happening in your workspace today.</p>
                </div>
                <div className="heading-actions">
                  <button
                    className="button button-secondary"
                    type="button"
                    onClick={() => window.print()}
                  >
                    <Download size={15} /> Export report
                  </button>
                  <button
                    className="button button-primary"
                    type="button"
                    onClick={() => setModal("task")}
                  >
                    <Plus size={16} /> New task
                  </button>
                </div>
              </div>
              <div className="stat-grid">
                <article className="stat-card">
                  <div className="stat-top">
                    <span>Total projects</span>
                    <span className="stat-icon purple">
                      <FileText size={17} />
                    </span>
                  </div>
                  <strong>12</strong>
                  <div className="stat-foot">
                    <span className="trend trend-up">
                      <ArrowUpRight size={13} /> 8.2%
                    </span>
                    <span>vs. last month</span>
                    <div className="mini-bars">
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                    </div>
                  </div>
                </article>
                <article className="stat-card">
                  <div className="stat-top">
                    <span>Tasks completed</span>
                    <span className="stat-icon green">
                      <Check size={17} />
                    </span>
                  </div>
                  <strong>284</strong>
                  <div className="stat-foot">
                    <span className="trend trend-up">
                      <ArrowUpRight size={13} /> 12.5%
                    </span>
                    <span>vs. last month</span>
                    <div className="mini-bars mini-green">
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                    </div>
                  </div>
                </article>
                <article className="stat-card">
                  <div className="stat-top">
                    <span>Team members</span>
                    <span className="stat-icon orange">
                      <Users size={17} />
                    </span>
                  </div>
                  <strong>{members.length + 18}</strong>
                  <div className="stat-foot">
                    <span className="trend trend-up">
                      <ArrowUpRight size={13} /> 4.6%
                    </span>
                    <span>vs. last month</span>
                    <div className="mini-bars mini-orange">
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                    </div>
                  </div>
                </article>
                <article className="stat-card">
                  <div className="stat-top">
                    <span>Productivity score</span>
                    <span className="stat-icon blue">
                      <Activity size={17} />
                    </span>
                  </div>
                  <strong>
                    86<span className="stat-unit">/100</span>
                  </strong>
                  <div className="stat-foot">
                    <span className="trend trend-down">
                      <ArrowDownRight size={13} /> 2.1%
                    </span>
                    <span>vs. last month</span>
                    <div className="mini-bars mini-blue">
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                    </div>
                  </div>
                </article>
              </div>

              <div className="analytics-grid">
                <article className="panel activity-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Productivity overview</h2>
                      <p>Task completion across your workspace</p>
                    </div>
                    <button
                      className="select-button"
                      type="button"
                      onClick={() => showToast("Showing the last 7 days of sample data")}
                    >
                      Last 7 days <ChevronDown size={14} />
                    </button>
                  </div>
                  <div className="chart-legend">
                    <span>
                      <i className="legend-current" /> This week
                    </span>
                    <span>
                      <i className="legend-previous" /> Last week
                    </span>
                    <div>
                      <strong>76.8%</strong>
                      <small>completion rate</small>
                    </div>
                  </div>
                  <div className="area-chart">
                    {chartsReady ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={weeklyActivity}
                          margin={{ top: 8, right: 6, left: -18, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="currentFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#786af0" stopOpacity={0.18} />
                              <stop offset="95%" stopColor="#786af0" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="var(--chart-grid)"
                          />
                          <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "var(--chart-label)", fontSize: 11 }}
                            dy={9}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "var(--chart-label)", fontSize: 10 }}
                          />
                          <Tooltip content={<ChartTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="previous"
                            name="Last week"
                            stroke="#c9cad6"
                            strokeDasharray="4 4"
                            strokeWidth={2}
                            fill="transparent"
                          />
                          <Area
                            type="monotone"
                            dataKey="current"
                            name="This week"
                            stroke="#796cf0"
                            strokeWidth={2.5}
                            fill="url(#currentFill)"
                            activeDot={{ r: 4, fill: "#fff", stroke: "#796cf0", strokeWidth: 2 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <ChartSkeleton kind="area" />
                    )}
                  </div>
                </article>
                <article className="panel distribution-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Task distribution</h2>
                      <p>Tasks by current status</p>
                    </div>
                    <button
                      className="icon-button"
                      type="button"
                      aria-label="Task distribution options"
                      onClick={() => showToast("Chart options are available in the full product")}
                    >
                      <Ellipsis size={18} />
                    </button>
                  </div>
                  <div className="donut-wrap">
                    {chartsReady ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={taskDistribution}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={61}
                            outerRadius={84}
                            paddingAngle={3}
                            stroke="none"
                          >
                            {taskDistribution.map((item) => (
                              <Cell key={item.name} fill={item.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}%`, "Tasks"]} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <ChartSkeleton kind="donut" />
                    )}
                    <div className="donut-center">
                      <strong>1,284</strong>
                      <small>Total tasks</small>
                    </div>
                  </div>
                  <div className="distribution-legend">
                    {taskDistribution.map((item) => (
                      <div key={item.name}>
                        <span>
                          <i style={{ background: item.color }} />
                          {item.name}
                        </span>
                        <strong>{item.value}%</strong>
                      </div>
                    ))}
                  </div>
                </article>
              </div>

              <div className="lower-grid">
                <article className="panel projects-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Projects</h2>
                      <p>Keep track of your team’s progress</p>
                    </div>
                    <button
                      className="text-button"
                      type="button"
                      onClick={() => setView("Projects")}
                    >
                      View all <ArrowRight size={14} />
                    </button>
                  </div>
                  <div className="project-table-wrap">
                    <table className="project-table">
                      <thead>
                        <tr>
                          <th>Project name</th>
                          <th>Progress</th>
                          <th>Tasks</th>
                          <th>Due date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projectList.slice(0, 4).map((project) => (
                          <tr key={project.name}>
                            <td>
                              <div className="project-name">
                                <span className={`project-avatar avatar-${project.color}`}>
                                  {project.initials}
                                </span>
                                <span>
                                  <strong>{project.name}</strong>
                                  <small>{project.owner}</small>
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className="progress-cell">
                                <div className="progress-track">
                                  <i style={{ width: `${project.progress}%` }} />
                                </div>
                                <small>{project.progress}%</small>
                              </div>
                            </td>
                            <td>{project.tasks}</td>
                            <td>{project.due}</td>
                            <td>
                              <span
                                className={`project-state ${project.state === "At risk" ? "state-risk" : ""}`}
                              >
                                <i />
                                {project.state}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>
                <article className="panel activity-feed">
                  <div className="panel-heading">
                    <div>
                      <h2>Recent activity</h2>
                      <p>Latest updates from your team</p>
                    </div>
                    <button
                      className="icon-button"
                      type="button"
                      aria-label="Activity options"
                      onClick={() => showToast("Showing the latest activity")}
                    >
                      <Ellipsis size={18} />
                    </button>
                  </div>
                  <div className="feed-list">
                    <div className="feed-item">
                      <Avatar initials="JL" color="blue" size="small" />
                      <div>
                        <p>
                          <strong>Jordan Lee</strong> completed a task
                        </p>
                        <small>Updated the design tokens · 18 min ago</small>
                      </div>
                      <span className="feed-check">
                        <Check size={12} />
                      </span>
                    </div>
                    <div className="feed-item">
                      <Avatar initials="AM" color="violet" size="small" />
                      <div>
                        <p>
                          <strong>Avery Morgan</strong> created a project
                        </p>
                        <small>Website redesign · 1 hour ago</small>
                      </div>
                      <span className="feed-file">
                        <FileText size={13} />
                      </span>
                    </div>
                    <div className="feed-item">
                      <Avatar initials="TR" color="orange" size="small" />
                      <div>
                        <p>
                          <strong>Taylor Reed</strong> moved a task to review
                        </p>
                        <small>Workspace permissions · 3 hours ago</small>
                      </div>
                      <span className="feed-review">↗</span>
                    </div>
                    <div className="feed-item">
                      <Avatar initials="CP" color="pink" size="small" />
                      <div>
                        <p>
                          <strong>Casey Park</strong> left a comment
                        </p>
                        <small>On the mobile navigation · Yesterday</small>
                      </div>
                      <span className="feed-comment">
                        <MessageSquare size={12} />
                      </span>
                    </div>
                  </div>
                  <button
                    className="feed-footer"
                    type="button"
                    onClick={() => showToast("You’re all caught up on sample activity")}
                  >
                    View activity log <ArrowRight size={14} />
                  </button>
                </article>
              </div>
              <div className="dashboard-footer-note">
                <ShieldCheck size={14} /> All systems operational <span>Last updated just now</span>
              </div>
            </>
          )}

          {view === "Projects" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="greeting-label">WORKSPACE</div>
                  <h1>Projects</h1>
                  <p>Organize and track your team’s work.</p>
                </div>
                <div className="heading-actions">
                  <button
                    className="button button-secondary"
                    type="button"
                    onClick={() => showToast("Filter options applied to sample projects")}
                  >
                    <Filter size={15} /> Filter
                  </button>
                  <button
                    className="button button-primary"
                    type="button"
                    onClick={() => setModal("task")}
                  >
                    <Plus size={16} /> New task
                  </button>
                </div>
              </div>
              <div className="project-cards">
                {projectList.map((project) => (
                  <article className="panel project-card" key={project.name}>
                    <div className={`project-card-avatar avatar-${project.color}`}>
                      {project.initials}
                    </div>
                    <button
                      className="icon-button project-more"
                      type="button"
                      aria-label={`${project.name} options`}
                      onClick={() => showToast(`${project.name} options`)}
                    >
                      <Ellipsis size={18} />
                    </button>
                    <h2>{project.name}</h2>
                    <p>Sample project workspace with tasks, owners, and progress.</p>
                    <div className="project-team">
                      <Avatar initials="AM" color="violet" size="small" />
                      <Avatar initials="JL" color="blue" size="small" />
                      <Avatar initials="TR" color="orange" size="small" />
                      <span>+3</span>
                    </div>
                    <div className="project-progress-label">
                      <span>Progress</span>
                      <strong>{project.progress}%</strong>
                    </div>
                    <div className="progress-track">
                      <i style={{ width: `${project.progress}%` }} />
                    </div>
                    <div className="project-card-foot">
                      <span>
                        <ListTodo size={14} /> {project.tasks} tasks
                      </span>
                      <span>
                        <CalendarDays size={14} /> {project.due}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          {view === "Tasks" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="greeting-label">WORKSPACE</div>
                  <h1>Task board</h1>
                  <p>Move a card between columns to update its status.</p>
                </div>
                <div className="heading-actions">
                  <select
                    className="select-button task-filter"
                    value={taskFilter}
                    onChange={(event) => setTaskFilter(event.target.value)}
                    aria-label="Filter tasks by status"
                  >
                    <option>All tasks</option>
                    <option>Todo</option>
                    <option>In progress</option>
                    <option>Review</option>
                    <option>Done</option>
                  </select>
                  <button
                    className="button button-primary"
                    type="button"
                    onClick={() => setModal("task")}
                  >
                    <Plus size={16} /> New task
                  </button>
                </div>
              </div>
              <div className="kanban-board">
                {(["Todo", "In progress", "Review", "Done"] as const).map((status) => {
                  const list = filteredTasks.filter((item) => item.status === status);
                  return (
                    <section
                      className="kanban-column"
                      key={status}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => {
                        event.preventDefault();
                        if (draggedTask !== null) {
                          void moveWorkItem(draggedTask, status).catch((error: unknown) =>
                            showToast(
                              error instanceof Error ? error.message : "Task could not be moved.",
                            ),
                          );
                        }
                        setDraggedTask(null);
                      }}
                    >
                      <div className="kanban-column-head">
                        <span
                          className={`column-indicator column-${status.replace(" ", "-").toLowerCase()}`}
                        />
                        <h2>{status}</h2>
                        <small>{list.length}</small>
                        <button
                          className="icon-button"
                          type="button"
                          aria-label={`Add task to ${status}`}
                          onClick={() => setModal("task")}
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                      {list.map((task) => (
                        <article
                          className="task-card"
                          key={task.id}
                          draggable
                          onDragStart={() => setDraggedTask(task.id)}
                          onDragEnd={() => setDraggedTask(null)}
                        >
                          <div className="task-card-top">
                            <span className={`priority priority-${task.priority.toLowerCase()}`}>
                              <i />
                              {task.priority}
                            </span>
                            <button
                              className="icon-button task-more"
                              type="button"
                              aria-label={`${task.title} options`}
                              onClick={() =>
                                showToast("Task options are available in this demo board")
                              }
                            >
                              <Ellipsis size={16} />
                            </button>
                          </div>
                          <h3>{task.title}</h3>
                          <p>{task.project}</p>
                          <div className="task-card-foot">
                            <span>
                              <Avatar initials={task.initials} color={task.color} size="small" />
                              {task.due}
                            </span>
                            <select
                              aria-label={`Move ${task.title}`}
                              value={task.status}
                              onChange={(event) =>
                                void moveWorkItem(
                                  task.id,
                                  event.target.value as WorkItem["status"],
                                ).catch((error: unknown) =>
                                  showToast(
                                    error instanceof Error
                                      ? error.message
                                      : "Task could not be moved.",
                                  ),
                                )
                              }
                            >
                              <option>Todo</option>
                              <option>In progress</option>
                              <option>Review</option>
                              <option>Done</option>
                            </select>
                          </div>
                        </article>
                      ))}
                      <button
                        className="add-task-inline"
                        type="button"
                        onClick={() => setModal("task")}
                      >
                        <Plus size={14} /> Add task
                      </button>
                    </section>
                  );
                })}
              </div>
            </>
          )}

          {view === "Calendar" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="greeting-label">TEAM SCHEDULE</div>
                  <h1>Calendar</h1>
                  <p>Plan meetings, reviews, and upcoming milestones.</p>
                </div>
                <div className="heading-actions">
                  <button className="button button-primary" type="button" onClick={openNewEvent}>
                    <Plus size={16} /> Add event
                  </button>
                </div>
              </div>
              <section className="panel calendar-panel">
                <div className="calendar-head">
                  <div>
                    <h2>
                      {calendarDate.toLocaleString("en", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h2>
                    <p>
                      Sample team schedule ·{" "}
                      {calendarDate.toLocaleString("en", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="calendar-controls">
                    <button
                      className="icon-button"
                      type="button"
                      aria-label="Previous month"
                      onClick={() => moveMonth(-1)}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      className="button button-secondary"
                      type="button"
                      onClick={() => setCalendarDate(new Date(2026, 10, 1))}
                    >
                      Today
                    </button>
                    <button
                      className="icon-button"
                      type="button"
                      aria-label="Next month"
                      onClick={() => moveMonth(1)}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
                <div className="calendar-grid">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <div className="calendar-weekday" key={day}>
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: calendarCellCount }, (_, index) => {
                    const day = index - calendarOffset + 1;
                    const visibleDay = day > 0 && day <= calendarDays;
                    const dayEvents = events.filter(
                      (event) =>
                        event.year === calendarYear &&
                        event.month === calendarMonth &&
                        event.day === day,
                    );
                    return (
                      <div
                        className={`calendar-day ${!visibleDay ? "calendar-empty" : ""} ${day === 4 && calendarMonth === 10 && calendarYear === 2026 ? "calendar-today" : ""}`}
                        key={index}
                      >
                        {visibleDay && (
                          <>
                            <span className="calendar-day-number">{day}</span>
                            {dayEvents.slice(0, 2).map((event, eventIndex) => (
                              <button
                                className={`calendar-event event-${event.type}`}
                                key={`${event.title}-${eventIndex}`}
                                type="button"
                                onClick={() => openEventEdit(event)}
                              >
                                <small>{event.time}</small>
                                {event.title}
                              </button>
                            ))}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          )}

          {view === "Team" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="greeting-label">WORKSPACE MEMBERS</div>
                  <h1>Your team</h1>
                  <p>Manage members and their roles in this sample workspace.</p>
                </div>
                <div className="heading-actions">
                  <button className="button button-secondary" type="button" onClick={exportCsv}>
                    <Download size={15} /> Export CSV
                  </button>
                  <button className="button button-primary" type="button" onClick={openNewMember}>
                    <Plus size={16} /> Invite member
                  </button>
                </div>
              </div>
              <section className="panel members-panel">
                <div className="members-toolbar">
                  <label className="member-search">
                    <Search size={15} />
                    <input
                      value={userFilter}
                      onChange={(event) => setUserFilter(event.target.value)}
                      placeholder="Search members..."
                    />
                  </label>
                  <button
                    className="button button-secondary"
                    type="button"
                    onClick={() => {
                      setUserFilter("");
                      showToast("Member filters cleared");
                    }}
                  >
                    <Filter size={14} /> Filters
                  </button>
                </div>
                <div className="members-table-wrap">
                  <table className="members-table">
                    <thead>
                      {table.getHeaderGroups().map((group) => (
                        <tr key={group.id}>
                          {group.headers.map((header) => (
                            <th key={header.id}>
                              <button
                                type="button"
                                disabled={!header.column.getCanSort()}
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                                {header.column.getCanSort() && (
                                  <span className="sort-indicator">
                                    {header.column.getIsSorted() === "asc"
                                      ? "↑"
                                      : header.column.getIsSorted() === "desc"
                                        ? "↓"
                                        : "↕"}
                                  </span>
                                )}
                              </button>
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody>
                      {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {table.getRowModel().rows.length === 0 && (
                    <div className="empty-state">No members match “{userFilter}”.</div>
                  )}
                </div>
                <div className="table-pagination">
                  <span>
                    Showing <strong>{table.getRowModel().rows.length}</strong> of{" "}
                    <strong>{table.getFilteredRowModel().rows.length}</strong> members
                  </span>
                  <div>
                    <button
                      className="icon-button"
                      type="button"
                      aria-label="Previous page"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <ChevronLeft size={17} />
                    </button>
                    <span>
                      Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </span>
                    <button
                      className="icon-button"
                      type="button"
                      aria-label="Next page"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      <ChevronRight size={17} />
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}

          {view === "Reports" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="greeting-label">WORKSPACE INSIGHTS</div>
                  <h1>Reports</h1>
                  <p>Review sample team activity and project health.</p>
                </div>
                <div className="heading-actions">
                  <button
                    className="button button-secondary"
                    type="button"
                    onClick={() => window.print()}
                  >
                    <Download size={15} /> Export PDF
                  </button>
                  <button
                    className="select-button"
                    type="button"
                    onClick={() => showToast("Showing November sample report")}
                  >
                    This month <ChevronDown size={14} />
                  </button>
                </div>
              </div>
              <div className="stat-grid report-stats">
                <article className="stat-card">
                  <div className="stat-top">
                    <span>Tasks completed</span>
                    <span className="stat-icon purple">
                      <Check size={17} />
                    </span>
                  </div>
                  <strong>284</strong>
                  <div className="stat-foot">
                    <span className="trend trend-up">↑ 12.5%</span>
                    <span>vs. last month</span>
                  </div>
                </article>
                <article className="stat-card">
                  <div className="stat-top">
                    <span>Avg. cycle time</span>
                    <span className="stat-icon blue">
                      <Activity size={17} />
                    </span>
                  </div>
                  <strong>
                    3.2<span className="stat-unit"> days</span>
                  </strong>
                  <div className="stat-foot">
                    <span className="trend trend-up">↓ 0.8 days</span>
                    <span>vs. last month</span>
                  </div>
                </article>
                <article className="stat-card">
                  <div className="stat-top">
                    <span>Team utilization</span>
                    <span className="stat-icon green">
                      <Users size={17} />
                    </span>
                  </div>
                  <strong>
                    78<span className="stat-unit">%</span>
                  </strong>
                  <div className="stat-foot">
                    <span className="trend trend-up">↑ 4.2%</span>
                    <span>vs. last month</span>
                  </div>
                </article>
                <article className="stat-card">
                  <div className="stat-top">
                    <span>Projects on track</span>
                    <span className="stat-icon orange">
                      <ShieldCheck size={17} />
                    </span>
                  </div>
                  <strong>
                    9<span className="stat-unit">/12</span>
                  </strong>
                  <div className="stat-foot">
                    <span className="trend trend-down">3 need attention</span>
                  </div>
                </article>
              </div>
              <section className="panel report-chart-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Tasks completed</h2>
                    <p>Daily output across the team</p>
                  </div>
                  <span className="report-total">
                    284 <small>THIS MONTH</small>
                  </span>
                </div>
                <div className="report-chart">
                  {chartsReady ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={projectActivity}
                        margin={{ top: 12, right: 10, left: -18, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="var(--chart-grid)"
                        />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "var(--chart-label)", fontSize: 11 }}
                          dy={8}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "var(--chart-label)", fontSize: 10 }}
                        />
                        <Tooltip content={<ChartTooltip />} />
                        <Bar
                          dataKey="completed"
                          name="Tasks completed"
                          fill="#796cf0"
                          radius={[5, 5, 0, 0]}
                          maxBarSize={34}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <ChartSkeleton kind="bar" />
                  )}
                </div>
              </section>
              <div className="report-secondary-grid">
                <section className="panel report-secondary-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Weekly team output</h2>
                      <p>Completed tasks per day</p>
                    </div>
                    <span className="chart-badge">LINE</span>
                  </div>
                  <div className="report-secondary-chart">
                    {chartsReady ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={projectActivity}
                          margin={{ top: 10, right: 8, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="var(--chart-grid)"
                          />
                          <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "var(--chart-label)", fontSize: 10 }}
                            dy={7}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "var(--chart-label)", fontSize: 9 }}
                          />
                          <Tooltip content={<ChartTooltip />} />
                          <ChartLine
                            type="monotone"
                            dataKey="completed"
                            name="Completed"
                            stroke="#42b297"
                            strokeWidth={2.5}
                            dot={{ r: 3, fill: "#42b297", stroke: "var(--panel)", strokeWidth: 2 }}
                            activeDot={{ r: 5 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <ChartSkeleton kind="line" />
                    )}
                  </div>
                </section>
                <section className="panel report-secondary-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Team performance</h2>
                      <p>Sample scores by work area</p>
                    </div>
                    <span className="chart-badge">RADAR</span>
                  </div>
                  <div className="report-secondary-chart">
                    {chartsReady ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={teamMetrics} outerRadius="72%">
                          <PolarGrid stroke="var(--chart-grid)" />
                          <PolarAngleAxis
                            dataKey="area"
                            tick={{ fill: "var(--chart-label)", fontSize: 9 }}
                          />
                          <PolarRadiusAxis
                            angle={30}
                            domain={[0, 100]}
                            tick={false}
                            axisLine={false}
                          />
                          <Tooltip />
                          <Radar
                            name="Team"
                            dataKey="team"
                            stroke="#7869eb"
                            fill="#7869eb"
                            fillOpacity={0.2}
                          />
                          <Radar
                            name="Target"
                            dataKey="target"
                            stroke="#e5aa4e"
                            fill="#e5aa4e"
                            fillOpacity={0.08}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    ) : (
                      <ChartSkeleton kind="radar" />
                    )}
                  </div>
                </section>
              </div>
            </>
          )}

          {view === "Settings" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="greeting-label">PREFERENCES</div>
                  <h1>Settings</h1>
                  <p>Adjust the look and feel of this local demo workspace.</p>
                </div>
              </div>
              <section className="panel settings-panel">
                <div className="settings-section">
                  <div>
                    <h2>Appearance</h2>
                    <p>Select a color theme for the dashboard.</p>
                  </div>
                  <div className="theme-options">
                    {(["light", "dark", "violet"] as const).map((option) => (
                      <button
                        key={option}
                        className={`theme-option theme-option-${option} ${theme === option ? "theme-selected" : ""}`}
                        type="button"
                        onClick={() => setTheme(option)}
                      >
                        <span />
                        <strong>{option[0].toUpperCase() + option.slice(1)}</strong>
                        {theme === option && <Check size={15} />}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="settings-section">
                  <div>
                    <h2>Workspace</h2>
                    <p>These settings affect only this demo session.</p>
                  </div>
                  <div className="settings-value">
                    <span>Sample Workspace</span>
                    <small>Fictional demo data · members and tasks saved in local SQLite</small>
                  </div>
                </div>
                <div className="settings-section">
                  <div>
                    <h2>Export data</h2>
                    <p>Download a copy of sample team members.</p>
                  </div>
                  <button className="button button-secondary" type="button" onClick={exportCsv}>
                    <Download size={15} /> Export CSV
                  </button>
                </div>
              </section>
            </>
          )}

          <footer className="app-footer">
            <span>
              AdminX <i>·</i> Independent portfolio showcase concept
            </span>
            <span>
              Demo data only <i>·</i> Local SQLite, no hosted services
            </span>
          </footer>
        </div>
      </section>

      {(modal === "member" || modal === "edit-member") && (
        <Modal
          title={editingMember ? "Edit team member" : "Invite a team member"}
          onClose={closeModal}
        >
          <form className="modal-form" onSubmit={handleAddMember}>
            <p>Add a fictional member to local SQLite. No invitation email is sent.</p>
            <label>
              Full name
              <input
                required
                maxLength={80}
                autoFocus
                value={memberForm.name}
                onChange={(event) =>
                  setMemberForm((form) => ({ ...form, name: event.target.value }))
                }
                placeholder="e.g. Jamie Rivera"
              />
            </label>
            <label>
              Email address
              <input
                required
                type="email"
                maxLength={160}
                value={memberForm.email}
                onChange={(event) =>
                  setMemberForm((form) => ({ ...form, email: event.target.value }))
                }
                placeholder="jamie@example.test"
              />
            </label>
            <label>
              Role
              <select
                value={memberForm.role}
                onChange={(event) =>
                  setMemberForm((form) => ({ ...form, role: event.target.value as Member["role"] }))
                }
              >
                <option>Developer</option>
                <option>Designer</option>
                <option>Manager</option>
                <option>Admin</option>
              </select>
            </label>
            <div className="modal-actions">
              <button className="button button-secondary" type="button" onClick={closeModal}>
                Cancel
              </button>
              <button className="button button-primary" type="submit">
                {editingMember ? <Check size={15} /> : <Plus size={15} />}
                {editingMember ? "Save changes" : "Add member"}
              </button>
            </div>
          </form>
        </Modal>
      )}
      {modal === "task" && (
        <Modal title="Create a task" onClose={closeModal}>
          <form className="modal-form" onSubmit={handleAddTask}>
            <p>Create a task in the local demo board. Changes are saved in SQLite.</p>
            <label>
              Task name
              <input
                required
                maxLength={120}
                autoFocus
                value={taskForm.title}
                onChange={(event) =>
                  setTaskForm((form) => ({ ...form, title: event.target.value }))
                }
                placeholder="What needs to get done?"
              />
            </label>
            <label>
              Project
              <select
                value={taskForm.project}
                onChange={(event) =>
                  setTaskForm((form) => ({ ...form, project: event.target.value }))
                }
              >
                <option>AdminX dashboard</option>
                <option>Website redesign</option>
                <option>Design system</option>
                <option>Mobile app</option>
                <option>Analytics</option>
              </select>
            </label>
            <label>
              Priority
              <select
                value={taskForm.priority}
                onChange={(event) =>
                  setTaskForm((form) => ({
                    ...form,
                    priority: event.target.value as WorkItem["priority"],
                  }))
                }
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </label>
            <div className="modal-actions">
              <button className="button button-secondary" type="button" onClick={closeModal}>
                Cancel
              </button>
              <button className="button button-primary" type="submit">
                <Plus size={15} /> Create task
              </button>
            </div>
          </form>
        </Modal>
      )}
      {(modal === "event" || modal === "edit-event") && (
        <Modal
          title={editingEventId !== null ? "Edit calendar event" : "Add calendar event"}
          onClose={closeModal}
        >
          <form className="modal-form" onSubmit={handleAddEvent}>
            <p>
              {editingEventId !== null ? "Update" : "Add a sample event to"}{" "}
              {calendarDate.toLocaleString("en", { month: "long", year: "numeric" })}.
            </p>
            <label>
              Event title
              <input
                required
                maxLength={100}
                autoFocus
                value={eventForm.title}
                onChange={(event) =>
                  setEventForm((form) => ({ ...form, title: event.target.value }))
                }
                placeholder="e.g. Weekly sync"
              />
            </label>
            <label>
              Day of month
              <input
                required
                type="number"
                min="1"
                max={calendarDays}
                value={eventForm.day}
                onChange={(event) => setEventForm((form) => ({ ...form, day: event.target.value }))}
              />
            </label>
            <label>
              Time
              <input
                required
                type="time"
                value={eventForm.time}
                onChange={(event) =>
                  setEventForm((form) => ({ ...form, time: event.target.value }))
                }
              />
            </label>
            <div className="modal-actions">
              {editingEventId !== null && (
                <button
                  className="button button-danger"
                  type="button"
                  onClick={deleteCalendarEvent}
                >
                  <Trash2 size={15} /> Delete
                </button>
              )}
              <button className="button button-secondary" type="button" onClick={closeModal}>
                Cancel
              </button>
              <button className="button button-primary" type="submit">
                {editingEventId !== null ? <Check size={15} /> : <Plus size={15} />}
                {editingEventId !== null ? "Save changes" : "Add event"}
              </button>
            </div>
          </form>
        </Modal>
      )}
      {toast && (
        <div className="toast" role="status">
          <Check size={15} />
          {toast}
          <button type="button" aria-label="Dismiss notification" onClick={() => setToast("")}>
            <X size={14} />
          </button>
        </div>
      )}
    </main>
  );
}
