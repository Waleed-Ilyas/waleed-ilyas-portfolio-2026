import { Icon } from "@/components/icon";

export function SiteNavigation() {
  return (
    <header className="site-header">
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
      <a className="menu-toggle" href="#primary-nav" aria-controls="primary-nav">
        Menu
      </a>
      <nav id="primary-nav" className="primary-nav" aria-label="Main navigation">
        <a className="nav-close" href="#home" aria-label="Close navigation">
          Close menu
        </a>
        <a href="#about">About</a>
        <a href="#experience">Experience</a>
        <a href="#skills">Skills</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
        <a className="nav-cta" href="#contact">
          Get in touch <Icon name="arrow" />
        </a>
      </nav>
    </header>
  );
}
