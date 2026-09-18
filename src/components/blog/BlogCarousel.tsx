"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BlogCard } from "@/components/cards/ContentCards";
import type { Blog } from "@/lib/data/content";

const CAROUSEL_THRESHOLD = 4;

export function BlogCarousel({ blogs }: { blogs: Blog[] }) {
  const [index, setIndex] = useState(0);
  const useCarousel = blogs.length >= CAROUSEL_THRESHOLD;

  useEffect(() => {
    if (!useCarousel) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % blogs.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [blogs.length, useCarousel]);

  if (!blogs.length) {
    return (
      <p className="text-[var(--text-muted)]">
        Blog posts will appear here once published.
      </p>
    );
  }

  if (!useCarousel) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    );
  }

  const visible = [
    blogs[index % blogs.length],
    blogs[(index + 1) % blogs.length],
    blogs[(index + 2) % blogs.length],
  ];

  return (
    <div className="relative">
      <div className="grid gap-6 md:grid-cols-3">
        {visible.map((blog, slot) => (
          <div
            key={`${blog.id}-${slot}`}
            className="animate-blog-slide"
          >
            <BlogCard blog={blog} />
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Previous posts"
          data-cursor="hover"
          onClick={() => setIndex((current) => (current - 1 + blogs.length) % blogs.length)}
          className="rounded-sm border border-[var(--border-glow)] p-2 text-[var(--neon-cyan)] transition hover:border-[var(--neon-cyan)]"
        >
          <ChevronLeft className="size-5" />
        </button>
        <div className="flex gap-2">
          {blogs.map((blog, dot) => (
            <button
              key={blog.id}
              type="button"
              aria-label={`Go to post ${dot + 1}`}
              onClick={() => setIndex(dot)}
              className={`h-2 w-2 rounded-full transition ${
                dot === index
                  ? "bg-[var(--neon-cyan)] shadow-[var(--glow-sm)]"
                  : "bg-white/20"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Next posts"
          data-cursor="hover"
          onClick={() => setIndex((current) => (current + 1) % blogs.length)}
          className="rounded-sm border border-[var(--border-glow)] p-2 text-[var(--neon-cyan)] transition hover:border-[var(--neon-cyan)]"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}
