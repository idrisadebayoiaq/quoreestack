"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Paperclip, Send, Terminal } from "lucide-react";
import { submitContactAction, type ContactActionState } from "@/lib/contact/actions";
import type { ContactValues } from "@/lib/contact/schema";

const inputClass =
  "w-full rounded-sm border border-[var(--border-glow)] bg-[#080c14]/90 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-[var(--neon-cyan)] focus:shadow-[var(--glow-sm)]";

type FieldErrors = Partial<Record<keyof ContactValues | "attachment", string>>;

const initialState: ContactActionState = {};

export type ContactServiceOption = {
  name: string;
  slug: string;
};

export function ContactForm({
  services = [],
  defaultServiceSlug,
  defaultSubject,
  defaultBudget,
  defaultMessage,
}: {
  services?: ContactServiceOption[];
  defaultServiceSlug?: string;
  defaultSubject?: string;
  defaultBudget?: string;
  defaultMessage?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(submitContactAction, initialState);
  const [clientError, setClientError] = useState<string | undefined>();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [fileLabel, setFileLabel] = useState("PDF, image, Word, Excel, text, or ZIP — max 10 MB");
  const [subject, setSubject] = useState(defaultSubject ?? "");
  const [budget, setBudget] = useState(defaultBudget ?? "");
  const [message, setMessage] = useState(defaultMessage ?? "");

  const matchedService = services.find(
    (service) => service.slug === defaultServiceSlug,
  );
  const defaultServiceInterest =
    matchedService?.name ??
    (defaultServiceSlug === "other" ? "Other" : "");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("quorestack-brief");
      if (!raw) return;
      const brief = JSON.parse(raw) as {
        budget?: string;
        message?: string;
        subject?: string;
      };
      if (brief.subject && !defaultSubject) setSubject(brief.subject);
      if (brief.budget && !defaultBudget) setBudget(brief.budget);
      if (brief.message && !defaultMessage) setMessage(brief.message);
      sessionStorage.removeItem("quorestack-brief");
    } catch {
      // ignore malformed brief payloads
    }
  }, [defaultBudget, defaultMessage, defaultSubject]);

  useEffect(() => {
    if (state.fieldErrors) {
      setErrors(state.fieldErrors as FieldErrors);
    }
    if (state.success) {
      formRef.current?.reset();
      setErrors({});
      setClientError(undefined);
      setFileLabel("PDF, image, Word, Excel, text, or ZIP — max 10 MB");
      setSubject("");
      setBudget("");
      setMessage("");
      localStorage.setItem("quorestack-contact-sent", String(Date.now()));
    }
  }, [state]);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    setClientError(undefined);
    const form = event.currentTarget;
    const data = new FormData(form);
    if (String(data.get("company") ?? "")) {
      event.preventDefault();
      return;
    }

    const lastSubmission = Number(localStorage.getItem("quorestack-contact-sent") ?? 0);
    if (Date.now() - lastSubmission < 60_000) {
      event.preventDefault();
      setClientError("Message already transmitted. Please wait one minute before retrying.");
    }
  }

  const notice =
    clientError
      ? { type: "error" as const, message: clientError }
      : state.error
        ? { type: "error" as const, message: state.error }
        : state.success
          ? { type: "success" as const, message: state.success }
          : undefined;

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={onSubmit}
      className="hud-corners relative space-y-5 border border-[var(--border-glow)] bg-[var(--bg-glass)] p-6 backdrop-blur-xl md:p-8"
    >
      <div className="flex items-center gap-3 border-b border-white/5 pb-5">
        <Terminal className="size-5 text-[var(--neon-cyan)]" />
        <p className="font-mono-label text-xs uppercase tracking-[0.25em] text-white">
          Project request
        </p>
      </div>

      <label className="hidden" aria-hidden="true">
        Company
        <input name="company" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label="Your name" error={errors.name}>
          <input name="name" required maxLength={100} className={inputClass} placeholder="Jane Doe" />
        </Field>
        <Field name="email" label="Email address" error={errors.email}>
          <input
            name="email"
            type="email"
            required
            maxLength={254}
            className={inputClass}
            placeholder="jane@company.com"
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="subject" label="Project subject" error={errors.subject}>
          <input
            name="subject"
            maxLength={200}
            className={inputClass}
            placeholder="Build a client platform"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
          />
        </Field>
        <Field name="serviceInterest" label="Service needed" error={errors.serviceInterest}>
          <select
            name="serviceInterest"
            className={inputClass}
            defaultValue={defaultServiceInterest}
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.slug} value={service.name}>
                {service.name}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="deliveryAt" label="Preferred delivery date" error={errors.deliveryAt}>
          <input name="deliveryAt" type="datetime-local" className={inputClass} />
        </Field>
        <Field name="budget" label="Price / budget" error={errors.budget}>
          <input
            name="budget"
            maxLength={80}
            className={inputClass}
            placeholder="e.g. ₦500,000 or $2,500"
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
          />
        </Field>
      </div>

      <Field name="message" label="Project description" error={errors.message}>
        <textarea
          name="message"
          required
          rows={7}
          minLength={10}
          maxLength={5000}
          className={inputClass}
          placeholder="Describe the product, goals, features, and any constraints..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </Field>

      <Field name="attachment" label="Project reference (optional)" error={errors.attachment}>
        <label className={`${inputClass} flex cursor-pointer items-center gap-3`}>
          <Paperclip className="size-4 shrink-0 text-[var(--neon-cyan)]" />
          <span className="truncate text-sm text-slate-400">{fileLabel}</span>
          <input
            name="attachment"
            type="file"
            className="sr-only"
            accept=".pdf,.png,.jpg,.jpeg,.webp,.gif,.zip,.doc,.docx,.xls,.xlsx,.txt,application/pdf,image/*,application/zip,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain"
            onChange={(event) => {
              const file = event.target.files?.[0];
              setFileLabel(file?.name || "PDF, image, Word, Excel, text, or ZIP — max 10 MB");
            }}
          />
        </label>
      </Field>

      {notice ? (
        <div
          role="status"
          aria-live="polite"
          className={`border p-3 text-sm ${
            notice.type === "success"
              ? "border-[var(--neon-green)]/40 bg-[var(--neon-green)]/5 text-[var(--neon-green)]"
              : "border-[var(--neon-magenta)]/40 bg-[var(--neon-magenta)]/5 text-pink-300"
          }`}
        >
          {notice.message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="font-mono-label inline-flex items-center gap-2 rounded-sm bg-[var(--neon-cyan)] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[var(--bg-primary)] shadow-[var(--glow-md)] transition hover:brightness-110 disabled:opacity-50"
      >
        <Send className="size-4" />
        {pending ? "Transmitting…" : "Send project request"}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  error,
  children,
}: {
  name: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="font-mono-label mb-2 block text-xs uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </span>
      {children}
      {error ? <span className="mt-1 block text-xs text-pink-300">{error}</span> : null}
    </div>
  );
}
