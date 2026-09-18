import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/cards/ContentCards";
import { MarkdownBody } from "@/components/content/MarkdownBody";
import {
  DetailHero,
  DetailSection,
  TagList,
} from "@/components/details/DetailLayout";
import { NeonButton } from "@/components/ui/NeonButton";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("blogs")
    .select("slug")
    .eq("status", "published");
  return (data ?? []).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: blog } = await supabase
    .from("blogs")
    .select("title, short_description, meta_title, meta_description, cover_image_url")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!blog) return { title: "Post not found" };

  const title = blog.meta_title || blog.title;
  const description =
    blog.meta_description ||
    blog.short_description ||
    `Read ${blog.title} on QuoreStack.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: blog.cover_image_url ? [blog.cover_image_url] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: blog } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!blog) notFound();

  const { data: related } = await supabase
    .from("blogs")
    .select("*")
    .eq("status", "published")
    .neq("id", blog.id)
    .order("published_at", { ascending: false })
    .limit(3);

  const dateLabel = blog.published_at
    ? new Date(blog.published_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Published";

  return (
    <main>
      <DetailHero
        eyebrow="Blog"
        title={blog.title}
        summary={blog.short_description}
        imageUrl={blog.cover_image_url}
        imageAlt={blog.title}
        facts={[
          { label: "Author", value: blog.author },
          { label: "Published", value: dateLabel },
          {
            label: "Read time",
            value: blog.reading_time_minutes
              ? `${blog.reading_time_minutes} min`
              : "—",
          },
        ]}
      />

      <DetailSection title="Article">
        <MarkdownBody
          content={blog.long_description}
          fallback="Full article content is being prepared."
        />
        {blog.tags?.length ? (
          <div className="mt-8">
            <TagList items={blog.tags} emptyLabel="No tags" />
          </div>
        ) : null}
      </DetailSection>

      {related?.length ? (
        <DetailSection title="More posts">
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((item) => (
              <BlogCard key={item.id} blog={item} />
            ))}
          </div>
        </DetailSection>
      ) : null}

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="flex flex-wrap gap-4">
          <NeonButton href="/blog" variant="secondary">
            All posts
          </NeonButton>
          <NeonButton href="/contact">Start a project</NeonButton>
        </div>
      </section>
    </main>
  );
}
