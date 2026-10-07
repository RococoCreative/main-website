import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Flourish } from "@/components/ui/Flourish";
import { ArrowRight } from "@/components/ui/icons";
import { GridGuides, Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { formatDate, isoDate, readingTime } from "@/lib/format";
import { isOptimizable } from "@/lib/images";
import { site } from "@/lib/site";
import type { Post, PostSummary } from "@/lib/types";

import styles from "./Article.module.css";
import type { TocHeading } from "./ArticleBody";
import { MonoLabel } from "./MonoLabel";
import { PostCard } from "./PostCard";
import { pad } from "./post-utils";
import { TopicList } from "./TopicList";

/* -----------------------------------------------------------------------------
 * Header: breadcrumb, topics, title, lead, title block, cover or dimension rule
 * -------------------------------------------------------------------------- */

/** next/image optimizes local files and the configured Supabase Storage bucket; anything else is served as-is. */
export function ArticleHeader({ post, titleId }: { post: Post; titleId: string }) {
  const published = isoDate(post.publishedAt);
  const updated = isoDate(post.updatedAt);
  const showUpdated = updated > published;

  return (
    <header className={styles.header}>
      <GridGuides />
      <div className={`container ${styles.headerInner}`}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <ol role="list">
            <li className={styles.crumb}>
              <Link href="/blog" className={styles.crumbLink}>
                Insights
              </Link>
            </li>
            <li className={`${styles.crumb} ${styles.crumbCurrent}`}>
              <span className={styles.crumbSep} aria-hidden="true">
                /
              </span>
              <span aria-current="page" className={styles.crumbPage}>
                {post.title}
              </span>
            </li>
          </ol>
        </nav>

        <div className={styles.headline}>
          <MonoLabel>{post.tags.length ? <TopicList topics={post.tags} /> : "Insights"}</MonoLabel>
          <h1 id={titleId} className={styles.title}>
            {post.title}
          </h1>
          <p className={styles.lead}>{post.excerpt}</p>
        </div>

        <dl className={styles.meta}>
          <div className={styles.metaItem}>
            <dt>Written by</dt>
            <dd>
              {post.authorName}
              {post.authorRole ? <span className={styles.metaSub}>{post.authorRole}</span> : null}
            </dd>
          </div>
          <div className={styles.metaItem}>
            <dt>Published</dt>
            <dd>
              <time dateTime={published}>{formatDate(post.publishedAt)}</time>
            </dd>
          </div>
          {showUpdated ? (
            <div className={styles.metaItem}>
              <dt>Updated</dt>
              <dd>
                <time dateTime={updated}>{formatDate(post.updatedAt)}</time>
              </dd>
            </div>
          ) : null}
          <div className={styles.metaItem}>
            <dt>Reading time</dt>
            <dd>{readingTime(post.readingMinutes)}</dd>
          </div>
        </dl>

        {post.coverImageUrl ? (
          <div className={styles.cover}>
            <Image
              src={post.coverImageUrl}
              alt={post.coverImageAlt ?? ""}
              fill
              preload
              sizes="(min-width: 1328px) 1200px, 92vw"
              className={styles.coverImage}
              unoptimized={!isOptimizable(post.coverImageUrl)}
            />
          </div>
        ) : (
          <DimensionRule />
        )}
      </div>
    </header>
  );
}

/**
 * Typographic stand-in for a cover image: a drafting dimension line with
 * slashed ticks, drawn outward from the centre on load (static under reduced
 * motion). Decorative only. It carries no label because the meta row above
 * already gives the reading time.
 */
function DimensionRule() {
  return (
    <div className={styles.dimension} aria-hidden="true">
      <span className={styles.dimTick} />
      <span className={`${styles.dimLine} ${styles.dimLineStart}`} />
      <span className={`${styles.dimLine} ${styles.dimLineEnd}`} />
      <span className={styles.dimTick} />
    </div>
  );
}

/* -----------------------------------------------------------------------------
 * Body layout: contents, Markdown, closing flourish, footer
 * -------------------------------------------------------------------------- */

export function ArticleLayout({
  contents,
  body,
  bodyId,
  footer,
}: {
  contents: ReactNode;
  body: ReactNode;
  bodyId: string;
  footer: ReactNode;
}) {
  return (
    <div className="container">
      <div className={`${styles.layout} ${contents ? styles.withContents : ""}`}>
        {contents}
        <div id={bodyId} className={styles.body}>
          {body}
        </div>
        <div className={styles.end}>
          <Flourish />
        </div>
        {footer}
      </div>
    </div>
  );
}

/** "In this article": built on the server from the body's H2s. */
export function ArticleContents({ headings, labelId }: { headings: TocHeading[]; labelId: string }) {
  return (
    <nav aria-labelledby={labelId} className={styles.contents}>
      <MonoLabel id={labelId} className={styles.contentsLabel}>
        In this article
      </MonoLabel>
      <ol role="list" className={styles.contentsList}>
        {headings.map((heading, i) => (
          <li key={heading.id}>
            <a href={`#${heading.id}`} className={styles.contentsLink}>
              <span className={styles.contentsIndex} aria-hidden="true">
                {pad(i + 1)}
              </span>
              <span>{heading.text}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function ArticleFooter({ post, shareUrl }: { post: Post; shareUrl: string }) {
  const isStudio = post.authorName === site.name;
  return (
    <footer className={styles.footer}>
      <div className={styles.author}>
        <Eyebrow>Written by</Eyebrow>
        <p className={styles.authorName}>{post.authorName}</p>
        {post.authorRole ? <p className={styles.authorRole}>{post.authorRole}</p> : null}
        <p className={styles.authorBio}>{site.description}</p>
        <Link href="/about" className={styles.textLink}>
          {isStudio ? "About the agency" : `About ${site.name}`}
          <ArrowRight className={styles.textLinkIcon} />
        </Link>
      </div>
      <div className={styles.share}>
        <p className={styles.shareLabel}>Share this article</p>
        <ButtonLink href={shareUrl} variant="secondary">
          Share on LinkedIn
        </ButtonLink>
      </div>
    </footer>
  );
}

/* -----------------------------------------------------------------------------
 * Related reading
 * -------------------------------------------------------------------------- */

export function RelatedPosts({ posts, titleId }: { posts: PostSummary[]; titleId: string }) {
  return (
    <Section surface="alt" aria-labelledby={titleId} data-print-hidden>
      <SectionHeader
        eyebrow="Keep reading"
        title="Related field notes."
        titleId={titleId}
        actions={
          <ButtonLink href="/blog" variant="ghost" arrow>
            All insights
          </ButtonLink>
        }
      />
      <ul role="list" className={styles.relatedList}>
        {posts.map((post) => (
          <li key={post.slug}>
            <PostCard post={post} headingLevel={3} variant="compact" />
          </li>
        ))}
      </ul>
    </Section>
  );
}
