import type { MDXComponents } from "mdx/types";

function headingSlug(children: React.ReactNode) {
  return String(children)
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

const components: MDXComponents = {
  h2: ({ children, ...props }) => (
    <h2 id={headingSlug(children)} {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 id={headingSlug(children)} {...props}>
      {children}
    </h3>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
