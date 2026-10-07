import { Fragment } from "react";

/**
 * Topics separated by a visual slash. The slash is hidden from assistive tech
 * and replaced by a spoken comma, so "Strategy / Websites" reads naturally.
 */
export function TopicList({ topics }: { topics: readonly string[] }) {
  return (
    <>
      {topics.map((topic, i) => (
        <Fragment key={topic}>
          {i > 0 ? (
            <>
              <span aria-hidden="true">&nbsp;/ </span>
              <span className="visually-hidden">, </span>
            </>
          ) : null}
          {topic}
        </Fragment>
      ))}
    </>
  );
}
