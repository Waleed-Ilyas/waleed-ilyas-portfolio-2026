"use client";

import { useMemo, useState } from "react";

type Widget = { id: string; title: string; kind: "line" | "bar" | "donut"; metric: string };
const baseWidgets: Widget[] = [
  { id: "traffic", title: "Traffic over time", kind: "line", metric: "Sessions" },
  { id: "channels", title: "Top channels", kind: "donut", metric: "Visitors" },
  { id: "pages", title: "Most viewed pages", kind: "bar", metric: "Views" },
];
const lineValues: Record<string, number[]> = {
  "7 days": [34, 47, 41, 58, 49, 72, 66, 82, 71, 91, 84, 100],
  "30 days": [28, 40, 35, 49, 42, 62, 54, 75, 66, 82, 73, 94],
  "90 days": [20, 32, 39, 35, 55, 48, 62, 59, 78, 72, 88, 100],
};
const channels = [
  { name: "Direct", amount: "42%", color: "#7058bb" },
  { name: "Search", amount: "31%", color: "#89b4a4" },
  { name: "Social", amount: "18%", color: "#e0b56b" },
  { name: "Other", amount: "9%", color: "#d98f7f" },
];
const pageRows = [
  ["/getting-started", "4,820", "+12.8%"],
  ["/product/overview", "3,409", "+8.2%"],
  ["/journal/design-systems", "2,765", "+5.4%"],
  ["/pricing", "2,184", "−1.1%"],
];

function TrendChart({ values }: { values: number[] }) {
  const points = values
    .map((value, index) => `${(index / (values.length - 1)) * 100},${100 - value}`)
    .join(" ");
  const area = `0,100 ${points} 100,100`;
  return (
    <svg
      className="trend-chart"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      role="img"
      aria-label="Illustrative session trend chart"
    >
      <defs>
        <linearGradient id="trend-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#7864c0" stopOpacity=".2" />
          <stop offset="100%" stopColor="#7864c0" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#trend-fill)" />
      <polyline
        points={points}
        fill="none"
        stroke="#7058bb"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1="0"
        y1="25"
        x2="100"
        y2="25"
        stroke="#e9e8ed"
        strokeDasharray="1 2"
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1="0"
        y1="55"
        x2="100"
        y2="55"
        stroke="#e9e8ed"
        strokeDasharray="1 2"
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1="0"
        y1="82"
        x2="100"
        y2="82"
        stroke="#e9e8ed"
        strokeDasharray="1 2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default function MetricsProPage() {
  const [range, setRange] = useState("30 days");
  const [widgets, setWidgets] = useState(baseWidgets);
  const [showBuilder, setShowBuilder] = useState(false);
  const [widgetType, setWidgetType] = useState<Widget["kind"]>("line");
  const [notice, setNotice] = useState("");
  const values = lineValues[range];
  const summary = useMemo(
    () => ({
      sessions: range === "7 days" ? "8,942" : range === "30 days" ? "36,482" : "104,720",
      visitors: range === "7 days" ? "5,104" : range === "30 days" ? "21,846" : "68,210",
      duration: range === "7 days" ? "2m 41s" : range === "30 days" ? "2m 34s" : "2m 29s",
      bounce: range === "7 days" ? "34.8%" : range === "30 days" ? "36.2%" : "38.1%",
    }),
    [range],
  );
  const addWidget = () => {
    const titles: Record<Widget["kind"], string> = {
      line: "Engagement trend",
      bar: "Event breakdown",
      donut: "Audience segments",
    };
    setWidgets((current) => [
      ...current,
      {
        id: `${widgetType}-${Date.now()}`,
        title: titles[widgetType],
        kind: widgetType,
        metric: "Sample events",
      },
    ]);
    setShowBuilder(false);
  };
  const exportCsv = () => {
    const csv = [
      "metric,value,period",
      `sessions,${summary.sessions},${range}`,
      `visitors,${summary.visitors},${range}`,
      `avg_session,${summary.duration},${range}`,
      `bounce_rate,${summary.bounce},${range}`,
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "metricspro-sample-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="metrics-app">
      <aside className="metrics-sidebar">
        <a className="metrics-brand" href="#overview">
          <span>m</span> metricspro <small>DEMO</small>
        </a>
        <div className="workspace-switch">
          <span className="ws-icon">N</span>
          <span>
            <b>Northstar sample</b>
            <small>Demo workspace</small>
          </span>
          <i>⌄</i>
        </div>
        <div className="nav-heading">WORKSPACE</div>
        <nav>
          <button className="nav-selected">
            ◫ <span>Overview</span>
          </button>
          <button onClick={() => setNotice("Reports use the sample metrics in this workspace.")}>
            ▤ <span>Reports</span>
          </button>
          <button onClick={() => setNotice("Events are not collected by an ingestion API.")}>
            ⌁ <span>Events</span>
          </button>
          <button onClick={() => setNotice("Audience data is illustrative sample data.")}>
            ♙ <span>Audience</span>
          </button>
        </nav>
        <div className="nav-heading projects-heading">SAVED VIEWS</div>
        <button
          className="saved-view"
          onClick={() => setNotice("Acquisition view is a sample workspace shortcut.")}
        >
          <i className="view-dot violet" /> Acquisition
        </button>
        <button
          className="saved-view"
          onClick={() => setNotice("Activation view is a sample workspace shortcut.")}
        >
          <i className="view-dot mint" /> Activation
        </button>
        <button
          className="saved-view"
          onClick={() => setNotice("Retention view is a sample workspace shortcut.")}
        >
          <i className="view-dot amber" /> Retention
        </button>
        <div className="sidebar-bottom">
          <button onClick={() => setNotice("Settings are not backed by an account service.")}>
            ⚙ <span>Settings</span>
          </button>
          <div>
            <span className="profile-avatar">WI</span>
            <span>
              <b>Workspace owner</b>
              <small>Local demo</small>
            </span>
            <button onClick={() => setNotice("Profile menu is a UI-only control.")}>•••</button>
          </div>
        </div>
      </aside>
      <section className="metrics-main" id="overview">
        <header className="metrics-topbar">
          <div className="crumb">
            Northstar sample <span>/</span> <b>Overview</b>
          </div>
          <div className="top-actions">
            <button
              onClick={() => setNotice("Your team has no live shared activity in this demo.")}
            >
              ♧ <i />
            </button>
            <span className="profile-avatar">WI</span>
          </div>
        </header>
        <div className="metrics-content">
          <div className="heading-row">
            <div>
              <span className="eyebrow">WEDNESDAY, NOVEMBER 4, 2026 · SAMPLE DATA</span>
              <h1>Good morning.</h1>
              <p>Here’s a considered view of your product activity.</p>
            </div>
            <div className="heading-actions">
              <label className="range-select">
                ◷{" "}
                <select value={range} onChange={(event) => setRange(event.target.value)}>
                  <option>7 days</option>
                  <option>30 days</option>
                  <option>90 days</option>
                </select>
              </label>
              <button className="export-button" onClick={exportCsv}>
                ↓ <span>Export CSV</span>
              </button>
            </div>
          </div>
          <div className="demo-strip">
            <span>DEMO DATA</span> Metrics shown are illustrative and are not collected from a live
            product or users.
          </div>
          <section className="metric-cards" aria-label="Sample metrics">
            {[
              ["Sessions", summary.sessions, "+8.4%", "↗"],
              ["Unique visitors", summary.visitors, "+5.1%", "↗"],
              ["Avg. session", summary.duration, "+0:12", "↗"],
              ["Bounce rate", summary.bounce, "−2.6%", "↘"],
            ].map(([label, value, change, arrow]) => (
              <article className="metric-card" key={label}>
                <div>
                  <span>{label}</span>
                  <button
                    onClick={() => setNotice(`${label} is a sample metric.`)}
                    aria-label={`${label} information`}
                  >
                    ⓘ
                  </button>
                </div>
                <strong>{value}</strong>
                <small>
                  <i>
                    {arrow} {change}
                  </i>{" "}
                  vs previous period
                </small>
              </article>
            ))}
          </section>
          <section className="dashboard-grid">
            {widgets.map((widget) => (
              <article className={`widget widget-${widget.kind}`} key={widget.id}>
                <header>
                  <div>
                    <span className="eyebrow">
                      {widget.metric.toUpperCase()} · {range.toUpperCase()}
                    </span>
                    <h2>{widget.title}</h2>
                  </div>
                  <button
                    onClick={() =>
                      setWidgets((current) => current.filter((item) => item.id !== widget.id))
                    }
                    aria-label={`Remove ${widget.title}`}
                  >
                    •••
                  </button>
                </header>
                {widget.kind === "line" ? (
                  <>
                    <div className="chart-wrap">
                      <div className="chart-y-labels">
                        <span>12k</span>
                        <span>8k</span>
                        <span>4k</span>
                        <span>0</span>
                      </div>
                      <TrendChart values={values} />
                    </div>
                    <div className="chart-x-labels">
                      <span>Oct 06</span>
                      <span>Oct 13</span>
                      <span>Oct 20</span>
                      <span>Oct 27</span>
                      <span>Nov 03</span>
                    </div>
                  </>
                ) : widget.kind === "donut" ? (
                  <div className="donut-layout">
                    <div className="donut-chart">
                      <span>
                        <b>{summary.visitors}</b>
                        <small>visitors</small>
                      </span>
                    </div>
                    <div className="legend">
                      {channels.map((channel) => (
                        <div key={channel.name}>
                          <i style={{ background: channel.color }} />
                          <span>{channel.name}</span>
                          <b>{channel.amount}</b>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="pages-table">
                    <div className="table-head">
                      <span>PAGE</span>
                      <span>{widget.metric.toUpperCase()}</span>
                      <span>CHANGE</span>
                    </div>
                    {pageRows.map((row) => (
                      <div className="table-row" key={row[0]}>
                        <span>{row[0]}</span>
                        <b>{row[1]}</b>
                        <small>{row[2]}</small>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </section>
          <button className="add-widget" onClick={() => setShowBuilder(true)}>
            ＋ Add a widget
          </button>
          <footer className="metrics-footer">
            Sample workspace · No tracking script, customer data, or external analytics service is
            connected.
          </footer>
        </div>
      </section>
      {showBuilder && (
        <div className="modal-backdrop">
          <form
            className="widget-modal"
            onSubmit={(event) => {
              event.preventDefault();
              addWidget();
            }}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setShowBuilder(false)}
              aria-label="Close"
            >
              ×
            </button>
            <span className="eyebrow">CUSTOMIZE THIS VIEW</span>
            <h2>Add a sample widget</h2>
            <p>Choose a visualization to add to the local dashboard.</p>
            <label>
              Widget type
              <select
                value={widgetType}
                onChange={(event) => setWidgetType(event.target.value as Widget["kind"])}
              >
                <option value="line">Trend line</option>
                <option value="bar">Event table</option>
                <option value="donut">Segment donut</option>
              </select>
            </label>
            <button className="export-button" type="submit">
              Add widget
            </button>
          </form>
        </div>
      )}
      {notice && (
        <div className="metrics-toast" role="status">
          {notice}
          <button onClick={() => setNotice("")} aria-label="Dismiss">
            ×
          </button>
        </div>
      )}
    </main>
  );
}
