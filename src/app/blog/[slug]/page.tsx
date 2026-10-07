import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  ArticleContents,
  ArticleFooter,
  ArticleHeader,
  ArticleLayout,
  RelatedPosts,
} from "@/components/blog/Article";
import { renderArticle } from "@/components/blog/ArticleBody";
import { ARTICLE_IDS as ids, getRelatedPosts, linkedInShareUrl } from "@/components/blog/post-utils";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { CtaBand } from "@/components/layout/CtaBand";
import { getPostBySlug, getPostSlugs, getPosts } from "@/lib/content";
import { absoluteUrl, articleJsonLd, breadcrumbJsonLd, JsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

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
  if (!post) return { title: "Not found", robots: { index: false, follow: false } };

  const title = post.seoTitle ?? post.title;
  const description = post.seoDescription ?? post.excerpt;
  const path = `/blog/${post.slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    authors: [{ name: post.authorName }],
    // The Open Graph image comes from ./opengraph-image.tsx (file-based metadata wins).
    openGraph: {
      type: "article",
      url: path,
      siteName: site.name,
      locale: site.locale,
      title,
      description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.authorName],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([getPostBySlug(slug), getPosts()]);
  if (!post) notFound();

  const path = `/blog/${post.slug}`;
  const { body, headings } = renderArticle(post.body);
  const related = getRelatedPosts(post, posts);

  return (
    <>
      <ReadingProgress targetId={ids.body} />

      <article aria-labelledby={ids.title}>
        <ArticleHeader post={post} titleId={ids.title} />
        <ArticleLayout
          bodyId={ids.body}
          contents={headings.length > 1 ? <ArticleContents headings={headings} labelId={ids.contents} /> : null}
          body={body}
          footer={<ArticleFooter post={post} shareUrl={linkedInShareUrl(absoluteUrl(path))} />}
        />
      </article>

      {related.length ? <RelatedPosts posts={related} titleId={ids.related} /> : null}

      <CtaBand />

      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.seoDescription ?? post.excerpt,
          path,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt,
          authorName: post.authorName,
          image: post.coverImageUrl ?? absoluteUrl(`${path}/opengraph-image`),
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Insights", path: "/blog" },
          { name: post.title, path },
        ])}
      />
    </>
  );
}
