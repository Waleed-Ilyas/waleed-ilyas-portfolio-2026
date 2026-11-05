"use client";

import { FormEvent, useMemo, useState } from "react";

type Job = {
  id: number;
  title: string;
  company: string;
  logo: string;
  color: string;
  place: string;
  mode: string;
  type: string;
  level: string;
  salary: string;
  posted: string;
  tags: string[];
  description: string;
  featured?: boolean;
};
const jobs: Job[] = [
  {
    id: 1,
    title: "Senior Product Designer",
    company: "Fable Studio",
    logo: "f",
    color: "lavender",
    place: "Remote · US / Canada",
    mode: "Remote",
    type: "Full-time",
    level: "Senior",
    salary: "$120k – $155k",
    posted: "2 days ago",
    tags: ["Product design", "Figma", "Design systems"],
    description:
      "Help a small product team make complex workflows feel calm and approachable. You’ll partner with engineering and research to shape the experience from early exploration to careful implementation.",
    featured: true,
  },
  {
    id: 2,
    title: "Frontend Engineer, Design Systems",
    company: "Northstar Labs",
    logo: "N",
    color: "blue",
    place: "New York, NY · Hybrid",
    mode: "Hybrid",
    type: "Full-time",
    level: "Mid-level",
    salary: "$135k – $170k",
    posted: "4 days ago",
    tags: ["React", "TypeScript", "Accessibility"],
    description:
      "Build shared interface foundations that help product teams move with confidence. Work closely with designers on accessible components, documentation, and practical tooling.",
  },
  {
    id: 3,
    title: "Product Engineer",
    company: "Common Room",
    logo: "c",
    color: "peach",
    place: "Remote · Global",
    mode: "Remote",
    type: "Full-time",
    level: "Mid-level",
    salary: "$110k – $145k",
    posted: "1 week ago",
    tags: ["React", "Node.js", "Product thinking"],
    description:
      "Join a collaborative team exploring better ways for people to share knowledge. Bring curiosity across the stack and help make thoughtful product decisions tangible.",
  },
  {
    id: 4,
    title: "Developer Advocate",
    company: "Prism Tools",
    logo: "P",
    color: "mint",
    place: "Austin, TX · On-site",
    mode: "On-site",
    type: "Contract",
    level: "Mid-level",
    salary: "$80 – $110 / hr",
    posted: "3 days ago",
    tags: ["Writing", "JavaScript", "Community"],
    description:
      "Create useful learning materials and examples for a developer tool. Collaborate with product and engineering to turn real user questions into clear guidance.",
  },
  {
    id: 5,
    title: "Backend Engineer, Platform",
    company: "Fieldnote",
    logo: "F",
    color: "gold",
    place: "Remote · Europe",
    mode: "Remote",
    type: "Full-time",
    level: "Senior",
    salary: "€95k – €125k",
    posted: "5 days ago",
    tags: ["Node.js", "PostgreSQL", "APIs"],
    description:
      "Shape reliable platform services for a growing product. Help the team make sound choices around data boundaries, observability, and maintainable APIs.",
  },
  {
    id: 6,
    title: "UX Researcher",
    company: "Soft Landing",
    logo: "s",
    color: "rose",
    place: "London, UK · Hybrid",
    mode: "Hybrid",
    type: "Part-time",
    level: "Mid-level",
    salary: "£55k – £70k",
    posted: "1 day ago",
    tags: ["Research", "Prototyping", "Facilitation"],
    description:
      "Help a multidisciplinary team understand where people need support. Plan accessible studies, synthesize findings, and connect evidence to product choices.",
  },
];
const roleTemplates = [
  {
    title: "Frontend Engineer",
    tags: ["React", "TypeScript", "Accessibility"],
    level: "Mid-level",
  },
  {
    title: "Product Designer",
    tags: ["Figma", "Prototyping", "Design systems"],
    level: "Mid-level",
  },
  { title: "Backend Engineer", tags: ["Node.js", "PostgreSQL", "APIs"], level: "Senior" },
  { title: "Data Analyst", tags: ["SQL", "Dashboards", "Experimentation"], level: "Mid-level" },
  { title: "QA Automation Engineer", tags: ["Playwright", "CI", "Testing"], level: "Mid-level" },
  { title: "Developer Advocate", tags: ["Writing", "JavaScript", "Community"], level: "Mid-level" },
  { title: "Platform Engineer", tags: ["Cloud", "Observability", "Containers"], level: "Senior" },
  { title: "UX Researcher", tags: ["Research", "Interviews", "Synthesis"], level: "Mid-level" },
  { title: "Technical Writer", tags: ["Documentation", "APIs", "Learning"], level: "Entry" },
  { title: "Product Manager", tags: ["Roadmaps", "Discovery", "Delivery"], level: "Senior" },
  { title: "Full Stack Engineer", tags: ["React", "Node.js", "Product"], level: "Mid-level" },
];
const sampleCompanies = ["Cedar Labs", "Northstar Works", "Brightpath Studio", "Fieldnote Systems"];
const generatedJobs: Job[] = roleTemplates.flatMap((role, roleIndex) =>
  sampleCompanies.map((company, companyIndex) => {
    const index = roleIndex * sampleCompanies.length + companyIndex;
    const mode = ["Remote", "Hybrid", "On-site"][index % 3];
    const location = ["Remote · Global", "Toronto, CA · Hybrid", "Austin, TX · On-site"][index % 3];
    const low = 70 + index * 2;
    return {
      id: 7 + index,
      title: role.title,
      company,
      logo: company[0],
      color: ["lavender", "blue", "peach", "mint"][companyIndex],
      place: location,
      mode,
      type: index % 5 === 0 ? "Contract" : "Full-time",
      level: role.level,
      salary: `$${low}k – $${low + 35}k`,
      posted: `${(index % 6) + 1} days ago`,
      tags: role.tags,
      description: `Fictional demo opening at ${company}. Collaborate with a small cross-functional team to improve ${role.title.toLowerCase()} workflows, document decisions, and ship maintainable product changes.`,
    };
  }),
);
const allJobs = [...jobs, ...generatedJobs];

export default function HireHubPage() {
  const [query, setQuery] = useState("");
  const [place, setPlace] = useState("");
  const [mode, setMode] = useState("Any location type");
  const [type, setType] = useState("Any job type");
  const [level, setLevel] = useState("Any experience");
  const [saved, setSaved] = useState<number[]>([]);
  const [tab, setTab] = useState("Find work");
  const [selected, setSelected] = useState<Job | null>(null);
  const [apply, setApply] = useState<Job | null>(null);
  const [applied, setApplied] = useState<number[]>([]);
  const [notice, setNotice] = useState("");
  const visible = useMemo(
    () =>
      allJobs.filter((job) => {
        const haystack = `${job.title} ${job.company} ${job.tags.join(" ")}`.toLowerCase();
        return (
          (tab !== "Saved jobs" || saved.includes(job.id)) &&
          (tab !== "My applications" || applied.includes(job.id)) &&
          haystack.includes(query.toLowerCase()) &&
          `${job.place} ${job.mode}`.toLowerCase().includes(place.toLowerCase()) &&
          (mode === "Any location type" || job.mode === mode) &&
          (type === "Any job type" || job.type === type) &&
          (level === "Any experience" || job.level === level)
        );
      }),
    [query, place, mode, type, level, tab, saved, applied],
  );
  const toggleSaved = (id: number) =>
    setSaved((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  const submitApplication = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!apply) return;
    setApplied((current) => (current.includes(apply.id) ? current : [...current, apply.id]));
    setNotice("Application saved in this browser only. No employer received it.");
    setApply(null);
  };

  return (
    <main className="hire-app">
      <header className="hire-header">
        <a className="hire-logo" href="#home">
          <span>h</span> hirehub
        </a>
        <nav>
          <button
            className={tab === "Find work" ? "nav-on" : ""}
            onClick={() => setTab("Find work")}
          >
            Find work
          </button>
          <button onClick={() => setTab("Saved jobs")}>
            Saved <span>{saved.length || ""}</span>
          </button>
          <button onClick={() => setTab("My applications")}>
            My applications <span>{applied.length || ""}</span>
          </button>
        </nav>
        <div className="header-end">
          <button
            className="employer-link"
            onClick={() => setNotice("Employer tools are not connected to an account service.")}
          >
            For employers
          </button>
          <span className="hire-avatar">WI</span>
        </div>
      </header>
      <section className="hire-hero" id="home">
        <div className="hero-mark">H / OPPORTUNITY, WITH INTENTION</div>
        <h1>
          Find work that
          <br />
          <em>fits the way you think.</em>
        </h1>
        <p>Thoughtful roles from teams building useful things.</p>
        <div className="hero-decoration" aria-hidden="true">
          <i />
          <i />
          <i />
          <span>H</span>
        </div>
      </section>
      <section className="job-search-panel" aria-label="Search jobs">
        <label>
          <span>⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Role, skill, or company"
            aria-label="Search roles, skills or companies"
          />
        </label>
        <label>
          <span>⌖</span>
          <input
            value={place}
            onChange={(event) => setPlace(event.target.value)}
            placeholder="City or remote"
            aria-label="Location"
          />
        </label>
        <button
          onClick={() => {
            setQuery(query.trim());
            setNotice(`${visible.length} sample roles match your search.`);
          }}
        >
          Search roles <span>→</span>
        </button>
      </section>
      <div className="hire-body">
        <aside className="filters">
          <div className="filter-head">
            <b>Refine your search</b>
            <button
              onClick={() => {
                setMode("Any location type");
                setType("Any job type");
                setLevel("Any experience");
                setQuery("");
                setPlace("");
              }}
            >
              Clear
            </button>
          </div>
          <label>
            LOCATION TYPE
            <select value={mode} onChange={(event) => setMode(event.target.value)}>
              <option>Any location type</option>
              <option>Remote</option>
              <option>Hybrid</option>
              <option>On-site</option>
            </select>
          </label>
          <label>
            JOB TYPE
            <select value={type} onChange={(event) => setType(event.target.value)}>
              <option>Any job type</option>
              <option>Full-time</option>
              <option>Contract</option>
              <option>Part-time</option>
            </select>
          </label>
          <label>
            EXPERIENCE
            <select value={level} onChange={(event) => setLevel(event.target.value)}>
              <option>Any experience</option>
              <option>Mid-level</option>
              <option>Senior</option>
            </select>
          </label>
          <div className="filter-note">
            <span>✳</span>
            <p>
              Sample listings help illustrate the search experience. Verify any opportunity
              independently.
            </p>
          </div>
        </aside>
        <section className="results">
          <div className="results-top">
            <div>
              <span className="eyebrow">{tab.toUpperCase()} · SAMPLE LISTINGS</span>
              <h2>{tab === "Find work" ? "Roles worth a closer look" : tab}</h2>
              <p>{visible.length} fictional opportunities in this demo</p>
            </div>
            <button
              className="sort-button"
              onClick={() =>
                setNotice("Listings are ordered for this demo; no live job index is connected.")
              }
            >
              Newest first⌄
            </button>
          </div>
          {visible.map((job) => (
            <article className="job-card" key={job.id}>
              <button
                className={`company-logo ${job.color}`}
                onClick={() => setSelected(job)}
                aria-label={`View ${job.company}`}
              >
                {job.logo}
              </button>
              <div className="job-copy">
                <div className="job-title-line">
                  <button onClick={() => setSelected(job)}>{job.title}</button>
                  {job.featured && <span className="featured-pill">EDITOR’S PICK</span>}
                </div>
                <div className="company-line">
                  {job.company} <i>·</i> {job.place}
                </div>
                <div className="job-tags">
                  {job.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="job-meta">
                  <span>{job.type}</span>
                  <span>{job.level}</span>
                  <span>{job.salary}</span>
                </div>
              </div>
              <div className="job-card-actions">
                <small>{job.posted}</small>
                <button
                  className={saved.includes(job.id) ? "saved" : "save-button"}
                  onClick={() => toggleSaved(job.id)}
                  aria-label={saved.includes(job.id) ? "Remove saved job" : "Save job"}
                >
                  {saved.includes(job.id) ? "♥" : "♡"}
                </button>
              </div>
            </article>
          ))}
          {visible.length === 0 && (
            <div className="no-results">
              No sample jobs match these filters. Adjust the search to see more.
            </div>
          )}
          <button
            className="load-more"
            onClick={() => setNotice("You’ve reached the end of this sample job set.")}
          >
            That’s everything in this demo
          </button>
        </section>
      </div>
      <footer className="hire-footer">
        <span>HireHub · independent portfolio showcase</span>
        <span>Sample listings · no real employers or active vacancies</span>
      </footer>
      {selected && (
        <div className="hire-overlay" onClick={() => setSelected(null)}>
          <section
            className="job-detail"
            role="dialog"
            aria-modal="true"
            aria-labelledby="job-detail-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="detail-close" onClick={() => setSelected(null)} aria-label="Close">
              ×
            </button>
            <span className={`company-logo large ${selected.color}`}>{selected.logo}</span>
            <span className="eyebrow">
              {selected.company.toUpperCase()} · FICTIONAL SAMPLE ROLE
            </span>
            <h2 id="job-detail-title">{selected.title}</h2>
            <p className="company-line">
              {selected.place} · {selected.type} · {selected.level}
            </p>
            <div className="detail-salary">
              {selected.salary} <small>illustrative compensation</small>
            </div>
            <p>{selected.description}</p>
            <h3>What you’ll explore</h3>
            <ul>
              <li>Collaborate with a small, cross-functional product team.</li>
              <li>Use clear communication to shape decisions and deliver thoughtful work.</li>
              <li>Share your perspective while learning from others.</li>
            </ul>
            <div className="detail-actions">
              <button
                className="apply-button"
                onClick={() => {
                  setApply(selected);
                  setSelected(null);
                }}
              >
                Try local application
              </button>
              <button className="save-button" onClick={() => toggleSaved(selected.id)}>
                {saved.includes(selected.id) ? "♥ Saved" : "♡ Save role"}
              </button>
            </div>
            <small className="detail-disclosure">
              This role and employer are fictional sample data; no real vacancy is represented.
            </small>
          </section>
        </div>
      )}
      {apply && (
        <div className="hire-overlay" onClick={() => setApply(null)}>
          <form
            className="application-form"
            onSubmit={submitApplication}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="detail-close"
              onClick={() => setApply(null)}
              aria-label="Close"
            >
              ×
            </button>
            <span className="eyebrow">LOCAL DEMO APPLICATION</span>
            <h2>{apply.title}</h2>
            <p>
              This form only adds a sample application to the current browser state. No résumé is
              uploaded and no employer receives your details.
            </p>
            <label>
              Your name
              <input required maxLength={80} placeholder="Name" />
            </label>
            <label>
              Email
              <input required type="email" placeholder="you@example.com" />
            </label>
            <label>
              Short note
              <textarea
                required
                maxLength={600}
                rows={4}
                placeholder="What interests you about this sample role?"
              />
            </label>
            <button className="apply-button" type="submit">
              Save local application
            </button>
          </form>
        </div>
      )}
      {notice && (
        <div className="hire-toast" role="status">
          {notice}
          <button onClick={() => setNotice("")} aria-label="Dismiss">
            ×
          </button>
        </div>
      )}
    </main>
  );
}
