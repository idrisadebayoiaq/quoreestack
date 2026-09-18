import { createClient } from "@/lib/supabase/server";
import { deleteContactAction, setContactReadAction } from "@/lib/admin/actions";
import { ConfirmForm } from "@/components/admin/ConfirmForm";
import { ContactAttachmentDownload } from "@/components/admin/ContactAttachmentDownload";

export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  const db = await createClient();
  const { data, error } = await db
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-[var(--neon-cyan)]">Inbox</p>
        <h1 className="font-display mt-2 text-3xl">Contact submissions</h1>
      </div>
      {error ? <p className="text-red-300">{error.message}</p> : null}
      <div className="space-y-4">
        {data?.map((contact) => (
          <article
            key={contact.id}
            className={`rounded-sm border p-5 ${
              contact.is_read
                ? "border-white/10 bg-[var(--bg-glass)]"
                : "border-[var(--neon-cyan)] bg-cyan-400/5"
            }`}
          >
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <h2 className="font-display text-lg text-white">
                  {contact.subject || "No subject"}
                </h2>
                <p className="text-sm text-[var(--text-muted)]">
                  {contact.name} ·{" "}
                  <a className="text-[var(--neon-cyan)]" href={`mailto:${contact.email}`}>
                    {contact.email}
                  </a>
                  {contact.service_interest ? ` · ${contact.service_interest}` : ""}
                </p>
              </div>
              <time className="text-xs text-[var(--text-muted)]">
                {new Date(contact.created_at).toLocaleString()}
              </time>
            </div>

            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
                  Delivery
                </dt>
                <dd className="mt-1 text-white">
                  {contact.delivery_at
                    ? new Date(contact.delivery_at).toLocaleString()
                    : "Not specified"}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
                  Price / budget
                </dt>
                <dd className="mt-1 text-white">{contact.budget || "Not specified"}</dd>
              </div>
              {contact.attachment_path ? (
                <div className="sm:col-span-2">
                  <dt className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
                    Attachment
                  </dt>
                  <dd className="mt-1">
                    <ContactAttachmentDownload
                      contactId={contact.id}
                      fileName={contact.attachment_name || "Download attachment"}
                    />
                  </dd>
                </div>
              ) : null}
            </dl>

            <p className="mt-4 whitespace-pre-wrap text-sm leading-6">{contact.message}</p>

            <div className="mt-4 flex flex-wrap gap-4">
              <a
                className="text-xs text-[var(--neon-cyan)]"
                href={`mailto:${contact.email}?subject=${encodeURIComponent(
                  `Re: ${contact.subject || "Your project request"}`,
                )}`}
              >
                Reply in Gmail
              </a>
              <form action={setContactReadAction}>
                <input type="hidden" name="_id" value={contact.id} />
                <input type="hidden" name="_read" value={String(!contact.is_read)} />
                <button className="text-xs text-[var(--neon-cyan)]">
                  Mark {contact.is_read ? "unread" : "read"}
                </button>
              </form>
              <ConfirmForm
                action={deleteContactAction}
                fields={{ _id: contact.id }}
                message="Delete this contact submission permanently?"
              />
            </div>
          </article>
        ))}
        {!data?.length ? <p className="text-[var(--text-muted)]">Inbox is empty.</p> : null}
      </div>
    </div>
  );
}
