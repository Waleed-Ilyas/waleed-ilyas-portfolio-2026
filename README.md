# Waleed Ilyas — Full Stack Engineer

A portfolio for my full-stack work across MERN, Next.js, and Solana, with twelve new interactive showcase projects. The project cards use screenshots from these demo builds; the demos are independent portfolio work, not past client projects.

## Run the portfolio

Requirements: Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Run a showcase project

Each workspace has a README with its features, limits, and setup notes. Start a project from the repository root, for example:

```bash
npm run dev --workspace adminx-dashboard
npm run dev --workspace devblog-pro
npm run dev --workspace chatverse
```

The twelve workspaces are AdminX, DevBlog Pro, ChatVerse, TaskFlow, SocialSphere, EduVault, HireHub, CollabBoard, MetricsPro, SolMint, SolSwap, and SolGov.

## Portfolio content

The profile, experience, education, certifications, and skills are drawn from my existing developer and data science portfolios. The project gallery contains only the twelve new showcases in this repository. Example records and unconnected services are identified in each project.

Email delivery is not configured. The contact flow offers a direct email fallback; SMTP credentials are not included in this repository.

## Checks

```bash
npm run lint
npm run format:check
npm run build
npm audit
```

Local configuration belongs in `.env.local`, which is ignored by Git. Never commit real credentials. `.env.example` contains placeholders only.
