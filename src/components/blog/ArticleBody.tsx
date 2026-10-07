import "server-only";

import type { ReactElement } from "react";
import Markdown, { type Options } from "react-markdown";
import remarkGfm from "remark-gfm";

import { markdownComponents } from "@/components/content/Markdown";
// Reuse the shared prose styles so articles read exactly like every other Markdown block.
import proseStyles from "@/components/content/Markdown.module.css";

import { ARTICLE_IDS } from "./post-utils";

/**
 * Article renderer for /blog/[slug].
 *
 * Uses the shared element mapping from src/components/content/Markdown.tsx
 * (raw HTML skipped, headings shifted so the page owns the only H1, safe
 * links) and adds stable ids on the section headings plus the list of those
 * headings, for the "In this article" contents.
 *
 * The ids come from a small remark plugin that runs inside the same parse that
 * renders the body, so the contents and the rendered H2s can never disagree.
 */

export type TocHeading = { id: string; text: string };

type MdNode = {
  type: string;
  depth?: number;
  value?: string;
  alt?: string;
  children?: MdNode[];
  data?: { hProperties?: Record<string, unknown> } & Record<string, unknown>;
};

type Pluggable = NonNullable<Options["remarkPlugins"]>[number];

/** Ids already used by the layout and page shell; a heading never takes one of these. */
const RESERVED_IDS = new Set<string>(["main", "page-title", "cta-band-title", ...Object.values(ARTICLE_IDS)]);

function textOf(node: MdNode): string {
  if (node.type === "text" || node.type === "inlineCode") return node.value ?? "";
  if (node.type === "image") return node.alt ?? "";
  return (node.children ?? []).map(textOf).join("");
}

export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64)
    .replace(/-+$/g, "");
}

/** Assigns unique ids to top-level "#" and "##" headings (both render as H2) and records them. */
function headingIds(out: TocHeading[]): Pluggable {
  return () => (tree: MdNode) => {
    const taken = new Set<string>();
    for (const node of tree.children ?? []) {
      if (node.type !== "heading" || (node.depth ?? 0) > 2) continue;
      const text = textOf(node).replace(/\s+/g, " ").trim();
      if (!text) continue;
      const base = slugify(text) || `section-${out.length + 1}`;
      let id = base;
      for (let n = 2; RESERVED_IDS.has(id) || taken.has(id); n += 1) id = `${base}-${n}`;
      taken.add(id);
      node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id } };
      out.push({ id, text });
    }
  };
}

/**
 * Renders the article body and returns its section headings.
 * react-markdown's synchronous renderer is a plain function (no hooks), so it
 * is evaluated here, on the server, to read the headings it produced.
 */
export function renderArticle(markdown: string): { body: ReactElement; headings: TocHeading[] } {
  const headings: TocHeading[] = [];
  const content = Markdown({
    children: markdown,
    remarkPlugins: [remarkGfm, headingIds(headings)],
    components: markdownComponents,
    skipHtml: true,
  });
  return {
    body: <div className={`${proseStyles.prose} ${proseStyles.lg}`}>{content}</div>,
    headings,
  };
}
