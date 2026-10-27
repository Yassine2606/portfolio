import { architecture } from "@/content/architecture";
import { cn } from "@/lib/utils";

type ProjectPlateProps = {
  slug: string;
  index: string;
  className?: string;
  dense?: boolean;
  label?: string;
};

/**
 * The project's system map, drawn with rules and type instead of a screenshot.
 * It is a real diagram of the documented architecture, not decorative art:
 * stages and node names come from the same registry the case study renders.
 */
export function ProjectPlate({ slug, index, className, dense = false, label }: ProjectPlateProps) {
  const doc = architecture[slug];
  if (!doc) return null;

  return (
    <figure
      className={cn(
        "border-line bg-paper-raised relative flex flex-col overflow-hidden border",
        className,
      )}
      aria-label={`${label ?? doc.title} system map`}
    >
      <div className="border-line flex items-center justify-between border-b px-4 py-2.5">
        <span className="text-ink-faint font-mono text-[9px] tracking-[0.14em] uppercase">
          Fig. {index} / System map
        </span>
        <span className="text-ink-faint font-mono text-[9px] tracking-[0.1em] uppercase">
          {doc.stages.length} stages
        </span>
      </div>

      <div className="bg-line grid flex-1 grid-cols-2 gap-px">
        {doc.stages.map((stage) => (
          <div
            key={stage.label}
            className={cn("bg-paper-raised flex min-h-0 flex-col p-4", dense ? "gap-1.5" : "gap-2")}
          >
            <span className="text-ink-faint font-mono text-[8px] leading-none tracking-[0.12em] uppercase">
              {stage.label}
            </span>
            <ul className={cn("flex flex-col", dense ? "gap-1" : "gap-1.5")}>
              {stage.nodes.map((node) => (
                <li key={node.name} className="flex items-start gap-1.5">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-[5px] size-1 shrink-0",
                      node.kind === "model"
                        ? "bg-signal"
                        : node.kind === "store"
                          ? "border-ink-faint border"
                          : "bg-ink-faint",
                    )}
                  />
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "font-display block leading-[1.2] font-medium tracking-[-0.01em]",
                        dense ? "text-[11px]" : "text-[13px]",
                      )}
                    >
                      {node.name}
                    </span>
                    {!dense ? (
                      <span className="text-ink-faint mt-1 block text-[11px] leading-[1.45]">
                        {node.note}
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-line flex items-center justify-between gap-4 border-t px-4 py-2.5">
        <span className="text-ink-faint truncate font-mono text-[9px] tracking-[0.08em] uppercase">
          {doc.trace}
        </span>
        <span aria-hidden="true" className="text-ink-faint font-mono text-[10px]">
          +
        </span>
      </div>
    </figure>
  );
}
