"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/#contact" },
] as const;

export function NavLinks({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <ul className={cn("flex items-center gap-7", className)}>
      {links.map((link) => {
        const active =
          link.href === "/work" ? pathname.startsWith("/work") : pathname === link.href;
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "hover:text-signal-text relative py-2 font-sans text-sm transition-colors duration-150",
                active ? "text-ink" : "text-ink-soft",
              )}
            >
              {link.label}
              <span
                aria-hidden="true"
                className={cn(
                  "bg-ink absolute right-0 -bottom-0.5 left-0 h-px origin-left transition-transform duration-150",
                  active ? "scale-x-100" : "scale-x-0",
                )}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
