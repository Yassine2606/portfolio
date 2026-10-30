import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

type ClaimProps = {
  id: string;
  /** Passed as a string from MDX: next-mdx-remote strips JSX expressions. */
  n?: number | string;
  source: string;
  kind: "repo" | "deploy" | "screenshot" | "benchmark" | "doc" | "commit";
  note?: string;
  href?: string;
  isPrivate?: boolean;
  children: ReactNode;
};

function evidenceNumber(n: number | string | undefined, id: string): number {
  const fromProp = typeof n === "number" ? n : Number.parseInt(String(n ?? ""), 10);
  if (Number.isFinite(fromProp) && fromProp > 0) return fromProp;
  const fromId = Number.parseInt(id.replace(/\D/g, ""), 10);
  return Number.isFinite(fromId) && fromId > 0 ? fromId : 1;
}

/**
 * MDX wraps claim text in a paragraph. Append the marker inside that paragraph
 * instead of nesting a second <p>, which pushes the marker onto its own line.
 */
function ClaimBody({ children, marker }: { children: ReactNode; marker: ReactNode }) {
  const nodes = Children.toArray(children);
  const last = nodes[nodes.length - 1];

  if (isValidElement(last) && last.type === "p") {
    const paragraph = last as ReactElement<{ children?: ReactNode }>;
    return (
      <>
        {nodes.slice(0, -1)}
        {cloneElement(paragraph, {}, paragraph.props.children, marker)}
      </>
    );
  }

  return (
    <p>
      {children}
      {marker}
    </p>
  );
}

/**
 * A claim and its source, rendered together. The note is always in the DOM and
 * in reading order; on wide screens it sits in the margin to the right.
 */
export function Claim({
  id,
  n,
  source,
  kind,
  note,
  href,
  isPrivate = false,
  children,
}: ClaimProps) {
  const number = evidenceNumber(n, id);
  const padded = String(number).padStart(2, "0");
  const marker = (
    <sup className="evidence-ref">
      <a href={`#${id}`} id={`${id}-ref`} aria-label={`Evidence ${number}: ${source}`}>
        [{number}]
      </a>
    </sup>
  );

  return (
    <div className="claim">
      <div className="claim__body">
        <ClaimBody marker={marker}>{children}</ClaimBody>
      </div>

      <aside id={id} className="claim__note" aria-label={`Evidence ${number}: ${source}`}>
        <span className="claim__label">
          Evidence {padded} / {kind}
          {isPrivate ? " · private" : ""}
        </span>
        <span className="claim__source">{source}</span>
        {note ? <span className="mt-1 block">{note}</span> : null}
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="decoration-line-strong hover:decoration-signal-text mt-1 inline-block underline decoration-1 underline-offset-2"
          >
            View source ↗
          </a>
        ) : null}
        <a
          href={`#${id}-ref`}
          className="text-ink-faint hover:text-signal-text ml-1 inline-block no-underline"
          aria-label={`Back to claim ${number}`}
        >
          ↩
        </a>
      </aside>
    </div>
  );
}
