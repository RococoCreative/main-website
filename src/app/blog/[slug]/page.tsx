import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Markdown } from "@/components/content/Markdown";
import { getPostBySlug, getPostSlugs } from "@/lib/content";

/**
 * The complete page must be static. Known slugs prerender at build; an unknown
 * slug is generated once on first request (and cached), so missing content
 * resolves to notFound() before any HTML is sent: a real HTTP 404.
 */
export const ensureStatic = "navigation";

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not found" };
  return { title: post.title, description: post.excerpt };
}

/** STUB: replaced in the build phase. */
export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  return (
    <article className="container">
      <h1>{post.title}</h1>
      <Markdown>{post.body}</Markdown>
    </article>
  );
}
