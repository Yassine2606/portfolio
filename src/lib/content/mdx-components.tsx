import type { MDXComponents } from "mdx/types";
import { Claim } from "@/components/evidence/claim";
import { ArchitectureView } from "@/components/work/architecture-view";

export const mdxComponents: MDXComponents = {
  Claim,
  Architecture: ArchitectureView,
  h2: (props) => <h2 {...props} />,
  h3: (props) => <h3 {...props} />,
  table: (props) => (
    <div className="prose-table-wrap" role="group" aria-label="Data table" tabIndex={0}>
      <table {...props} />
    </div>
  ),
};
