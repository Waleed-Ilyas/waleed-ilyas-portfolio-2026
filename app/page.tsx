import { ContactCopyLinks } from "@/components/contact-copy-links";
import { ContactFormLoader } from "@/components/contact-form-loader";
import { HeroCanvasLoader } from "@/components/hero-canvas-loader";
import { Icon } from "@/components/icon";
import { ProjectShowcase } from "@/components/project-showcase";
import { SiteNavigation } from "@/components/site-navigation";
import Image from "next/image";

const structuredData = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Waleed Ilyas",
  sameAs: ["https://github.com/Waleed-Ilyas", "https://www.linkedin.com/in/waleed-ilyas-664839213"],
}).replace(/</g, "\\u003c");

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <main id="main-content">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
        <SiteNavigation />

        <section
          className="hero section-wrap"
          id="home"
          aria-labelledby="hero-title"
          data-scroll-reveal="up"
        >
          <div className="hero-glow" aria-hidden="true" />
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" /> OPEN TO REMOTE ROLES
            </p>
            <h1 id="hero-title">
              Full-stack products
              <br />
              <span>from UI to chain.</span>
            </h1>
            <p className="hero-description">
              I&apos;m Waleed Ilyas, a full-stack engineer working across MERN, Next.js, and Solana.
              I build product experiences end to end, from data models and APIs to polished,
              responsive interfaces.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projects">
                Explore my builds <Icon name="arrow" />
              </a>
              <a className="button button-quiet" href="#contact">
                Get in touch
              </a>
            </div>
            <div className="hero-socials" aria-label="Contact and social links">
              <a
                href="https://github.com/Waleed-Ilyas"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <Icon name="github" />
              </a>
              <a
                href="https://www.linkedin.com/in/waleed-ilyas-664839213"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <Icon name="linkedin" />
              </a>
              <a href="mailto:waleedilyas99@gmail.com" aria-label="Email">
                <Icon name="mail" />
              </a>
              <a href="tel:+923176063654" aria-label="Phone">
                <Icon name="phone" />
              </a>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <HeroCanvasLoader />
            <div className="hero-cube">
              <i className="cube-front">WI</i>
              <i className="cube-back">12</i>
              <i className="cube-right">&lt;/&gt;</i>
              <i className="cube-left">◉</i>
              <i className="cube-top">✳</i>
              <i className="cube-bottom">01</i>
            </div>
            <div className="hero-monogram">
              WI<span>.</span>
            </div>
            <div className="art-caption">
              <span>INDEPENDENT BUILDS</span>
              <span>01 — 12</span>
            </div>
          </div>
          <figure className="hero-portrait">
            <Image
              src="/images/waleed-profile.jpg"
              alt="Portrait of Waleed Ilyas"
              width={1068}
              height={1600}
              sizes="(max-width: 640px) 160px, (max-width: 980px) 220px, 300px"
              quality={85}
            />
          </figure>
          <a className="scroll-cue" href="#about">
            <span className="scroll-line" /> Scroll to explore
          </a>
        </section>

        <section
          className="intro section-wrap"
          id="about"
          aria-labelledby="about-title"
          data-scroll-reveal="up"
        >
          <div className="section-kicker">
            <span>01</span>
            <span>INTRODUCTION</span>
          </div>
          <div className="intro-body">
            <h2 id="about-title">
              A digital craft, built
              <br />
              one <span>idea at a time.</span>
            </h2>
            <div className="intro-note">
              <p>
                I design and ship full-stack products across web applications and Solana interfaces,
                with attention to clear architecture, dependable APIs, and thoughtful UI details.
              </p>
              <p>
                Alongside my professional experience, this portfolio presents twelve new,
                independently built product demos. Each one documents its working interactions and
                the services it does not connect to.
              </p>
              <p className="verification-note">
                Based in Pakistan (UTC+5), I&apos;m open to remote full-time, contract, and
                freelance opportunities.
              </p>
              <a className="text-link" href="#experience">
                Explore my experience <Icon name="arrow" />
              </a>
            </div>
          </div>
        </section>

        <section
          className="experience-section section-wrap"
          id="experience"
          aria-labelledby="experience-title"
          data-scroll-reveal="up"
        >
          <div className="section-kicker">
            <span>02</span>
            <span>EXPERIENCE</span>
          </div>
          <div className="section-heading">
            <div>
              <h2 id="experience-title">
                Building for the <span>real world.</span>
              </h2>
              <p>
                Professional experience across full-stack development, analytics, and product
                delivery.
              </p>
            </div>
          </div>
          <div className="experience-list">
            <article className="experience-entry">
              <div className="experience-meta">
                <span>2024 — 2026</span>
                <span>Pakistan · Remote</span>
              </div>
              <div className="experience-detail">
                <p className="experience-company">Buggcy</p>
                <h3>
                  Full Stack Developer <span>· MERN, Next.js &amp; Solana</span>
                </h3>
                <ul>
                  <li>
                    Build and maintain full-stack applications with React, Next.js, Node.js,
                    Express, and MongoDB.
                  </li>
                  <li>
                    Design REST APIs with authentication, role-based access, validation, and
                    centralized error handling.
                  </li>
                  <li>
                    Develop Solana features including wallet connections, SPL token transfers, and
                    Anchor program interfaces.
                  </li>
                  <li>
                    Integrate real-time updates and third-party services; improve performance
                    through code splitting, image optimization, indexing, and caching.
                  </li>
                </ul>
                <div className="experience-tags">
                  <span>React</span>
                  <span>Next.js</span>
                  <span>TypeScript</span>
                  <span>Node.js</span>
                  <span>MongoDB</span>
                  <span>Solana</span>
                  <span>Anchor</span>
                </div>
              </div>
            </article>
            <article className="experience-entry">
              <div className="experience-meta">
                <span>2022 — 2024</span>
                <span>Pakistan</span>
              </div>
              <div className="experience-detail">
                <p className="experience-company">Invex Tech</p>
                <h3>MERN Stack Developer</h3>
                <ul>
                  <li>
                    Develop responsive React components and pages from Figma designs using Tailwind
                    CSS and Material UI.
                  </li>
                  <li>
                    Build CRUD modules, dashboards, and admin panels with the MERN stack and Redux
                    Toolkit.
                  </li>
                  <li>
                    Create Express and Node.js APIs with MongoDB schemas, pagination, filtering, and
                    search.
                  </li>
                  <li>
                    Improve accessibility and cross-browser behavior; collaborate through Git
                    workflows, code reviews, and deployments.
                  </li>
                </ul>
                <div className="experience-tags">
                  <span>JavaScript</span>
                  <span>React</span>
                  <span>Redux Toolkit</span>
                  <span>Express</span>
                  <span>MongoDB</span>
                  <span>Tailwind CSS</span>
                </div>
              </div>
            </article>
          </div>
          <div className="education-note">
            <span>EDUCATION</span>
            <p>
              <strong>Bachelor of Computer Science (BSCS)</strong> · COMSATS University Islamabad ·
              2024
            </p>
          </div>
        </section>

        <section
          className="skills-section section-wrap"
          id="skills"
          aria-labelledby="skills-title"
          data-scroll-reveal="up"
        >
          <div className="section-kicker">
            <span>03</span>
            <span>TECHNOLOGY</span>
          </div>
          <div className="section-heading">
            <div>
              <h2 id="skills-title">
                Tools for the <span>whole product.</span>
              </h2>
              <p>From interface and API work to data, automation, and on-chain applications.</p>
            </div>
          </div>
          <div className="skills-grid">
            <article className="skill-group">
              <h3>Frontend</h3>
              <p>
                React · Next.js · TypeScript · JavaScript · Tailwind CSS · Redux Toolkit · Material
                UI · Three.js / React Three Fiber
              </p>
            </article>
            <article className="skill-group">
              <h3>Backend &amp; data</h3>
              <p>
                Node.js · Express · REST APIs · JWT / RBAC · Socket.io · MongoDB · Mongoose ·
                PostgreSQL · Prisma
              </p>
            </article>
            <article className="skill-group">
              <h3>Solana &amp; blockchain</h3>
              <p>Solana · Anchor · Rust · web3.js · SPL Token · Metaplex</p>
            </article>
            <article className="skill-group">
              <h3>Data &amp; analytics</h3>
              <p>
                Python · Pandas · NumPy · scikit-learn · SQL · Power BI · DAX · Power Query ·
                Tableau
              </p>
            </article>
            <article className="skill-group">
              <h3>Automation &amp; delivery</h3>
              <p>
                n8n · Google Sheets · Airtable · Notion · Slack integrations · Git · GitHub Actions
                · Vercel · Postman
              </p>
            </article>
          </div>
          <div className="certification-line">
            <span>SELECTED CERTIFICATIONS</span>
            <p>
              IBM Data Analyst Professional Certificate · IBM Data Analysis and Visualization
              Foundations · Microsoft Power BI Data Analyst Specialization · Google Business
              Intelligence Specialization · Google Data Analytics Certificate
            </p>
          </div>
        </section>

        <section
          className="build-overview section-wrap"
          aria-labelledby="build-overview-title"
          data-scroll-reveal="left"
        >
          <div className="section-kicker">
            <span>04</span>
            <span>THE WORKSPACE</span>
          </div>
          <div className="overview-heading">
            <div>
              <h2 id="build-overview-title">
                Twelve ideas.
                <br />
                <span>Built to be explored.</span>
              </h2>
              <p>
                Twelve original portfolio builds across web products, dashboards, and Solana
                interfaces. Explore each project and its clearly documented demo scope.
              </p>
            </div>
            <div className="overview-orbit" aria-hidden="true">
              <i />
              <i />
              <b>12</b>
            </div>
          </div>
          <div className="overview-stats">
            <article>
              <strong>12</strong>
              <span>standalone workspaces</span>
            </article>
            <article>
              <strong>3+ yrs</strong>
              <span>full-stack experience</span>
            </article>
            <article>
              <strong>12</strong>
              <span>independent demos</span>
            </article>
            <article>
              <strong>UTC+5</strong>
              <span>Pakistan · remote-ready</span>
            </article>
          </div>
          <div className="overview-stack">
            <span>CORE STACK</span>
            <div>
              <b>TypeScript</b>
              <b>Next.js 16</b>
              <b>React 19</b>
              <b>Responsive UI</b>
              <b>Accessible patterns</b>
            </div>
          </div>
        </section>

        <ProjectShowcase />

        <section
          className="writing-section section-wrap"
          aria-labelledby="writing-title"
          data-scroll-reveal="up"
        >
          <div className="section-kicker">
            <span>06</span>
            <span>DEVBLOG PRO / CONTENT DEMO</span>
          </div>
          <div className="writing-heading">
            <div>
              <h2 id="writing-title">
                Field notes from
                <br />
                <span>the demo workspace.</span>
              </h2>
              <p>
                Three sample articles from DevBlog Pro, one of the independent portfolio builds.
              </p>
            </div>
            <a className="text-link" href="https://waleed-devblog-pro.netlify.app">
              Open DevBlog Pro <Icon name="arrow" />
            </a>
          </div>
          <div className="writing-grid">
            {[
              [
                "ENGINEERING",
                "Building Scalable MERN Applications",
                "Practical architecture patterns for growing products.",
                "scalable-mern-patterns",
              ],
              [
                "BLOCKCHAIN",
                "A Safer Solana Program Workflow",
                "From local tests to careful transaction design.",
                "solana-anchor-workflows",
              ],
              [
                "PRODUCT",
                "Product Analytics That Answer Real Questions",
                "Choose events that explain a user journey.",
                "useful-product-analytics",
              ],
            ].map(([category, title, excerpt, slug], index) => (
              <article className="writing-card" key={slug}>
                <span className="writing-index">
                  0{index + 1} / {category}
                </span>
                <h3>{title}</h3>
                <p>{excerpt}</p>
                <a href={`https://waleed-devblog-pro.netlify.app/blog/${slug}`}>
                  Read sample article <Icon name="arrow" />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section
          className="contact-section section-wrap"
          id="contact"
          aria-labelledby="contact-title"
          data-scroll-reveal="up"
        >
          <div className="section-kicker">
            <span>07</span>
            <span>CONTACT</span>
          </div>
          <div className="contact-inner">
            <div>
              <h2 id="contact-title">
                Have a project
                <br />
                in mind<span>?</span>
              </h2>
              <p>Reach out directly. I&apos;m happy to hear what you&apos;re working on.</p>
            </div>
            <div className="contact-details">
              <ContactCopyLinks />
              <ContactFormLoader />
            </div>
          </div>
        </section>

        <footer className="site-footer section-wrap" data-scroll-reveal="up">
          <a className="brand" href="#home">
            <span className="brand-mark" aria-hidden="true">
              WI
            </span>
            <span>
              Waleed Ilyas
              <span className="brand-dot" aria-hidden="true">
                .
              </span>
            </span>
          </a>
          <nav className="footer-links" aria-label="Footer navigation">
            <a href="#about">About</a>
            <a href="#projects">Demos</a>
            <a href="#writing-title">Writing</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className="footer-socials" aria-label="Social links">
            <a
              href="https://github.com/Waleed-Ilyas"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <Icon name="github" />
            </a>
            <a
              href="https://www.linkedin.com/in/waleed-ilyas-664839213"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <Icon name="linkedin" />
            </a>
          </div>
          <span>Independent portfolio demos · 2026</span>
          <a href="#home">Back to top ↑</a>
        </footer>
        <a className="floating-contact" href="#contact">
          <span className="floating-pulse" /> Let&apos;s talk <Icon name="arrow" />
        </a>
      </main>
    </>
  );
}
