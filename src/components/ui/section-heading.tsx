import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  index: string;
  label: string;
  aside?: React.ReactNode;
  id?: string;
  className?: string;
};

export function SectionHeading({ index, label, aside, id, className }: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "border-line flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b pb-3",
        className,
      )}
    >
      <h2 id={id} className="scroll-mt-24 font-mono text-[11px] tracking-[0.14em] uppercase">
        <span className="text-ink-faint">{index} /</span>{" "}
        <span className="text-ink font-medium">{label}</span>
      </h2>
      {aside ? (
        <div className="text-ink-faint font-mono text-[10px] tracking-[0.08em] uppercase">
          {aside}
        </div>
      ) : null}
    </div>
  );
}
