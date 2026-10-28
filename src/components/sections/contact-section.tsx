import { site } from "@/content/site";
import { CopyEmail } from "@/components/ui/copy-email";
import { ArrowUpRight, Download } from "@/components/ui/icons";

const links = [
  { label: "GitHub", href: site.github, external: true },
  { label: "Resume — English (PDF)", href: site.resume, external: false },
  { label: "CV — Français (PDF)", href: site.resumeFr, external: false },
];

export function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-24">
      <div className="border-line grid gap-10 border-t py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-7">
          <p className="text-ink-faint font-mono text-[10px] tracking-[0.14em] uppercase">
            Contact / one conversation
          </p>
          <h2
            id="contact-title"
            className="font-display mt-5 text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] font-semibold tracking-[-0.035em]"
          >
            Let&rsquo;s build something
            <br />
            <span className="text-signal-text font-serif font-normal italic">
              that survives production.
            </span>
          </h2>
          <p className="text-ink-soft mt-6 max-w-[52ch] text-[17px] leading-[1.6]">
            I&rsquo;m available immediately for AI engineering roles (remote, hybrid, or on-site),
            with no notice period. I&rsquo;m based in {site.location} ({site.timezone}), and open to
            relocation. Roles outside Tunisia would require visa sponsorship. The fastest way to
            start is email — I read everything, and I answer with specifics.
          </p>
          <div className="mt-8">
            <CopyEmail email={site.email} />
          </div>
        </div>

        <div className="md:col-span-4 md:col-start-9 md:self-end">
          <ul className="border-line border-t">
            {links.map((link) => (
              <li key={link.label} className="border-line border-b">
                <a
                  href={link.href}
                  {...(link.external ? { rel: "me noreferrer", target: "_blank" } : {})}
                  className="group text-ink-soft hover:text-ink flex min-h-12 items-center justify-between gap-4 py-3 text-sm transition-colors"
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className="text-ink-faint transition-transform duration-200 group-hover:translate-x-1"
                  >
                    {link.external ? <ArrowUpRight size={15} /> : <Download size={15} />}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="text-ink-faint mt-4 font-mono text-[10px] leading-relaxed tracking-[0.06em] uppercase">
            ATS-friendly:{" "}
            <a
              href={site.resumeAts}
              aria-label="Download ATS-friendly English resume (PDF)"
              className="hover:text-ink decoration-line-strong underline decoration-1 underline-offset-4"
            >
              English
            </a>{" "}
            ·{" "}
            <a
              href={site.resumeFrAts}
              aria-label="Download ATS-friendly French CV (PDF)"
              className="hover:text-ink decoration-line-strong underline decoration-1 underline-offset-4"
            >
              Français
            </a>
          </p>
          <p className="text-ink-faint mt-1 font-mono text-[10px] leading-relaxed tracking-[0.06em] uppercase">
            No contact form. No tracking pixels. Just a mailbox.
          </p>
        </div>
      </div>
    </section>
  );
}
