import { Icon } from "@/components/icon";

const contacts = [
  {
    label: "EMAIL",
    value: "waleedilyas99@gmail.com",
    copyValue: "waleedilyas99@gmail.com",
    href: "mailto:waleedilyas99@gmail.com",
    icon: "mail",
  },
  {
    label: "LINKEDIN",
    value: "Connect with me",
    copyValue: "https://www.linkedin.com/in/waleed-ilyas-664839213",
    href: "https://www.linkedin.com/in/waleed-ilyas-664839213",
    icon: "linkedin",
  },
  {
    label: "GITHUB",
    value: "See my repositories",
    copyValue: "https://github.com/Waleed-Ilyas",
    href: "https://github.com/Waleed-Ilyas",
    icon: "github",
  },
] as const;

export function ContactCopyLinks() {
  return (
    <div className="contact-links">
      {contacts.map((contact) => (
        <div className="contact-link-row" key={contact.label}>
          <a
            href={contact.href}
            target={contact.href.startsWith("https:") ? "_blank" : undefined}
            rel={contact.href.startsWith("https:") ? "noreferrer" : undefined}
          >
            <span className="contact-icon">
              <Icon name={contact.icon} />
            </span>
            <span>
              <small>{contact.label}</small>
              <strong>{contact.value}</strong>
            </span>
          </a>
          <button
            type="button"
            data-copy-value={contact.copyValue}
            aria-label={`Copy ${contact.label.toLowerCase()}`}
          >
            Copy
          </button>
        </div>
      ))}
      <p className="copy-status" id="contact-copy-status" role="status" aria-live="polite" />
    </div>
  );
}
