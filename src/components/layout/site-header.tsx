import Link from "next/link";
import { site } from "@/content/site";
import { NavLinks } from "@/components/layout/nav-links";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { ButtonLink } from "@/components/ui/button-link";
import { Status } from "@/components/ui/status";

export function SiteHeader() {
  return (
    <header className="border-line bg-paper sticky top-0 z-40 border-b">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-8 px-5 md:h-[72px] md:px-10">
        <Link
          href="/"
          className="font-display shrink-0 text-[15px] font-medium tracking-[-0.015em]"
        >
          {site.name}
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <nav aria-label="Primary">
            <NavLinks />
          </nav>

          <div className="hidden lg:block">
            <Status />
          </div>

          <ButtonLink
            href={site.resume}
            icon="download"
            download
            className="min-h-10 px-4 py-2 text-sm"
          >
            Resume
          </ButtonLink>
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}
