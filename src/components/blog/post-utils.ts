import type { PostSummary } from "@/lib/types";

/**
 * Pure helpers for the Insights pages. No current-time reads, so every result
 * is deterministic and safe inside prerendered Server Components.
 */

export type Topic = { name: string; count: number };

/** Element ids used by the article page shell. Markdown headings never reuse them. */
export const ARTICLE_IDS = {
  title: "article-title",
  body: "article-body",
  contents: "article-contents",
  related: "related-title",
} as const;

/** Every tag in use, most-used first, then alphabetical. */
export function collectTopics(posts: readonly PostSummary[]): Topic[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of new Set(post.tags)) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts, ([name, count]) => ({ name, count })).sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name, "en"),
  );
}

/**
 * Related reading: posts that share the most tags come first (newest first
 * within a tie), then the latest remaining posts fill any open slots.
 * `posts` is expected newest first, as getPosts() returns it.
 */
export function getRelatedPosts(current: Pick<PostSummary, "slug" | "tags">, posts: readonly PostSummary[], limit = 3) {
  const others = posts.filter((p) => p.slug !== current.slug);
  const shared = (p: PostSummary) => p.tags.filter((tag) => current.tags.includes(tag)).length;
  const sameTopic = others
    .map((post, order) => ({ post, order, score: shared(post) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .map((entry) => entry.post);
  const latest = others.filter((p) => !sameTopic.includes(p));
  return [...sameTopic, ...latest].slice(0, limit);
}

/** "03" style index for Swiss mono labels. */
export function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/** "1 article" / "3 articles" */
export function articleCount(value: number): string {
  return `${value} ${value === 1 ? "article" : "articles"}`;
}

/** LinkedIn share dialog for an absolute URL. */
export function linkedInShareUrl(absoluteUrl: string): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(absoluteUrl)}`;
}
