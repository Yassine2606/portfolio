import { site } from "@/content/site";
import { cn } from "@/lib/utils";

export function Status({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "border-line rounded-pill inline-flex items-center gap-2 border px-3 py-1",
        className,
      )}
    >
      <span aria-hidden="true" className="bg-status size-1.5 rounded-full" />
      <span className="text-status font-mono text-[10px] leading-none tracking-[0.1em] uppercase">
        {site.availability.label}
      </span>
    </span>
  );
}

export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "border-line rounded-card text-ink-faint inline-flex h-6 items-center border px-2 font-mono text-[10px] leading-none tracking-[0.08em] uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}
