import type { MDXComponents } from "mdx/types";
import { mdxComponents } from "@/components/MdxComponents";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...mdxComponents,
    ...components,
  };
}
