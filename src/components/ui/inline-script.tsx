/**
 * An inline script that React renders but never re-executes on the client.
 *
 * The server emits a real `text/javascript` script into the HTML (it runs
 * during parse — this is the no-FOUC theme script, so it must run before
 * paint). On the client the type swaps to `text/plain`, so React's
 * reconciler skips it instead of warning that scripts inside components
 * are never executed client-side. The mismatch is expected — hence
 * suppressHydrationWarning.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
