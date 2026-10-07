import Link from "next/link";

import type { PostSummary } from "@/lib/types";

/** STUB: replaced in the build phase. */
export function PostCard({
  post,
  headingLevel = 3,
}: {
  post: PostSummary;
  headingLevel?: 2 | 3;
  variant?: "default" | "compact" | "feature";
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article>
      <Heading>
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </Heading>
    </article>
  );
}
