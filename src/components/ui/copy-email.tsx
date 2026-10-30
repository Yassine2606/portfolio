"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "@/components/ui/icons";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const field = document.createElement("textarea");
      field.value = email;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      document.body.removeChild(field);
    }
    setCopied(true);
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
      <a
        href={`mailto:${email}`}
        className="font-display decoration-line-strong hover:decoration-signal-text text-[clamp(1.0625rem,5.2vw,1.25rem)] font-medium tracking-[-0.02em] break-all underline decoration-1 underline-offset-[6px] transition-colors md:text-2xl"
      >
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="border-line hover:border-ink text-ink-soft rounded-card inline-flex min-h-11 items-center gap-2 border px-3 py-2 font-mono text-[10px] tracking-[0.1em] uppercase transition-colors"
        aria-label={`Copy email address, ${email}`}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
}
