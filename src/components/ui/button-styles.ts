export type ButtonVariant = "primary" | "secondary" | "text";

/**
 * Shared so a <summary> can present as the same button as a link.
 * Keep the focus and forced-colors behaviour in one place.
 */
export const buttonStyles: Record<ButtonVariant, string> = {
  primary:
    "button-primary bg-ink text-paper hover:bg-signal-text focus-visible:outline-signal-text inline-flex min-h-11 items-center justify-center gap-2.5 px-5 py-3 text-[15px] font-medium transition-colors duration-150 active:translate-y-px",
  secondary:
    "border-ink text-ink hover:bg-ink hover:text-paper inline-flex min-h-11 items-center justify-center gap-2.5 border px-5 py-3 text-[15px] font-medium transition-colors duration-150 active:translate-y-px",
  text: "decoration-line-strong hover:decoration-signal-text inline-flex min-h-11 items-center gap-2 text-[15px] font-medium underline decoration-1 underline-offset-4 transition-colors duration-120",
};
