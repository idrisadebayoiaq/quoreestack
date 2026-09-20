"use client";

import { useActionState } from "react";
import { Star } from "lucide-react";
import {
  submitReviewAction,
  type ReviewActionState,
} from "@/lib/reviews/actions";

const initialState: ReviewActionState = {};

export function ReviewForm() {
  const [state, action, pending] = useActionState(submitReviewAction, initialState);

  return (
    <form action={action} className="space-y-5 border border-[var(--border-glow)] bg-[var(--bg-glass)] p-6 md:p-8">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="font-mono-label mb-2 block text-xs uppercase tracking-wider text-[var(--text-muted)]">
            Your name
          </span>
          <input
            name="author_name"
            required
            className="w-full rounded-sm border border-[var(--border-glow)] bg-[#080c14]/90 px-4 py-3 text-white outline-none focus:border-[var(--neon-cyan)]"
          />
          {state.fieldErrors?.author_name ? (
            <span className="mt-1 block text-xs text-red-400">{state.fieldErrors.author_name}</span>
          ) : null}
        </label>
        <label className="block">
          <span className="font-mono-label mb-2 block text-xs uppercase tracking-wider text-[var(--text-muted)]">
            Email
          </span>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-sm border border-[var(--border-glow)] bg-[#080c14]/90 px-4 py-3 text-white outline-none focus:border-[var(--neon-cyan)]"
          />
          {state.fieldErrors?.email ? (
            <span className="mt-1 block text-xs text-red-400">{state.fieldErrors.email}</span>
          ) : null}
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="font-mono-label mb-2 block text-xs uppercase tracking-wider text-[var(--text-muted)]">
            Role / title
          </span>
          <input
            name="author_title"
            className="w-full rounded-sm border border-[var(--border-glow)] bg-[#080c14]/90 px-4 py-3 text-white outline-none focus:border-[var(--neon-cyan)]"
          />
        </label>
        <label className="block">
          <span className="font-mono-label mb-2 block text-xs uppercase tracking-wider text-[var(--text-muted)]">
            Company
          </span>
          <input
            name="company"
            className="w-full rounded-sm border border-[var(--border-glow)] bg-[#080c14]/90 px-4 py-3 text-white outline-none focus:border-[var(--neon-cyan)]"
          />
        </label>
      </div>

      <fieldset>
        <legend className="font-mono-label mb-2 block text-xs uppercase tracking-wider text-[var(--text-muted)]">
          Rating
        </legend>
        <div className="flex flex-wrap gap-2">
          {[5, 4, 3, 2, 1].map((value) => (
            <label
              key={value}
              className="inline-flex cursor-pointer items-center gap-1 rounded-sm border border-[var(--border-glow)] px-3 py-2 text-sm text-white has-[:checked]:border-[var(--neon-cyan)] has-[:checked]:bg-[var(--neon-cyan)]/10"
            >
              <input
                type="radio"
                name="rating"
                value={value}
                defaultChecked={value === 5}
                className="sr-only"
              />
              <Star className="size-3.5 fill-[var(--neon-magenta)] text-[var(--neon-magenta)]" />
              {value}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="font-mono-label mb-2 block text-xs uppercase tracking-wider text-[var(--text-muted)]">
          Your review
        </span>
        <textarea
          name="quote"
          required
          rows={5}
          minLength={20}
          placeholder="What was the project, and how did working together go?"
          className="w-full rounded-sm border border-[var(--border-glow)] bg-[#080c14]/90 px-4 py-3 text-white outline-none focus:border-[var(--neon-cyan)]"
        />
        {state.fieldErrors?.quote ? (
          <span className="mt-1 block text-xs text-red-400">{state.fieldErrors.quote}</span>
        ) : null}
      </label>

      <label className="block">
        <span className="font-mono-label mb-2 block text-xs uppercase tracking-wider text-[var(--text-muted)]">
          Photo URL (optional)
        </span>
        <input
          name="image_url"
          type="url"
          placeholder="https://…"
          className="w-full rounded-sm border border-[var(--border-glow)] bg-[#080c14]/90 px-4 py-3 text-white outline-none focus:border-[var(--neon-cyan)]"
        />
        <span className="mt-1 block text-xs text-[var(--text-muted)]">
          Link a public image of the finished work or your logo. Reviews are moderated before publishing.
        </span>
      </label>

      {state.error ? <p className="text-sm text-red-400">{state.error}</p> : null}
      {state.success ? (
        <p className="text-sm text-[var(--neon-green)]">{state.success}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="font-mono-label rounded-sm bg-[var(--neon-cyan)] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--bg-primary)] disabled:opacity-50"
      >
        {pending ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
