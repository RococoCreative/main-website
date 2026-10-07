import type { Metadata } from "next";

import { BlogFlourish, BlogIndex, BlogIndexStats } from "@/components/blog/BlogIndex";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { getPosts } from "@/lib/content";

import { pageMetadata } from "@/lib/metadata";
const title = "Insights";
const description =
  "Practical field notes on brand, websites, local search, and lead follow-up for construction company owners and the teams that run their marketing.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/blog" });

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Field notes on marketing for construction firms."
        lead={
          <p>
            Practical thinking on brand, websites, search, and follow-up for the people who run construction
            companies. Written to be useful on its own.
          </p>
        }
        aside={<BlogIndexStats posts={posts} />}
      />

      <Section spacing="tight" aria-label="Articles">
        <BlogIndex posts={posts} />
      </Section>

      <BlogFlourish />

      <CtaBand />
    </>
  );
}
