import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-dvh max-w-[1440px] flex-col justify-center px-5 py-20 md:px-10"
    >
      <p className="text-ink-faint font-mono text-[10px] tracking-[0.14em] uppercase">404</p>
      <h1 className="font-display mt-5 max-w-3xl text-5xl leading-[0.95] font-semibold tracking-[-0.04em] md:text-7xl">
        This page is not in the dossier.
      </h1>
      <p className="measure text-ink-soft mt-6 text-lg">
        The link may be old, or the case study may still be in the evidence sprint.
      </p>
      <Link
        href="/"
        className="rounded-card bg-ink text-paper hover:bg-signal-text mt-8 inline-flex min-h-11 w-fit items-center px-5 py-3 text-sm font-medium transition-colors"
      >
        Back to the index
      </Link>
    </main>
  );
}
