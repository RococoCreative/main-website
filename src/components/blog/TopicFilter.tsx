"use client";

import { useId, useState, type ReactNode } from "react";

import { Check } from "@/components/ui/icons";

import styles from "./BlogIndex.module.css";
import { MonoLabel } from "./MonoLabel";
import { articleCount, pad, type Topic } from "./post-utils";

export type IndexEntry = {
  slug: string;
  tags: string[];
  /** Server-rendered PostCard (variant "default", h3). */
  card: ReactNode;
  /** Server-rendered PostCard (variant "feature", h2). Only the newest entry has one. */
  feature?: ReactNode;
};

type TopicFilterProps = {
  entries: IndexEntry[];
  topics: Topic[];
};

/**
 * Insights listing with an optional topic filter.
 *
 * Progressive enhancement: the server HTML renders the unfiltered state (the
 * featured article plus every other card), so all posts are visible without
 * JavaScript. The filter toolbar is hidden by CSS when scripting is off
 * (@media (scripting: none)); with JavaScript it is present from first paint,
 * so nothing shifts on hydration.
 *
 * Toggle buttons expose aria-pressed; a polite status line announces the count.
 */
export function TopicFilter({ entries, topics }: TopicFilterProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const labelId = useId();
  const archiveId = useId();

  // Guard against a topic that disappeared while this view was kept alive.
  const active = selected && topics.some((t) => t.name === selected) ? selected : null;
  const total = entries.length;
  const [first, ...rest] = entries;
  const feature = active === null ? first?.feature : undefined;
  const list = active ? entries.filter((e) => e.tags.includes(active)) : feature ? rest : entries;
  const showFilter = total > 1 && topics.length > 1;

  const status = active
    ? `Showing ${list.length} of ${articleCount(total)} on ${active}`
    : `Showing all ${articleCount(total)}`;

  return (
    <div className={styles.listing}>
      {showFilter ? (
        <div className={styles.toolbar}>
          <p id={labelId} className={styles.toolbarLabel}>
            Filter by topic
          </p>
          <div role="group" aria-labelledby={labelId} className={styles.chips}>
            <FilterChip pressed={active === null} count={total} onClick={() => setSelected(null)}>
              All
            </FilterChip>
            {topics.map((topic) => (
              <FilterChip
                key={topic.name}
                pressed={active === topic.name}
                count={topic.count}
                onClick={() => setSelected(active === topic.name ? null : topic.name)}
              >
                {topic.name}
              </FilterChip>
            ))}
          </div>
          <p role="status" className={styles.status}>
            {status}
          </p>
        </div>
      ) : null}

      {feature ? (
        <div className={styles.featured}>
          <MonoLabel index="01">Latest</MonoLabel>
          {feature}
        </div>
      ) : null}

      {list.length ? (
        <section className={styles.archive} aria-labelledby={archiveId}>
          <MonoLabel as="h2" id={archiveId} index={feature ? "02" : undefined}>
            {active ? `Articles on ${active}` : feature ? "More field notes" : "All field notes"}
          </MonoLabel>
          <ul role="list" className={styles.grid} data-count={list.length}>
            {list.map((entry) => (
              <li key={entry.slug} className={styles.cell}>
                {entry.card}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function FilterChip({
  pressed,
  count,
  onClick,
  children,
}: {
  pressed: boolean;
  count: number;
  onClick: () => void;
  children: string;
}) {
  return (
    <button type="button" className={styles.chip} aria-pressed={pressed} onClick={onClick}>
      <Check className={styles.chipCheck} />
      <span>{children}</span>
      <span className={styles.chipCount} aria-hidden="true">
        {pad(count)}
      </span>
      <span className="visually-hidden">, {articleCount(count)}</span>
    </button>
  );
}
