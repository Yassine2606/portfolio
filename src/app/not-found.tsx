import Link from "next/link";
import { site } from "@/content/site";

export default function NotFound() {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-[60vh] max-w-[1440px] flex-col justify-center px-5 py-20 md:px-10"
    >
      <p className="text-ink-faint font-mono text-[10px] tracking-[0.14em] uppercase">404</p>
      <h1 className="font-display mt-5 max-w-3xl text-[clamp(2.75rem,6vw,5rem)] leading-[0.92] font-semibold tracking-[-0.045em]">
        This page is not in the dossier.
      </h1>
      <p className="measure text-ink-soft mt-6 text-[17px]">
        The link may be old, or the case file may still be in the evidence sprint. The work index is
        the shortest way back.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Link
          href="/work"
          className="button-primary rounded-card bg-ink text-paper hover:bg-signal-text inline-flex min-h-11 items-center px-5 py-3 text-sm font-medium transition-colors"
        >
          See the work
        </Link>
        <Link
          href="/"
          className="decoration-line-strong hover:decoration-signal-text inline-flex min-h-11 items-center text-sm font-medium underline decoration-1 underline-offset-4"
        >
          Back home
        </Link>
        <a
          href={site.resume}
          className="decoration-line-strong hover:decoration-signal-text inline-flex min-h-11 items-center text-sm font-medium underline decoration-1 underline-offset-4"
        >
          Resume
        </a>
      </div>
    </main>
  );
}
