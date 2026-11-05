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
      <SiteNavigation />
      <main id="main-content">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />

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
              I&apos;m Waleed Ilyas, a Full Stack Developer with 3+ years of experience across MERN,
              Next.js, and Solana. I ship complete product experiences from data models and APIs to
              polished interfaces and on-chain program source.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projects">
                View featured projects <Icon name="arrow" />
              </a>
              <a className="button button-quiet" href="/resume/waleed-ilyas-resume.pdf" download>
                Download résumé
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
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <HeroCanvasLoader />
            <div className="hero-cube">
              <i className="cube-front">WI</i>
              <i className="cube-back">JS</i>
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
              <span>MERN · SOLANA</span>
            </div>
          </div>
          <figure className="hero-portrait">
            <Image
              src="/images/waleed-profile-square.png"
              alt="Portrait of Waleed Ilyas"
              width={800}
              height={800}
              sizes="(max-width: 640px) 142px, (max-width: 980px) 250px, 360px"
              quality={85}
              priority
            />
          </figure>
          <a className="scroll-cue" href="#about">
            <span className="scroll-line" /> Scroll to explore
          </a>
        </section>

        <section className="proof-strip section-wrap" aria-label="Primary engineering stack">
          <span>PRODUCT ENGINEERING</span>
          <strong>MERN</strong>
          <i aria-hidden="true" />
          <strong>Next.js</strong>
          <i aria-hidden="true" />
          <strong>TypeScript</strong>
          <i aria-hidden="true" />
          <strong>Solana · Anchor</strong>
        </section>

        <ProjectShowcase />

        <section
          className="skills-section section-wrap"
          id="skills"
          aria-labelledby="skills-title"
          data-scroll-reveal="up"
        >
          <div className="section-kicker">
            <span>02</span>
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
          <div className="skills-grid skills-prioritized">
            <article className="skill-group skill-primary">
              <span className="skill-label">01 / PRODUCT ENGINEERING</span>
              <h3>Full Stack · MERN</h3>
              <div className="skill-chips">
                {[
                  "React",
                  "Next.js",
                  "TypeScript",
                  "Node.js",
                  "Express",
                  "MongoDB",
                  "REST APIs",
                  "PostgreSQL",
                  "Prisma",
                  "Tailwind CSS",
                  "Redux Toolkit",
                ].map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </article>
            <article className="skill-group skill-primary">
              <span className="skill-label">02 / ON-CHAIN ENGINEERING</span>
              <h3>Blockchain · Solana</h3>
              <div className="skill-chips">
                {["Solana", "Rust", "Anchor", "web3.js", "SPL Token", "Metaplex"].map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </article>
            <article className="skill-group">
              <span className="skill-label">03 / SECONDARY</span>
              <h3>Data &amp; automation</h3>
              <p>Python · Pandas · NumPy · SQL · Power BI · n8n · GitHub Actions</p>
            </article>
          </div>
        </section>

        <section
          className="solana-scope section-wrap"
          aria-labelledby="solana-scope-title"
          data-scroll-reveal="up"
        >
          <div className="section-kicker">
            <span>03</span>
            <span>SOLANA SCOPE</span>
          </div>
          <div className="solana-scope-card">
            <div>
              <h2 id="solana-scope-title">
                Program source, <span>clearly scoped.</span>
              </h2>
              <p>
                SolMint, SolSwap, and SolGov each include Anchor program source and localnet tests
                in their repositories. Their public web demos are UI-only: none has a deployed
                program, connected wallet, or live chain actions.
              </p>
            </div>
            <div className="solana-repo-links">
              <a
                href="https://github.com/Waleed-Ilyas/waleed-solmint-nft"
                target="_blank"
                rel="noreferrer"
              >
                SolMint source ?
              </a>
              <a
                href="https://github.com/Waleed-Ilyas/waleed-soldex"
                target="_blank"
                rel="noreferrer"
              >
                SolSwap source ?
              </a>
              <a
                href="https://github.com/Waleed-Ilyas/waleed-solgov-dao"
                target="_blank"
                rel="noreferrer"
              >
                SolGov source ?
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
            <span>04</span>
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
                <span>Remote</span>
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
                <span>Remote</span>
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
            <p className="education-program">Solana Developer Specialization Program, Edversity</p>
          </div>
        </section>

        <section
          className="intro section-wrap"
          id="about"
          aria-labelledby="about-title"
          data-scroll-reveal="up"
        >
          <div className="section-kicker">
            <span>05</span>
            <span>ABOUT</span>
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
                This portfolio pairs my professional experience with a carefully selected group of
                independent, self-built showcases. Each demo documents its working interactions and
                service boundaries clearly.
              </p>
              <p className="verification-note">
                Available for remote full-time, contract, and freelance opportunities.
              </p>
              <a className="text-link" href="#experience">
                Explore my experience <Icon name="arrow" />
              </a>
            </div>
            <figure className="about-portrait">
              <Image
                src="/images/waleed-profile-square.png"
                alt="Waleed Ilyas, full stack and Solana developer"
                width={800}
                height={800}
                sizes="(max-width: 640px) 70vw, (max-width: 900px) 42vw, 300px"
                quality={82}
              />
              <figcaption>
                WALEED ILYAS <span>· REMOTE</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section
          className="contact-section section-wrap"
          id="contact"
          aria-labelledby="contact-title"
          data-scroll-reveal="up"
        >
          <div className="section-kicker">
            <span>06</span>
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
            <a href="#projects">Projects</a>
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
