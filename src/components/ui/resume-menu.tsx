"use client";

import { useEffect, useRef } from "react";
import { resumeVersions } from "@/content/site";
import { buttonStyles, type ButtonVariant } from "@/components/ui/button-styles";
import { ChevronDown, Download } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type ResumeMenuProps = {
  label: string;
  variant?: ButtonVariant;
  align?: "start" | "end";
  /**
   * "trigger" anchors the panel to the summary (header).
   * "row" anchors it to the nearest positioned parent (hero CTA row), so the
   * panel starts at the page margin instead of slicing a column mid-word.
   */
  anchor?: "trigger" | "row";
  className?: string;
  triggerClassName?: string;
};

/**
 * A native <details> disclosure, not a modal and not a role="menu".
 * The content is four ordinary download links, so the disclosure pattern
 * keeps Tab order and screen-reader semantics intact — and it still works
 * with JavaScript disabled. The island only adds Escape and click-outside.
 */
export function ResumeMenu({
  label,
  variant = "primary",
  align = "end",
  anchor = "trigger",
  className,
  triggerClassName,
}: ResumeMenuProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const details = detailsRef.current;
    if (!details) return;

    function onPointerDown(event: PointerEvent) {
      if (details?.open && event.target instanceof Node && !details.contains(event.target)) {
        details.open = false;
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || !details?.open) return;
      event.preventDefault();
      details.open = false;
      summaryRef.current?.focus();
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function close() {
    if (detailsRef.current) detailsRef.current.open = false;
  }

  return (
    <details
      ref={detailsRef}
      className={cn("resume-menu", anchor === "trigger" && "relative", className)}
    >
      <summary
        ref={summaryRef}
        className={cn(
          buttonStyles[variant],
          "resume-summary rounded-card cursor-pointer select-none",
          triggerClassName,
        )}
      >
        <span>{label}</span>
        <Download size={15} />
        <ChevronDown size={12} className="resume-chevron" />
      </summary>

      <div
        className={cn(
          "resume-panel border-line bg-paper-raised rounded-card absolute top-[calc(100%+10px)] z-50 w-[22rem] max-w-[calc(100vw-2.5rem)] overflow-hidden border",
          align === "end" ? "right-0" : "left-0",
        )}
      >
        <div className="bg-ink text-paper flex items-center justify-between gap-4 px-4 py-2.5">
          <span className="font-mono text-[9px] tracking-[0.16em] uppercase">
            Resume / 04 files
          </span>
          <span className="text-paper/60 font-mono text-[9px] tracking-[0.12em] uppercase">
            PDF
          </span>
        </div>

        <ul>
          {resumeVersions.map((version, index) => (
            <li key={version.href} className="border-line border-b last:border-b-0">
              <a
                href={version.href}
                download={version.filename}
                onClick={close}
                className="resume-option flex min-h-14 items-center gap-3 px-4 py-2.5"
              >
                <span className="resume-option-muted text-ink-faint w-5 shrink-0 font-mono text-[10px] tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] leading-tight font-medium tracking-[-0.01em]">
                    {version.language}
                    <span className="resume-option-muted text-ink-faint mx-1.5 font-normal">·</span>
                    {version.format}
                  </span>
                  <span className="resume-option-muted text-ink-faint mt-1 block text-[11px] leading-tight">
                    {version.note}
                  </span>
                </span>
                <Download size={14} className="resume-option-icon text-ink-faint shrink-0" />
                <span className="sr-only">— download PDF</span>
              </a>
            </li>
          ))}
        </ul>

        <p className="border-line bg-paper text-ink-faint border-t px-4 py-2.5 font-mono text-[9px] tracking-[0.08em] uppercase">
          One page each · Updated October 2026
        </p>
      </div>
    </details>
  );
}
