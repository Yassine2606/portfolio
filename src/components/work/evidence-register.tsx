import type { Evidence } from "@/lib/content/schema";

const kindLabel: Record<Evidence["kind"], string> = {
  repo: "Repository",
  deploy: "Deployment",
  screenshot: "Screenshot",
  benchmark: "Benchmark",
  doc: "Document",
  commit: "Commit",
};

export function EvidenceRegister({ evidence }: { evidence: Evidence[] }) {
  return (
    <section aria-labelledby="register-title" className="border-line mt-16 border-t pt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2
          id="register-title"
          className="text-ink-faint font-mono text-[10px] tracking-[0.12em] uppercase"
        >
          Evidence register
        </h2>
        <span className="text-ink-faint font-mono text-[9px] tracking-[0.08em] uppercase">
          {evidence.length} sources · checked {evidence[0]?.verifiedAt}
        </span>
      </div>

      <ol className="mt-4 flex flex-col">
        {evidence.map((item, index) => (
          <li
            key={item.id}
            className="border-line grid gap-1 border-t py-3 sm:grid-cols-12 sm:gap-4"
          >
            <span className="text-ink-faint font-mono text-[10px] sm:col-span-1">
              [{index + 1}]
            </span>
            <span className="text-ink-soft text-sm leading-snug sm:col-span-6">{item.claim}</span>
            <span className="text-ink-faint font-mono text-[10px] leading-relaxed break-words sm:col-span-4">
              {item.source}
            </span>
            <span className="text-ink-faint font-mono text-[9px] tracking-[0.08em] uppercase sm:col-span-1 sm:text-right">
              {item.private ? "Private" : kindLabel[item.kind]}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
