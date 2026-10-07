import Link from "next/link";

import { ArrowRight } from "@/components/ui/icons";
import { formatDate, isoDate, readingTime } from "@/lib/format";
import type { PostSummary } from "@/lib/types";

import styles from "./PostCard.module.css";
import { TopicList } from "./TopicList";

type PostCardProps = {
  post: PostSummary;
  headingLevel?: 2 | 3;
  /**
   * default: tag and date, title, excerpt, reading time (grids).
   * compact: date and title in a ruled row (related reading lists).
   * feature: large serif title on a sand panel, two columns on desktop.
   */
  variant?: "default" | "compact" | "feature";
};

/**
 * Text-forward article card. The title is the only link and its name; a
 * stretched hit area makes the whole card clickable, and the focus ring is
 * drawn on the card itself. The heading comes first in the DOM so screen
 * reader users who jump by heading land on the title; CSS places the meta
 * line above it visually.
 */
export function PostCard({ post, headingLevel = 3, variant = "default" }: PostCardProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const href = `/blog/${post.slug}`;
  const date = (
    <time dateTime={isoDate(post.publishedAt)} className={styles.date}>
      {formatDate(post.publishedAt)}
    </time>
  );
  const title = (
    <Link href={href} className={styles.link}>
      {post.title}
    </Link>
  );

  if (variant === "compact") {
    return (
      <article className={`${styles.card} ${styles.compact}`}>
        <Heading className={styles.title}>{title}</Heading>
        <p className={styles.meta}>{date}</p>
        <ArrowRight className={styles.arrow} />
      </article>
    );
  }

  if (variant === "feature") {
    return (
      <article className={`${styles.card} ${styles.feature}`} data-surface="sand">
        <div className={styles.featureMain}>
          <Heading className={styles.title}>{title}</Heading>
        </div>
        <div className={styles.featureAside}>
          <p className={styles.excerpt}>{post.excerpt}</p>
          <p className={styles.byline}>
            <span>By {post.authorName}</span>
            <span className={styles.sep} aria-hidden="true" />
            <span>{readingTime(post.readingMinutes)}</span>
          </p>
          <span className={styles.more} aria-hidden="true">
            Read the article
            <ArrowRight className={styles.arrow} />
          </span>
        </div>
        <p className={styles.meta}>
          {date}
          {post.tags.length ? (
            <span className={styles.tags}>
              <span className="visually-hidden">Topics: </span>
              <TopicList topics={post.tags} />
            </span>
          ) : null}
        </p>
      </article>
    );
  }

  const [topic] = post.tags;
  return (
    <article className={`${styles.card} ${styles.default}`}>
      <Heading className={styles.title}>{title}</Heading>
      <p className={styles.excerpt}>{post.excerpt}</p>
      <p className={styles.meta}>
        {topic ? (
          <span className={styles.topic}>
            <span className="visually-hidden">Topic: </span>
            {topic}
          </span>
        ) : null}
        {date}
      </p>
      <p className={styles.foot}>
        <span>{readingTime(post.readingMinutes)}</span>
        <span className={styles.more} aria-hidden="true">
          Read
          <ArrowRight className={styles.arrow} />
        </span>
      </p>
    </article>
  );
}
