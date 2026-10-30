import { architecture, type NodeKind } from "@/content/architecture";

const kindLabel: Record<NodeKind, string> = {
  client: "Client",
  service: "Service",
  store: "Store",
  model: "Model",
  edge: "Edge",
  queue: "Queue",
};

export function ArchitectureView({ project }: { project: string }) {
  const doc = architecture[project];
  if (!doc) return null;

  return (
    <div className="my-8">
      <p className="text-ink-soft max-w-[62ch] text-[15px] leading-[1.6]">{doc.summary}</p>

      <div className="border-line bg-line mt-6 grid gap-px border md:grid-cols-2">
        {doc.stages.map((stage) => (
          <div key={stage.label} className="bg-paper-raised flex flex-col p-5">
            <span className="text-ink-faint font-mono text-[9px] tracking-[0.14em] uppercase">
              {stage.label}
            </span>
            <ul className="mt-3 flex flex-col gap-3">
              {stage.nodes.map((node) => (
                <li key={node.name}>
                  <div className="flex items-baseline gap-2">
                    <span
                      aria-hidden="true"
                      className="bg-signal size-1 shrink-0 translate-y-[-2px]"
                    />
                    <span className="font-display text-[15px] leading-tight font-medium tracking-[-0.01em]">
                      {node.name}
                    </span>
                    <span className="text-ink-faint font-mono text-[8px] tracking-[0.1em] uppercase">
                      {kindLabel[node.kind]}
                    </span>
                  </div>
                  <p className="text-ink-faint mt-1 pl-3 text-[12px] leading-[1.5]">{node.note}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <details className="border-line group mt-0 border border-t-0">
        <summary className="text-ink-soft flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 font-mono text-[10px] tracking-[0.1em] uppercase">
          Read the flow as text
          <span aria-hidden="true" className="text-ink-faint group-open:hidden">
            +
          </span>
          <span aria-hidden="true" className="text-ink-faint hidden group-open:inline">
            −
          </span>
        </summary>
        <ol className="border-line mx-5 mb-5 flex list-decimal flex-col gap-2 border-t pt-4 pl-4">
          {doc.flow.map((step) => (
            <li key={step} className="text-ink-soft text-[13px] leading-[1.55]">
              {step}
            </li>
          ))}
        </ol>
      </details>

      {doc.caveat ? (
        <p className="border-signal-text text-ink-faint mt-4 border-l-2 pl-3 text-[12px] leading-relaxed">
          <span className="text-signal-text font-mono text-[9px] tracking-[0.1em] uppercase">
            Boundary /{" "}
          </span>
          {doc.caveat}
        </p>
      ) : null}
    </div>
  );
}
