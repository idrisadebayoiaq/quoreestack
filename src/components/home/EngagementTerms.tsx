export type EngagementTerm = {
  title: string;
  body: string;
};

/**
 * Renders the `site_settings.engagement_terms` list (payment, revisions, ownership, support).
 * Nothing renders until real terms are saved — these are commitments, not placeholder copy.
 */
export function EngagementTerms({ terms }: { terms?: EngagementTerm[] | null }) {
  const items = (terms ?? []).filter((term) => term?.title && term?.body);
  if (!items.length) return null;

  return (
    <dl className="grid gap-px overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
      {items.map((term) => (
        <div key={term.title} className="corner-tick bg-[var(--bg-primary)] p-7">
          <dt className="font-display text-xl text-[var(--text-strong)]">{term.title}</dt>
          <dd className="mt-3 leading-7 text-[var(--text-muted)]">{term.body}</dd>
        </div>
      ))}
    </dl>
  );
}
