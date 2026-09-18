"use client";

import { useMemo, useState } from "react";
import { ImagePlus, X } from "lucide-react";

const inputClass =
  "w-full rounded-sm border border-[var(--border-glow)] bg-[#080c14] px-3 py-2 text-sm text-white outline-none transition focus:border-[var(--neon-cyan)]";

function toUrlList(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(String).map((item) => item.trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export function MultiImageField({
  name,
  label,
  value,
  help,
  multiple = true,
}: {
  name: string;
  label: string;
  value: unknown;
  help?: string;
  multiple?: boolean;
}) {
  const [existing, setExisting] = useState<string[]>(() => toUrlList(value));
  const [pendingNames, setPendingNames] = useState<string[]>([]);

  const countLabel = useMemo(() => {
    const pending = pendingNames.length;
    if (!existing.length && !pending) return "No images yet";
    const parts = [
      existing.length ? `${existing.length} saved` : null,
      pending ? `${pending} ready to upload` : null,
    ].filter(Boolean);
    return parts.join(" · ");
  }, [existing.length, pendingNames.length]);

  return (
    <div className="space-y-3">
      <input type="hidden" name={`${name}_existing`} value={existing.join(",")} />

      {existing.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {existing.map((url) => (
            <div
              key={url}
              className="group relative overflow-hidden rounded-xl border border-[var(--border-glow)] bg-black/30"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="aspect-[9/16] w-full object-cover" />
              <button
                type="button"
                onClick={() => setExisting((current) => current.filter((item) => item !== url))}
                className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-black/70 text-white opacity-90 transition hover:bg-red-500"
                aria-label={`Remove ${label}`}
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[var(--border-glow)] bg-black/20 px-4 py-8 text-center transition hover:border-[var(--neon-cyan)]/50 hover:bg-[var(--neon-cyan)]/5">
        <span className="grid size-12 place-items-center rounded-full border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]">
          <ImagePlus className="size-5" />
        </span>
        <span className="font-display text-sm text-white">
          {multiple ? "Add screenshots" : `Upload ${label.toLowerCase()}`}
        </span>
        <span className="max-w-sm text-xs leading-5 text-[var(--text-muted)]">
          {multiple
            ? "Select multiple images at once (PNG/JPG/WebP, max 8 MB each). They appear on the public app page like a Play Store gallery."
            : "PNG/JPG/WebP, max 8 MB."}
        </span>
        <input
          name={name}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="sr-only"
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            setPendingNames(files.map((file) => file.name));
            if (!multiple && files[0]) {
              // Keep existing single image until save replaces it.
            }
          }}
        />
      </label>

      <p className="text-xs text-[var(--text-muted)]">{countLabel}</p>
      {pendingNames.length ? (
        <ul className="space-y-1 text-xs text-[var(--neon-cyan)]">
          {pendingNames.map((fileName) => (
            <li key={fileName}>+ {fileName}</li>
          ))}
        </ul>
      ) : null}
      {help ? <small className="block text-[var(--text-muted)]">{help}</small> : null}
      {!multiple && existing[0] ? (
        <p className="break-all text-xs text-[var(--text-muted)]">Current: {existing[0]}</p>
      ) : null}
      {/* Keep a text fallback input class reference for consistency */}
      <span className="hidden">{inputClass}</span>
    </div>
  );
}
