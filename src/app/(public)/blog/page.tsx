import { SectionHeading } from "@/components/animations/SectionHeading";
import { BlogCarousel } from "@/components/blog/BlogCarousel";
import { SectionCta } from "@/components/cards/ContentCards";
import { getPublishedBlogs } from "@/lib/data/content";

export const revalidate = 60;

export default async function BlogPage() {
  const blogs = await getPublishedBlogs();

  return (
    <main>
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <SectionHeading index={1} eyebrow="Journal" title="Blog" />
        <p className="max-w-2xl text-lg text-[var(--text-muted)]">
          Notes on full-stack delivery, Android distribution, APIs, and shipping
          products that stay maintainable.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 md:px-6">
        <BlogCarousel blogs={blogs} />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <SectionHeading index={2} eyebrow="Next" title="Have a Topic in Mind?" />
        <SectionCta
          body="Want a walkthrough of a stack decision or a build process? Start a conversation."
          button="Contact QuoreStack"
        />
      </section>
    </main>
  );
}
