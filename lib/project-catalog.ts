export const categories = [
  "All",
  "Web Development",
  "MERN Stack",
  "Full Stack",
  "Blockchain",
] as const;
export type Category = (typeof categories)[number];

export const projects = [
  {
    name: "DevBlog Pro",
    slug: "devblog-pro",
    port: 3002,
    type: "Editorial platform · independent showcase",
    category: "Web Development",
    description:
      "An MDX journal with article discovery, generated contents, reading tools, and a sample editorial studio.",
    stack: ["Next.js 16", "TypeScript", "MDX", "RSS"],
    features: [
      "Five original sample articles",
      "Search and category filters",
      "Local reading summary and topic suggestions",
      "Browser-only nested comments",
      "RSS feed and social preview images",
    ],
    boundary:
      "Summary and topic tools are local heuristics. No AI service, database, publishing backend, or account system is connected.",
  },
  {
    name: "ChatVerse",
    slug: "chatverse",
    port: 3003,
    type: "Messaging interface · local prototype",
    category: "Web Development",
    description:
      "A responsive conversation interface for exploring message composition and social cues.",
    stack: ["Next.js 16", "React 19", "TypeScript", "Client state"],
    features: [
      "Conversation search and mobile navigation",
      "Local message composition and reactions",
      "Create a sample conversation",
      "Local filename attachment preview",
    ],
    boundary:
      "Messages do not leave the page. No Socket.IO server, account, file upload, push notifications, or cross-device storage is connected.",
  },
  {
    name: "AdminX",
    slug: "adminx-dashboard",
    port: 3001,
    type: "Admin workspace · independent showcase",
    category: "Web Development",
    description:
      "A local admin workspace with interactive analytics, task planning, a team table, and calendar.",
    stack: ["Next.js", "Recharts", "TanStack Table", "Zustand"],
    features: [
      "Interactive charts and reports",
      "Searchable sortable team management",
      "Drag-and-drop task board",
      "Calendar, notifications, themes, CSV and print export",
    ],
    boundary:
      "Sample workspace data is fictional and changes are session-local. No account system, database, or external API is connected.",
  },
  {
    name: "TaskFlow",
    slug: "taskflow",
    port: 3004,
    type: "Project planning · local prototype",
    category: "MERN Stack",
    description:
      "A sprint planning board with task movement, priority filters, time logs, and activity notes.",
    stack: ["Next.js 16", "React 19", "TypeScript", "Express", "JSON file store"],
    features: [
      "Move tasks between board lanes",
      "Create tasks and filter by priority",
      "Log local time entries",
      "Sample sprint progress and activity feed",
    ],
    boundary:
      "Task creation and status updates persist in the local Express JSON API. Other board controls remain local; there is no account system or team sync.",
  },
  {
    name: "SocialSphere",
    slug: "socialsphere",
    port: 3005,
    type: "Community feed · local prototype",
    category: "MERN Stack",
    description:
      "A 20-post sample community feed with 10 fictional users and responsive local interactions.",
    stack: ["Next.js 16", "React 19", "TypeScript", "Express", "JSON file store"],
    features: [
      "Search posts and filter saved items",
      "Compose local posts and comments",
      "Like, save, and follow controls",
      "Story preview and topic discovery UI",
    ],
    boundary:
      "A local Express JSON API supports sample users and posts. No account system, message service, media upload, moderation, or live social network is connected.",
  },
  {
    name: "EduVault",
    slug: "eduvault",
    port: 3006,
    type: "Learning platform · local prototype",
    category: "MERN Stack",
    description:
      "A learner dashboard and course catalog with local enrollment, progress, and a short knowledge check.",
    stack: ["Next.js 16", "React 19", "TypeScript", "Express", "JSON file store"],
    features: [
      "Search and filter sample courses",
      "Add a course to the local learning list",
      "Course detail and quiz preview",
      "Responsive learner dashboard",
    ],
    boundary:
      "A local Express JSON API serves sample courses and stores enrollment previews. No account, video service, real payment, certificate, review, or persistent progress service is connected.",
  },
  {
    name: "HireHub",
    slug: "hirehub",
    port: 3007,
    type: "Job discovery · local prototype",
    category: "Full Stack",
    description:
      "A job search interface with detailed fictional listings, saved roles, and a local application preview.",
    stack: ["Next.js 16", "React 19", "TypeScript", "Client state"],
    features: [
      "Search and filter by role, location, type, and level",
      "Save sample job listings",
      "View role details",
      "Validated browser-only application form",
    ],
    boundary:
      "Employers and vacancies are fictional. Applications are not sent; there is no ATS, résumé upload, billing, or email service.",
  },
  {
    name: "CollabBoard",
    slug: "collabboard",
    port: 3008,
    type: "Canvas whiteboard · local prototype",
    category: "Full Stack",
    description: "A touch-ready drawing canvas with notes, undo/redo, backgrounds, and PNG export.",
    stack: ["Next.js 16", "React 19", "TypeScript", "Canvas API"],
    features: [
      "Pen, line, eraser, color, and brush size",
      "Add notes and undo/redo strokes",
      "Grid and planning backgrounds",
      "Export board as a PNG",
    ],
    boundary:
      "The canvas is single-user and memory-only. Shared rooms, Socket.IO, synced layers, and WebRTC voice are not connected.",
  },
  {
    name: "MetricsPro",
    slug: "metricspro",
    port: 3009,
    type: "Analytics workspace · local prototype",
    category: "Full Stack",
    description:
      "An analytics dashboard concept with date-range controls, sample visualizations, and CSV export.",
    stack: ["Next.js 16", "React 19", "TypeScript", "SVG charts"],
    features: [
      "Range controls update sample metrics",
      "Add and remove chart widgets",
      "Channel and page reports",
      "Export the current summary to CSV",
    ],
    boundary:
      "Metrics are illustrative. No tracking, database, multi-tenant accounts, billing, event ingestion, or report scheduler is connected.",
  },
  {
    name: "SolMint",
    slug: "solmint",
    port: 3010,
    type: "Digital art marketplace · local prototype",
    category: "Blockchain",
    description:
      "A marketplace interface with fictional art listings, collections, favorites, and mint preview drafts.",
    stack: ["Next.js 16", "React 19", "TypeScript", "Client state"],
    features: [
      "Filter and sort sample artwork",
      "Open item details and save favorites",
      "Create an unminted local preview",
      "Responsive marketplace layout",
    ],
    boundary:
      "No wallet, NFT metadata upload, marketplace program, auction, or Solana RPC is connected. Items are not minted or for sale.",
  },
  {
    name: "SolSwap",
    slug: "solswap",
    port: 3011,
    type: "Token exchange · local prototype",
    category: "Blockchain",
    description:
      "An exchange interface with a static fee-adjusted quote, sample market chart, and pool directory.",
    stack: ["Next.js 16", "React 19", "TypeScript", "SVG visualization"],
    features: [
      "Select token pairs and estimate a sample quote",
      "Change slippage display",
      "Browse and favorite sample pools",
      "Responsive market overview",
    ],
    boundary:
      "Token values are static examples. Wallets, RPC, an AMM, deposits, swaps, and real transaction history are not connected.",
  },
  {
    name: "SolGov",
    slug: "solgov",
    port: 3012,
    type: "Governance workspace · local prototype",
    category: "Blockchain",
    description:
      "A governance interface with fictional proposals, local vote tallies, draft creation, and discussion notes.",
    stack: ["Next.js 16", "React 19", "TypeScript", "Client state"],
    features: [
      "Filter proposals and review sample tallies",
      "Record a nonbinding local vote",
      "Create proposal drafts",
      "Add local discussion notes",
    ],
    boundary:
      "No DAO, wallet, SPL Governance, treasury, or Solana program is connected. Votes have no governance effect.",
  },
] as const;
