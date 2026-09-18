import ReactMarkdown from "react-markdown";

export function MarkdownBody({
  content,
  fallback,
  className = "",
}: {
  content?: string | null;
  fallback?: string;
  className?: string;
}) {
  const text = content?.trim();
  if (!text) {
    return fallback ? (
      <p className="text-[var(--text-muted)]">{fallback}</p>
    ) : null;
  }

  return (
    <div
      className={`max-w-3xl space-y-4 text-base leading-8 text-[var(--text-muted)] md:text-lg [&_a]:text-[var(--neon-cyan)] [&_a]:underline-offset-4 hover:[&_a]:underline [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-white [&_h3]:font-display [&_h3]:text-xl [&_h3]:text-white [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-white ${className}`}
    >
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
}
