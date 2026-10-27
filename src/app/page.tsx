const index = [
  {
    number: "01",
    title: "Documents Assistant",
    detail: "Enterprise RAG · Capgemini PFE",
  },
  {
    number: "02",
    title: "Sadine Tours",
    detail: "Full-stack platform · 3 locales",
  },
  {
    number: "03",
    title: "Anomaly Detection Agent",
    detail: "MCP · Tool calling",
  },
  {
    number: "04",
    title: "RFID Access Control",
    detail: "IoT · Realtime decisions",
  },
] as const;

const docGroups = [
  {
    label: "The brief",
    body: "Audience, positioning, the five-second test, and the evidence rule that governs every page.",
  },
  {
    label: "The proof",
    body: "Project selection, case-study depth, screenshot and demo backlog, and the claim-to-source ledger.",
  },
  {
    label: "The build",
    body: "Design system, motion rules, technical architecture, quality gates, and the phased roadmap.",
  },
] as const;

export default function Home() {
  return (
    <div className="min-h-dvh">
      <header className="border-line mx-auto flex max-w-[1440px] items-center justify-between border-b px-5 py-4 md:px-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-medium tracking-[0.18em] uppercase">YBR</span>
          <span aria-hidden="true" className="bg-line-strong h-3 w-px" />
          <span className="text-ink-faint font-mono text-[11px] tracking-[0.08em]">
            Portfolio v2
          </span>
        </div>
        <div className="rounded-pill border-line flex items-center gap-2 border px-3 py-1">
          <span aria-hidden="true" className="bg-status size-1.5 rounded-full" />
          <span className="font-mono text-[10px] tracking-[0.1em] uppercase">In build</span>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-[1440px] px-5 md:px-10">
        <section className="border-line grid gap-14 border-b py-16 md:grid-cols-12 md:gap-8 md:py-24">
          <div className="md:col-span-7">
            <p className="text-ink-faint font-mono text-[11px] tracking-[0.14em] uppercase">
              AI engineer · Monastir, Tunisia · Open to AI roles
            </p>

            <h1 className="font-display mt-8 text-[clamp(3.5rem,7.4vw,7.75rem)] leading-[0.88] font-semibold tracking-[-0.045em]">
              AI systems,
              <br />
              <span className="text-signal-text font-serif font-normal tracking-[-0.02em] italic">
                with the receipts.
              </span>
            </h1>

            <p className="measure text-ink-soft mt-8 text-lg leading-[1.55] md:text-xl">
              A recruiter-facing portfolio in build. Four production systems, documented end to end
              — the problem, the architecture, the tradeoffs, and the proof.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#build"
                className="rounded-card bg-ink text-paper hover:bg-signal-text inline-flex min-h-11 items-center px-5 py-3 text-sm font-medium transition-colors duration-150"
              >
                See what ships
              </a>
              <a
                href="mailto:yassine.ben.romdhanee@gmail.com"
                className="decoration-line-strong hover:decoration-signal-text inline-flex min-h-11 items-center text-sm font-medium underline decoration-1 underline-offset-4 transition-colors duration-150"
              >
                Get in touch
              </a>
            </div>

            <dl className="border-line mt-12 grid max-w-lg grid-cols-2 gap-x-8 gap-y-5 border-t pt-6 text-sm">
              <div>
                <dt className="text-ink-faint font-mono text-[10px] tracking-[0.12em] uppercase">
                  Last shipped
                </dt>
                <dd className="text-ink-soft mt-1.5">Enterprise RAG · Capgemini PFE</dd>
              </div>
              <div>
                <dt className="text-ink-faint font-mono text-[10px] tracking-[0.12em] uppercase">
                  Focus
                </dt>
                <dd className="text-ink-soft mt-1.5">RAG, agents, reliability</dd>
              </div>
            </dl>
          </div>

          <aside className="md:col-span-5 md:pl-8">
            <div className="border-line flex items-baseline justify-between border-b pb-3">
              <h2 className="text-ink-faint font-mono text-[10px] tracking-[0.14em] uppercase">
                Index / selected systems
              </h2>
              <span className="text-ink-faint font-mono text-[10px]">2025–26</span>
            </div>

            <ol>
              {index.map((item) => (
                <li key={item.number} className="border-line border-b py-4">
                  <div className="flex items-baseline gap-4">
                    <span className="text-ink-faint font-mono text-[11px]">{item.number}</span>
                    <div className="min-w-0">
                      <p className="font-display text-lg leading-tight font-medium tracking-[-0.015em]">
                        {item.title}
                      </p>
                      <p className="text-ink-faint mt-1 font-mono text-[10px] tracking-[0.06em] uppercase">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <p className="text-ink-faint mt-4 font-mono text-[10px] tracking-[0.08em] uppercase">
              Case studies in build — docs first
            </p>
          </aside>
        </section>

        <section
          id="build"
          className="border-line grid gap-10 border-b py-16 md:grid-cols-12 md:py-24"
        >
          <div className="md:col-span-4">
            <p className="text-ink-faint font-mono text-[10px] tracking-[0.14em] uppercase">
              01 / The plan
            </p>
            <h2 className="font-display mt-5 text-4xl leading-[0.95] font-semibold tracking-[-0.035em] md:text-5xl">
              Docs first.
              <br />
              Then the build.
            </h2>
          </div>

          <div className="md:col-span-8">
            <p className="measure text-ink-soft text-lg leading-[1.55]">
              This repo is the new portfolio, built in public. The work starts with a written brief,
              an evidence standard, and a quality bar — so the site is a hiring argument, not a
              gallery.
            </p>

            <dl className="border-line bg-line mt-10 grid gap-px border sm:grid-cols-3">
              {docGroups.map((group, i) => (
                <div key={group.label} className="bg-paper p-5">
                  <dt className="text-ink-faint font-mono text-[10px] tracking-[0.12em] uppercase">
                    {String(i + 1).padStart(2, "0")} / {group.label}
                  </dt>
                  <dd className="text-ink-soft mt-3 text-sm leading-relaxed">{group.body}</dd>
                </div>
              ))}
            </dl>

            <p className="text-ink-faint mt-5 font-mono text-[10px] tracking-[0.08em] uppercase">
              15 documents in /docs · locked Oct 2026
            </p>
          </div>
        </section>

        <section className="border-line grid gap-10 border-b py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-4">
            <p className="text-ink-faint font-mono text-[10px] tracking-[0.14em] uppercase">
              02 / Signature
            </p>
            <h2 className="font-display mt-5 text-4xl leading-[0.95] font-semibold tracking-[-0.035em] md:text-5xl">
              Claims carry
              <br />
              their sources.
            </h2>
          </div>

          <div className="md:col-span-8 md:grid md:grid-cols-8 md:gap-8">
            <p className="measure text-ink-soft text-lg leading-[1.6] md:col-span-6">
              The defining detail of this portfolio is the evidence margin: every claim that can be
              checked gets a marker, and the source sits beside it — a repo path, a benchmark, a
              screenshot, or a note that says what is private.
              <sup className="ml-1">
                <a
                  href="#evidence-1"
                  className="text-signal-text font-mono text-[11px] no-underline hover:underline"
                  aria-label="Evidence 1: content strategy"
                >
                  [1]
                </a>
              </sup>{" "}
              Nothing is asserted because it sounds good.
            </p>

            <aside
              id="evidence-1"
              className="border-signal-text text-ink-faint mt-6 border-l pl-4 text-sm leading-relaxed md:col-span-2 md:mt-1"
            >
              <span className="text-signal-text font-mono text-[10px]">[1]</span> The rule is
              defined in <span className="font-mono text-[11px]">03-content-strategy.md</span> and
              enforced in the launch checklist.
            </aside>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-[1440px] px-5 py-10 md:px-10">
        <div className="border-line flex flex-col gap-6 border-t pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-lg font-medium tracking-[-0.015em]">
              Yassine Ben Romdhane
            </p>
            <p className="text-ink-faint mt-1 font-mono text-[10px] tracking-[0.08em] uppercase">
              AI engineer · Monastir, Tunisia · Remote-friendly
            </p>
          </div>
          <nav aria-label="Contact" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <a
              href="mailto:yassine.ben.romdhanee@gmail.com"
              className="decoration-line-strong hover:decoration-signal-text underline underline-offset-4"
            >
              Email
            </a>
            <a
              href="https://github.com/Yassine2606"
              className="decoration-line-strong hover:decoration-signal-text underline underline-offset-4"
              rel="me noreferrer"
            >
              GitHub
            </a>
            <a
              href="/resume.pdf"
              className="decoration-line-strong hover:decoration-signal-text underline underline-offset-4"
            >
              Resume
            </a>
          </nav>
        </div>
        <p className="text-ink-faint mt-8 font-mono text-[10px] tracking-[0.06em]">
          Portfolio v2 · Docs locked 27 Oct 2026 · Next build: evidence sprint
        </p>
      </footer>
    </div>
  );
}
