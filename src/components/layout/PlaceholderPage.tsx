import { SectionHeading } from "@/components/animations/SectionHeading";

export default function PlaceholderPage({
  title,
  eyebrow,
}: {
  title: string;
  eyebrow: string;
}) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-4xl flex-col justify-center px-4 py-24 md:px-6">
      <SectionHeading index={1} eyebrow={eyebrow} title={title} />
      <p className="text-[var(--text-muted)]">
        Full content arrives in upcoming phases. Design system is live.
      </p>
    </main>
  );
}
