import { PostCard } from "@/components/blog/PostCard";
import { ButtonLink } from "@/components/ui/Button";
import { Placeholder } from "@/components/ui/Placeholder";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getPosts } from "@/lib/content";

import cards from "./HomeCards.module.css";

/** Latest three articles (cached content, prerendered). */
export async function HomeInsights() {
  const posts = await getPosts({ limit: 3 });

  return (
    <Section aria-labelledby="insights-title">
      <SectionHeader
        eyebrow="Insights"
        title="Field notes on marketing a construction company."
        titleId="insights-title"
        intro={<p>Practical articles on websites, search, and follow-up, written for owners and decision-makers.</p>}
        actions={
          <ButtonLink href="/blog" variant="secondary" arrow>
            Read all insights
          </ButtonLink>
        }
      />

      {posts.length > 0 ? (
        <ul className={cards.cards} data-count={posts.length}>
          {posts.map((post) => (
            <li key={post.slug}>
              <PostCard post={post} headingLevel={3} variant="default" />
            </li>
          ))}
        </ul>
      ) : (
        <Placeholder label="TODO: Insights">Recent articles appear here. Publish at least one article.</Placeholder>
      )}
    </Section>
  );
}
