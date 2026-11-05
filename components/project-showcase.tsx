import { categories, projects } from "@/lib/project-catalog";
import { Icon } from "@/components/icon";
import Image from "next/image";

export function ProjectShowcase() {
  return (
    <section
      className="projects-section section-wrap"
      id="projects"
      aria-labelledby="projects-title"
      data-scroll-reveal="left"
    >
      <div className="section-kicker">
        <span>05</span>
        <span>PROJECT SHOWCASES</span>
      </div>
      <div className="section-heading">
        <div>
          <h2 id="projects-title">
            The build list<span>.</span>
          </h2>
          <p>Explore each local app, inspect its interactions, and review its boundaries.</p>
        </div>
        <span className="project-count">
          12 <small>TOTAL BUILDS</small>
        </span>
      </div>
      <div className="filter-row" role="radiogroup" aria-label="Filter projects by category">
        {categories.map((category) => {
          const id = `filter-${category.toLowerCase().replaceAll(" ", "-")}`;
          return (
            <label className="filter-option" key={category}>
              <input
                className="filter-radio"
                type="radio"
                name="project-category"
                id={id}
                defaultChecked={category === "All"}
              />
              <span className="filter-button">{category}</span>
            </label>
          );
        })}
      </div>
      <div className="project-grid">
        {projects.map((project, index) => (
          <article className="project-card" data-category={project.category} key={project.name}>
            <div className={`project-visual visual-${(index % 4) + 1}`}>
              <Image
                className="project-screenshot"
                src={`/images/projects/${project.slug}.png`}
                alt={`${project.name} portfolio demo screenshot`}
                fill
                sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 900px) 45vw, 360px"
              />
              <span className="project-image-shade" aria-hidden="true" />
              <span className="visual-index">{String(index + 1).padStart(2, "0")}</span>
              <span className="visual-category">{project.category}</span>
            </div>
            <div className="project-content">
              <div className="project-title-line">
                <div>
                  <span className="concept-label">NEW PORTFOLIO BUILD</span>
                  <h3>{project.name}</h3>
                </div>
                <span className="project-number">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <p className="project-type">{project.type}</p>
              <p className="project-description">{project.description}</p>
              <div className="stack-list" aria-label="Implemented technologies">
                {project.stack.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <div className="project-status">
                <span className="status-ring status-built" />
                Interactive portfolio demo · sample data
              </div>
              <div className="project-actions">
                <a href={`http://localhost:${project.port}`} target="_blank" rel="noreferrer">
                  Open local demo <Icon name="arrow" />
                </a>
                <details className="project-details">
                  <summary>Build details</summary>
                  <div className="project-detail-panel">
                    <h4>Implemented in this demo</h4>
                    <ul>
                      {project.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                    <div className="project-detail-boundary">
                      <strong>Scope</strong>
                      <p>{project.boundary}</p>
                    </div>
                    <p className="project-source-note">Source workspace: projects/{project.slug}</p>
                  </div>
                </details>
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="project-disclaimer">
        These twelve projects are new independent portfolio builds. Each card shows the actual demo
        interface; sample records and any backend or blockchain limitations are documented in its
        project workspace.
      </p>
    </section>
  );
}
