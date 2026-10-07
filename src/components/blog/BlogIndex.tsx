import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Flourish } from "@/components/ui/Flourish";
import { formatDate, isoDate } from "@/lib/format";
import { cta } from "@/lib/site";
import type { PostSummary } from "@/lib/types";

import styles from "./BlogIndex.module.css";
import { PostCard } from "./PostCard";
import { collectTopics, pad } from "./post-utils";
import { TopicFilter, type IndexEntry } from "./TopicFilter";

/** Hero aside: a small Swiss index of the archive, derived from content only. */
export function BlogIndexStats({ posts }: { posts: PostSummary[] }) {
  if (!posts.length) return null;
  const topics = collectTopics(posts);
  const latest = posts[0].publishedAt;
  return (
    <dl className={styles.stats}>
      <div className={styles.stat}>
        <dt>Articles</dt>
        <dd>
          <span aria-hidden="true">{pad(posts.length)}</span>
          <span className="visually-hidden">{posts.length}</span>
        </dd>
      </div>
      <div className={styles.stat}>
        <dt>Topics</dt>
        <dd>
          <span aria-hidden="true">{pad(topics.length)}</span>
          <span className="visually-hidden">{topics.length}</span>
        </dd>
      </div>
      <div className={styles.stat}>
        <dt>Latest</dt>
        <dd>
          <time dateTime={isoDate(latest)}>{formatDate(latest)}</time>
        </dd>
      </div>
    </dl>
  );
}

/**
 * The listing: newest article as a feature, the rest in a grid, with a
 * client-side topic filter layered on top (see TopicFilter).
 */
export function BlogIndex({ posts }: { posts: PostSummary[] }) {
  if (!posts.length) return <BlogEmptyState />;

  const entries: IndexEntry[] = posts.map((post, i) => ({
    slug: post.slug,
    tags: post.tags,
    card: <PostCard post={post} headingLevel={3} variant="default" />,
    ...(i === 0 ? { feature: <PostCard post={post} headingLevel={2} variant="feature" /> } : {}),
  }));

  return <TopicFilter entries={entries} topics={collectTopics(posts)} />;
}

/** The page's single gold flourish, set on the grid between the listing and the closing band. */
export function BlogFlourish() {
  return (
    <div className={`container ${styles.flourish}`} data-print-hidden>
      <Flourish />
    </div>
  );
}

function BlogEmptyState() {
  return (
    <div className={styles.empty}>
      <Eyebrow>Coming soon</Eyebrow>
      <h2 className={styles.emptyTitle}>The first field notes are on the way.</h2>
      <p className={styles.emptyBody}>
        We are writing practical guides on brand, websites, search, and follow-up for construction companies. Until
        they are published, the quickest way to hear our point of view is a short conversation.
      </p>
      <div className={styles.emptyActions}>
        <ButtonLink href={cta.primary.href} variant="primary" arrow>
          {cta.primary.label}
        </ButtonLink>
      </div>
    </div>
  );
}
