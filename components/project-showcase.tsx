import { Icon } from "@/components/icon";
import { categories, featuredSlugs, projects } from "@/lib/project-catalog";
import Image from "next/image";

function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  return (
    <article className="project-card" data-category={project.category} data-reveal-item>
      <div className={`project-visual visual-${(index % 4) + 1}`}>
        <Image
          className="project-screenshot"
          src={`/images/projects/${project.slug}.png`}
          alt={`${project.name} portfolio demo screenshot`}
          fill
          sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 900px) 45vw, 560px"
        />
        <span className="project-image-shade" aria-hidden="true" />
        <span className="visual-index">{String(index + 1).padStart(2, "0")}</span>
        <span className="visual-category">{project.category}</span>
      </div>
      <div className="project-content">
        <div className="project-title-line">
          <div>
            <span className="concept-label">INDEPENDENT SHOWCASE</span>
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
          Interactive demo · sample data
        </div>
        <div className="project-actions">
          <a href={project.demoUrl} target="_blank" rel="noreferrer">
            Live demo <Icon name="arrow" />
          </a>
          <a href={project.repoUrl} target="_blank" rel="noreferrer">
            GitHub repo <Icon name="arrow" />
          </a>
          <details className="project-details">
            <summary>Scope</summary>
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
              <p className="project-source-note">
                Independent showcase source ·{" "}
                <a href={project.repoUrl} target="_blank" rel="noreferrer">
                  GitHub repository
                </a>
              </p>
            </div>
          </details>
        </div>
      </div>
    </article>
  );
}

export function ProjectShowcase() {
  const featured = featuredSlugs
    .map((slug) => projects.find((project) => project.slug === slug)!)
    .filter(Boolean);
  const more = projects.filter(
    (project) => !featuredSlugs.includes(project.slug as (typeof featuredSlugs)[number]),
  );
  return (
    <section
      className="projects-section section-wrap"
      id="projects"
      aria-labelledby="projects-title"
      data-scroll-reveal="left"
    >
      <div className="section-kicker">
        <span>01</span>
        <span>SELECTED SHOWCASES</span>
      </div>
      <div className="section-heading">
        <div>
          <h2 id="projects-title">
            Selected work<span>.</span>
          </h2>
          <p>
            Six independent builds selected to show how I approach product interfaces and full stack
            workflows.
          </p>
        </div>
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
      <div className="project-grid featured-project-grid" data-scroll-stagger>
        {featured.map((project) => (
          <ProjectCard key={project.slug} project={project} index={projects.indexOf(project)} />
        ))}
      </div>
      <details className="more-builds">
        <summary>
          More builds <span>{more.length} additional independent showcases</span>
        </summary>
        <div className="project-grid more-builds-grid">
          {more.map((project) => (
            <ProjectCard key={project.slug} project={project} index={projects.indexOf(project)} />
          ))}
        </div>
      </details>
      <p className="project-disclaimer">
        These are newly created, independent portfolio showcases, separate from my professional
        work. Sample data, integrations, and each demo&apos;s actual scope are documented on the
        cards and in their repositories.
      </p>
    </section>
  );
}
