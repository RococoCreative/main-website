import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import ReactMarkdown, { type Components, type Options } from "react-markdown";
import remarkGfm from "remark-gfm";

import styles from "./Markdown.module.css";

/**
 * Renders CMS Markdown (GitHub-flavored) as React elements on the server.
 * Raw HTML in the source is ignored (react-markdown does not parse it without
 * rehype-raw), so content from Supabase cannot inject scripts.
 * Headings shift down one level: the page owns the single H1.
 */

function isInternal(href?: string): boolean {
  return Boolean(href && href.startsWith("/") && !href.startsWith("//"));
}

/** Shared element mapping. Reused by the blog article renderer (src/components/blog/ArticleBody.tsx). */
export const markdownComponents: Components = {
  h1: ({ node: _node, ...props }) => <h2 {...props} />,
  h2: ({ node: _node, ...props }) => <h2 {...props} />,
  h3: ({ node: _node, ...props }) => <h3 {...props} />,
  h4: ({ node: _node, ...props }) => <h4 {...props} />,
  a: ({ node: _node, href, children, ...props }) => {
    if (href && isInternal(href)) {
      return (
        <Link href={href} {...(props as Omit<ComponentPropsWithoutRef<typeof Link>, "href">)}>
          {children}
        </Link>
      );
    }
    const external = href?.startsWith("http");
    return (
      <a href={href} {...props} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
        {external ? <span className="visually-hidden"> (opens in a new tab)</span> : null}
      </a>
    );
  },
  // Images from Markdown use plain <img> with lazy loading; editors should supply alt text.
  img: ({ node: _node, alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt ?? ""} loading="lazy" decoding="async" {...props} />
  ),
  table: ({ node: _node, ...props }) => (
    <div className={styles.tableWrap} role="region" aria-label="Table" tabIndex={0}>
      <table {...props} />
    </div>
  ),
};

type MarkdownProps = {
  children: string;
  className?: string;
  size?: "md" | "lg";
  /** Extra remark plugins, applied after GitHub-flavored Markdown. */
  remarkPlugins?: NonNullable<Options["remarkPlugins"]>;
};

export function Markdown({ children, className, size = "md", remarkPlugins = [] }: MarkdownProps) {
  return (
    <div className={[styles.prose, styles[size], className].filter(Boolean).join(" ")}>
      <ReactMarkdown remarkPlugins={[remarkGfm, ...remarkPlugins]} components={markdownComponents} skipHtml>
        {children}
      </ReactMarkdown>
    </div>
  );
}
