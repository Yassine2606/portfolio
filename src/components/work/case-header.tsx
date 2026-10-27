import Link from "next/link";
import type { WorkEntry } from "@/lib/content/load";
import { confidentialityLabels, statusLabels } from "@/lib/utils";
import { ArrowRight } from "@/components/ui/icons";

export function CaseHeader({
  work,
  index,
  total,
}: {
  work: WorkEntry;
  index: number;
  total: number;
}) {
  const { frontmatter: fm } = work;
  const roleValue = `${fm.role} · ${fm.year}`;
  const confidentiality = confidentialityLabels[fm.confidentiality];

  return (
    <header className="border-line border-b pt-8 pb-10 md:pb-14">
      <nav
        aria-label="Breadcrumb"
        className="text-ink-faint font-mono text-[9px] tracking-[0.1em] uppercase"
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-signal-text transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/work" className="hover:text-signal-text transition-colors">
              Work
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink-soft">
            {fm.title}
          </li>
        </ol>
      </nav>

      <div className="mt-10 grid gap-8 md:grid-cols-12">
        <div className="md:col-span-8">
          <p className="text-ink-faint font-mono text-[10px] tracking-[0.14em] uppercase">
            Case file {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} ·{" "}
            {confidentiality}
          </p>
          <h1 className="font-display mt-4 text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.9] font-semibold tracking-[-0.045em]">
            {fm.title}
          </h1>
          <p className="text-ink-soft mt-5 max-w-[38ch] text-[clamp(1.125rem,1.8vw,1.5rem)] leading-[1.35]">
            {fm.tagline}
          </p>
        </div>

        <div className="md:col-span-4 md:self-end">
          <p className="text-ink-soft text-[15px] leading-[1.6]">{fm.summary}</p>
          {fm.links.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {fm.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="decoration-line-strong hover:decoration-signal-text inline-flex min-h-11 items-center gap-1.5 text-sm font-medium underline decoration-1 underline-offset-4 transition-colors"
                  >
                    {link.label}
                    <ArrowRight size={14} />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-ink-faint mt-4 font-mono text-[9px] tracking-[0.08em] uppercase">
              No public repository · details labelled private
            </p>
          )}
        </div>
      </div>

      <dl className="border-line mt-10 grid border-y sm:grid-cols-2 lg:grid-cols-4">
        <div className="border-line border-b py-4 sm:border-r sm:pr-5 lg:border-b-0">
          <dt className="text-ink-faint font-mono text-[9px] tracking-[0.12em] uppercase">
            Problem
          </dt>
          <dd className="text-ink-soft mt-2 text-sm leading-snug">{fm.contract.problem}</dd>
        </div>
        <div className="border-line py-4 sm:border-b sm:pl-5 lg:border-r lg:border-b-0 lg:pr-5">
          <dt className="text-ink-faint font-mono text-[9px] tracking-[0.12em] uppercase">Role</dt>
          <dd className="text-ink-soft mt-2 text-sm leading-snug">{roleValue}</dd>
        </div>
        <div className="border-line border-t border-b py-4 sm:border-t-0 lg:border-t-0 lg:border-r lg:border-b-0 lg:pr-5 lg:pl-5">
          <dt className="text-ink-faint font-mono text-[9px] tracking-[0.12em] uppercase">
            Constraint
          </dt>
          <dd className="text-ink-soft mt-2 text-sm leading-snug">{fm.contract.constraint}</dd>
        </div>
        <div className="py-4 lg:pl-5">
          <dt className="text-ink-faint font-mono text-[9px] tracking-[0.12em] uppercase">Proof</dt>
          <dd className="text-ink-soft mt-2 text-sm leading-snug">{fm.contract.proof}</dd>
        </div>
      </dl>

      <p className="text-ink-faint mt-4 font-mono text-[9px] tracking-[0.08em] uppercase">
        {statusLabels[fm.status]} · {fm.duration ?? "Solo build"} · {confidentiality}
      </p>
    </header>
  );
}
