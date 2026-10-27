"use client";

import { useEffect } from "react";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Keep the failure local. No stack traces, no third-party reporting at launch.
    console.error("Render error");
  }, []);

  return (
    <main
      id="main"
      className="mx-auto flex min-h-[60vh] max-w-[1440px] flex-col justify-center px-5 py-20 md:px-10"
    >
      <p className="text-ink-faint font-mono text-[10px] tracking-[0.14em] uppercase">Error</p>
      <h1 className="font-display mt-5 max-w-3xl text-[clamp(2.5rem,5vw,4rem)] leading-[0.95] font-semibold tracking-[-0.04em]">
        This page failed to render.
      </h1>
      <p className="text-ink-soft measure mt-5 text-[17px]">
        The rest of the site still works. Try again, or email me if the page keeps failing.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-card bg-ink text-paper hover:bg-signal-text inline-flex min-h-11 items-center px-5 py-3 text-sm font-medium transition-colors"
        >
          Try again
        </button>
        <a
          href="mailto:yassine.ben.romdhanee@gmail.com"
          className="decoration-line-strong hover:decoration-signal-text inline-flex min-h-11 items-center text-sm font-medium underline decoration-1 underline-offset-4"
        >
          Email me
        </a>
      </div>
    </main>
  );
}
