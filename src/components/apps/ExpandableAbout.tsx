"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function ExpandableAbout({
  title = "About this app",
  text,
}: {
  title?: string;
  text: string;
}) {
  const [open, setOpen] = useState(false);
  const long = text.length > 320;

  return (
    <section className="border-b border-white/8 py-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="font-display text-xl text-white md:text-2xl">{title}</h2>
        {long ? (
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex items-center gap-1 text-sm text-[var(--neon-cyan)]"
          >
            {open ? "Show less" : "Read more"}
            <ChevronDown className={`size-4 transition ${open ? "rotate-180" : ""}`} />
          </button>
        ) : null}
      </div>
      <p
        className={`whitespace-pre-wrap text-[15px] leading-7 text-[var(--text-muted)] ${
          !open && long ? "line-clamp-5" : ""
        }`}
      >
        {text}
      </p>
    </section>
  );
}
