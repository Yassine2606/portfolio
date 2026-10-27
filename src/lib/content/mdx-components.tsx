import type { MDXComponents } from "mdx/types";
import { Claim } from "@/components/evidence/claim";
import { ArchitectureView } from "@/components/work/architecture-view";

export const mdxComponents: MDXComponents = {
  Claim,
  Architecture: ArchitectureView,
  h2: (props) => <h2 {...props} />,
  h3: (props) => <h3 {...props} />,
};
