import Link from "next/link";
import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-[1440px] px-5 pb-10 md:px-10">
      <div className="border-line grid gap-8 border-t pt-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-display text-lg font-medium tracking-[-0.015em]">{site.name}</p>
          <p className="text-ink-faint mt-1 font-mono text-[10px] tracking-[0.08em] uppercase">
            AI engineer · {site.location} · {site.timezone}
          </p>
          <p className="text-status mt-3 font-mono text-[10px] tracking-[0.08em] uppercase">
            ● {site.availability.label}
          </p>
        </div>

        <nav aria-label="Footer" className="md:col-span-4">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <li>
              <a
                href={`mailto:${site.email}`}
                className="text-ink-soft hover:text-signal-text decoration-line-strong underline decoration-1 underline-offset-4 transition-colors"
              >
                Email
              </a>
            </li>
            <li>
              <a
                href={site.github}
                rel="me noreferrer"
                target="_blank"
                className="text-ink-soft hover:text-signal-text decoration-line-strong underline decoration-1 underline-offset-4 transition-colors"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href={site.resume}
                className="text-ink-soft hover:text-signal-text decoration-line-strong underline decoration-1 underline-offset-4 transition-colors"
              >
                Resume (EN)
              </a>
            </li>
            <li>
              <a
                href={site.resumeFr}
                className="text-ink-soft hover:text-signal-text decoration-line-strong underline decoration-1 underline-offset-4 transition-colors"
              >
                CV (FR)
              </a>
            </li>
            <li>
              <Link
                href="/work"
                className="text-ink-soft hover:text-signal-text decoration-line-strong underline decoration-1 underline-offset-4 transition-colors"
              >
                Work
              </Link>
            </li>
          </ul>
          <p className="text-ink-faint mt-4 max-w-[36ch] text-[11px] leading-relaxed">
            Case-study claims are traced to a source or labelled as an artifact. Private work stays
            private. Where a number is missing, the page says so.
          </p>
        </nav>

        <div className="md:col-span-3 md:text-right">
          <p className="text-ink-faint font-mono text-[10px] leading-relaxed tracking-[0.06em] uppercase">
            Set in Bricolage Grotesque,
            <br />
            Instrument Sans, JetBrains Mono.
          </p>
          <p className="text-ink-faint mt-2 font-mono text-[10px] tracking-[0.06em] uppercase">
            Last updated {site.lastUpdated}
          </p>
        </div>
      </div>
    </footer>
  );
}
