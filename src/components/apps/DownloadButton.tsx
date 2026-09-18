"use client";

import { useState } from "react";
import { Download, LoaderCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type DownloadResponse = {
  signedUrl?: string;
  error?: string;
};

function isSafeHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isExpoBuildUrl(value: string) {
  try {
    const host = new URL(value).hostname.toLowerCase();
    return (
      host === "expo.dev" ||
      host.endsWith(".expo.dev") ||
      host === "u.expo.dev" ||
      host.endsWith(".exp.direct") ||
      host.includes("amazonaws.com") ||
      host.includes("storage.googleapis.com")
    );
  } catch {
    return false;
  }
}

export function DownloadButton({
  slug,
  version,
  directUrl,
  disabled = false,
}: {
  slug: string;
  version?: string | null;
  directUrl?: string | null;
  disabled?: boolean;
}) {
  const [downloading, setDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasDirectUrl = Boolean(directUrl && isSafeHttpUrl(directUrl));
  const buttonClassName =
    "font-mono-label inline-flex min-w-56 items-center justify-center gap-2 rounded-sm bg-[var(--neon-cyan)] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[var(--bg-primary)] shadow-[var(--glow-md)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50";

  async function downloadFromStorage() {
    if (disabled || downloading) return;

    setDownloading(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.functions.invoke<DownloadResponse>(
        "download-apk",
        { body: { slug } },
      );

      if (error) {
        throw error;
      }

      if (!data?.signedUrl) {
        throw new Error(data?.error ?? "The download link could not be generated.");
      }

      window.location.assign(data.signedUrl);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Download failed. Please try again.",
      );
    } finally {
      setDownloading(false);
    }
  }

  const label = disabled
    ? "Release unavailable"
    : downloading
      ? "Preparing link..."
      : `Download${version ? ` v${version}` : " APK"}`;

  return (
    <div>
      {hasDirectUrl && directUrl ? (
        <a
          href={directUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={disabled || undefined}
          className={buttonClassName}
          onClick={(event) => {
            if (disabled) {
              event.preventDefault();
            }
          }}
        >
          <Download className="size-4" />
          {label}
        </a>
      ) : (
        <button
          type="button"
          onClick={downloadFromStorage}
          disabled={disabled || downloading}
          className={buttonClassName}
        >
          {downloading ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <Download className="size-4" />
          )}
          {label}
        </button>
      )}
      {errorMessage ? (
        <p role="alert" className="mt-3 max-w-sm text-sm text-[var(--neon-magenta)]">
          {errorMessage}
        </p>
      ) : (
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          {hasDirectUrl
            ? isExpoBuildUrl(directUrl ?? "")
              ? "Expo / EAS build · opens the install link"
              : "Direct download · opens in your browser"
            : "Free download · secure link expires in 15 minutes"}
        </p>
      )}
    </div>
  );
}
