import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/button-link";

export function Hero() {
  return (
    <section className="border-line grid gap-12 border-b py-14 md:grid-cols-12 md:gap-8 md:py-24">
      <div className="md:col-span-8">
        <p
          className="hero-rise text-ink-faint font-mono text-[10px] tracking-[0.14em] uppercase"
          style={{ animationDelay: "0ms" }}
        >
          AI engineer · {site.location} · {site.timezone}
        </p>

        <h1 className="font-display mt-7 text-[clamp(3.25rem,7.6vw,7.5rem)] leading-[0.88] font-semibold tracking-[-0.045em]">
          <span className="hero-line block">
            <span className="hero-line-inner block">AI systems,</span>
          </span>
          <span className="hero-line block">
            <span className="hero-line-inner text-signal-text block font-serif font-normal tracking-[-0.02em] italic">
              with the receipts.
            </span>
          </span>
        </h1>

        <p
          className="hero-rise text-ink-soft measure mt-7 text-[17px] leading-[1.55] md:text-[19px]"
          style={{ animationDelay: "220ms" }}
        >
          I own the whole path: retrieval, backend, interface, and the reliability work that keeps
          the answer honest.
        </p>

        <div
          className="hero-rise mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"
          style={{ animationDelay: "300ms" }}
        >
          <ButtonLink href="#index" icon="arrow">
            Read the case files
          </ButtonLink>
          <ButtonLink href={site.resume} variant="text" icon="download" download>
            Download CV
          </ButtonLink>
        </div>

        <dl
          className="hero-rise border-line mt-12 grid max-w-xl grid-cols-2 gap-x-8 gap-y-5 border-t pt-5 sm:grid-cols-3"
          style={{ animationDelay: "360ms" }}
        >
          <div>
            <dt className="text-ink-faint font-mono text-[9px] tracking-[0.12em] uppercase">
              Systems
            </dt>
            <dd className="text-ink-soft mt-1 text-sm">4 documented</dd>
          </div>
          <div>
            <dt className="text-ink-faint font-mono text-[9px] tracking-[0.12em] uppercase">
              Focus
            </dt>
            <dd className="text-ink-soft mt-1 text-sm">{site.focus}</dd>
          </div>
          <div>
            <dt className="text-ink-faint font-mono text-[9px] tracking-[0.12em] uppercase">
              Availability
            </dt>
            <dd className="text-status mt-1 text-sm">{site.availability.label}</dd>
          </div>
        </dl>
      </div>

      <aside className="md:col-span-4 md:pl-8">
        <div className="border-line bg-paper-raised rounded-card border">
          <div className="border-line flex items-center justify-between border-b px-4 py-3">
            <span className="text-ink-faint font-mono text-[9px] tracking-[0.14em] uppercase">
              Availability / note
            </span>
            <span aria-hidden="true" className="text-ink-faint font-mono text-[10px]">
              +
            </span>
          </div>

          <dl className="divide-line divide-y px-4">
            <div className="py-4">
              <dt className="text-ink-faint font-mono text-[9px] tracking-[0.12em] uppercase">
                Status
              </dt>
              <dd className="text-status mt-2 font-mono text-[11px] tracking-[0.08em] uppercase">
                ● {site.availability.label}
              </dd>
              <dd className="text-ink-soft mt-1 text-sm">{site.availability.detail}</dd>
            </div>
            <div className="py-4">
              <dt className="text-ink-faint font-mono text-[9px] tracking-[0.12em] uppercase">
                Work mode
              </dt>
              <dd className="text-ink-soft mt-2 text-sm">{site.availability.workModes}</dd>
              <dd className="text-ink-soft mt-1 text-sm">{site.availability.relocation}</dd>
            </div>
            <div className="py-4">
              <dt className="text-ink-faint font-mono text-[9px] tracking-[0.12em] uppercase">
                Last shipped
              </dt>
              <dd className="text-ink-soft mt-2 text-sm">{site.lastShipped}</dd>
            </div>
            <div className="py-4">
              <dt className="text-ink-faint font-mono text-[9px] tracking-[0.12em] uppercase">
                Looking for
              </dt>
              <dd className="text-ink-soft mt-2 text-sm">
                AI engineering roles where the model is one part of the product.
              </dd>
            </div>
          </dl>

          <p className="border-line text-ink-faint border-t px-4 py-3 font-mono text-[9px] leading-relaxed tracking-[0.06em] uppercase">
            Work documented end to end. Private systems are labelled; nothing is invented to fill
            the grid.
          </p>
        </div>
      </aside>
    </section>
  );
}
