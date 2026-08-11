interface SectionHeadingProps {
  id?: string;
  eyebrow: string;
  title: string;
  intro?: string;
}

export function SectionHeading({ id, eyebrow, title, intro }: SectionHeadingProps) {
  return (
    <div id={id} className="scroll-mt-24">
      <p className="mb-3 font-mono text-sm tracking-tight text-accent">{eyebrow}</p>
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {intro && (
        <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
          {intro}
        </p>
      )}
    </div>
  );
}
