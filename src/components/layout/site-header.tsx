import Link from "next/link";
import { site } from "@/content/site";
import { NavLinks } from "@/components/layout/nav-links";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { ResumeMenu } from "@/components/ui/resume-menu";
import { Status } from "@/components/ui/status";

export function SiteHeader() {
  return (
    <header className="border-line bg-paper sticky top-0 z-40 border-b">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-8 px-5 md:h-[72px] md:px-10">
        <Link
          href="/"
          className="font-display inline-flex min-h-11 shrink-0 items-center text-[15px] font-medium tracking-[-0.015em]"
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

          <ResumeMenu label="Resume" triggerClassName="min-h-10 px-4 py-2 text-sm" />
        </div>

        <MobileMenu />
      </div>

      <nav aria-label="Primary, no JavaScript" className="nojs-nav border-line border-t">
        <ul className="mx-auto flex max-w-[1440px] flex-wrap gap-x-5 gap-y-1 px-5 py-2 text-sm md:px-10">
          <li>
            <Link href="/work" className="hover:text-signal-text inline-flex min-h-11 items-center">
              Work
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="hover:text-signal-text inline-flex min-h-11 items-center"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/#contact"
              className="hover:text-signal-text inline-flex min-h-11 items-center"
            >
              Contact
            </Link>
          </li>
          <li>
            <a
              href={site.resume}
              download
              className="hover:text-signal-text inline-flex min-h-11 items-center"
            >
              Resume (EN)
            </a>
          </li>
          <li>
            <a
              href={site.resumeFr}
              download
              className="hover:text-signal-text inline-flex min-h-11 items-center"
            >
              CV (FR)
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
