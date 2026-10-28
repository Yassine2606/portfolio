import Link from "next/link";
import { ArrowUpRight, Download } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "text";

const styles: Record<Variant, string> = {
  primary:
    "button-primary bg-ink text-paper hover:bg-signal-text focus-visible:outline-signal-text inline-flex min-h-11 items-center justify-center gap-2.5 px-5 py-3 text-[15px] font-medium transition-colors duration-150 active:translate-y-px",
  secondary:
    "border-ink text-ink hover:bg-ink hover:text-paper inline-flex min-h-11 items-center justify-center gap-2.5 border px-5 py-3 text-[15px] font-medium transition-colors duration-150 active:translate-y-px",
  text: "decoration-line-strong hover:decoration-signal-text inline-flex min-h-11 items-center gap-2 text-[15px] font-medium underline decoration-1 underline-offset-4 transition-colors duration-120",
};

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  download?: boolean;
  external?: boolean;
  icon?: "arrow" | "download" | "external" | "none";
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  download = false,
  external = false,
  icon = "none",
}: ButtonLinkProps) {
  const isExternal = external || href.startsWith("http") || href.startsWith("mailto:");
  const classes = cn(styles[variant], "rounded-card", className);
  const content = (
    <>
      <span>{children}</span>
      {icon === "arrow" ? <ArrowUpRight size={15} /> : null}
      {icon === "external" ? <ArrowUpRight size={15} /> : null}
      {icon === "download" ? <Download size={15} /> : null}
    </>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { rel: "me noreferrer", target: "_blank" } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} download={download || undefined}>
      {content}
    </Link>
  );
}
