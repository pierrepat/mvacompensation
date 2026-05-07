import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <h1
      className="text-3xl sm:text-4xl font-bold text-gray-900 mt-8 mb-4"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="text-2xl font-semibold text-gray-900 mt-8 mb-3"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="text-xl font-semibold text-gray-900 mt-6 mb-2"
      {...props}
    />
  ),
  p: (props) => (
    <p className="text-gray-700 leading-relaxed mb-4" {...props} />
  ),
  ul: (props) => (
    <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1" {...props} />
  ),
  ol: (props) => (
    <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-1" {...props} />
  ),
  a: ({ href, ...props }) => {
    if (href?.startsWith("/")) {
      return (
        <Link
          href={href}
          className="text-navy-900 underline hover:text-navy-700"
          {...props}
        />
      );
    }
    return (
      <a
        href={href}
        className="text-navy-900 underline hover:text-navy-700"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    );
  },
  blockquote: (props) => (
    <blockquote
      className="border-l-4 border-navy-900 pl-4 italic text-gray-600 my-4"
      {...props}
    />
  ),
  table: (props) => (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full border border-gray-200 text-sm" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="bg-gray-50 px-4 py-2 text-left font-semibold text-gray-900 border-b"
      {...props}
    />
  ),
  td: (props) => (
    <td className="px-4 py-2 border-b border-gray-100" {...props} />
  ),
};
