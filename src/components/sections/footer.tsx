"use client";

import { ArrowUpRight, EnvelopeSimple, FileText, GithubLogo } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import type { SiteContent } from "@/lib/content/schema";

interface FooterProps {
  site: SiteContent;
}

/** Contact link glyph — keyed by the link label in site.json. */
const LINK_ICONS: Record<string, Icon> = {
  GitHub: GithubLogo,
  Email: EnvelopeSimple,
  Resume: FileText,
};

export function Footer({ site }: FooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-8">
        <p className="font-mono text-xs text-muted-faint">
          © {year} {site.name}
        </p>
        <div className="flex items-center gap-5">
          {site.contact.links
            .filter((link) => link.href !== null)
            .map((link) => {
              const LinkIcon = LINK_ICONS[link.label] ?? ArrowUpRight;
              return (
                <a
                  key={link.label}
                  href={link.href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-foreground"
                >
                  <LinkIcon size={14} />
                  {link.label}
                </a>
              );
            })}
        </div>
        <p className="font-mono text-xs text-muted-faint">Built with Next.js + Motion</p>
      </div>
    </footer>
  );
}
