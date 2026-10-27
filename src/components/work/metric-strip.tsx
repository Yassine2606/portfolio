import type { Metric } from "@/lib/content/schema";
import { cn } from "@/lib/utils";

const kindLabel: Record<Metric["kind"], string> = {
  measured: "Measured",
  artifact: "Artifact",
  scope: "Scope",
};

const kindStyle: Record<Metric["kind"], string> = {
  measured: "border-signal-text text-signal-text",
  artifact: "border-line-strong text-ink-soft",
  scope: "border-line text-ink-faint",
};

export function MetricStrip({ metrics }: { metrics: Metric[] }) {
  if (metrics.length === 0) return null;

  return (
    <section aria-label="Key facts" className="no-print">
      <div className="border-line bg-line grid gap-px border-y sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-paper flex flex-col p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-ink-faint font-mono text-[9px] tracking-[0.12em] uppercase">
                {metric.label}
              </span>
              <span
                className={cn(
                  "rounded-card shrink-0 border px-1.5 py-0.5 font-mono text-[8px] tracking-[0.1em] uppercase",
                  kindStyle[metric.kind],
                )}
              >
                {kindLabel[metric.kind]}
              </span>
            </div>
            <span className="font-display mt-3 text-[clamp(1.75rem,2.6vw,2.25rem)] leading-none font-medium tracking-[-0.03em]">
              {metric.value}
            </span>
            <span className="text-ink-faint mt-3 text-[11px] leading-snug">
              {metric.href ? (
                <a
                  href={metric.href}
                  className="decoration-line-strong hover:decoration-signal-text underline decoration-1 underline-offset-2"
                  target="_blank"
                  rel="noreferrer"
                >
                  {metric.source} ↗
                </a>
              ) : (
                metric.source
              )}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
