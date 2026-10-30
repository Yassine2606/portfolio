import Link from "next/link";
import { ArrowUpRight, Download } from "@/components/ui/icons";
import { buttonStyles, type ButtonVariant } from "@/components/ui/button-styles";
import { cn } from "@/lib/utils";

type Variant = ButtonVariant;

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
  const classes = cn(buttonStyles[variant], "rounded-card", className);
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
