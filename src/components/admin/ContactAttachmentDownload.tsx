"use client";

import { useTransition } from "react";
import { Download } from "lucide-react";
import { getContactAttachmentUrlAction } from "@/lib/admin/actions";

export function ContactAttachmentDownload({
  contactId,
  fileName,
}: {
  contactId: string;
  fileName: string;
}) {
  const [pending, startTransition] = useTransition();

  function download() {
    startTransition(async () => {
      const form = new FormData();
      form.set("_id", contactId);
      const result = await getContactAttachmentUrlAction(form);
      if (result.error || !result.success) {
        window.alert(result.error || "Could not download attachment.");
        return;
      }
      window.open(result.success, "_blank", "noopener,noreferrer");
    });
  }

  return (
    <button
      type="button"
      onClick={download}
      disabled={pending}
      className="inline-flex items-center gap-2 text-xs text-[var(--neon-cyan)] disabled:opacity-50"
    >
      <Download className="size-3.5" />
      {pending ? "Preparing…" : fileName}
    </button>
  );
}
