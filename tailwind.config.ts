import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        navy: {
          50: "#f5f7fa",
          100: "#e4e9f0",
          200: "#c0cad6",
          500: "#5a708a",
          700: "#2c3f5e",
          900: "#1a2744",
          950: "#0f1828",
        },
      },
      typography: {
        navy: {
          css: {
            "--tw-prose-body": "#374151",
            "--tw-prose-headings": "#1a2744",
            "--tw-prose-lead": "#5a708a",
            "--tw-prose-links": "#1a2744",
            "--tw-prose-bold": "#1a2744",
            "--tw-prose-counters": "#5a708a",
            "--tw-prose-bullets": "#c0cad6",
            "--tw-prose-hr": "#e4e9f0",
            "--tw-prose-quotes": "#2c3f5e",
            "--tw-prose-quote-borders": "#1a2744",
            "--tw-prose-captions": "#5a708a",
            "--tw-prose-th-borders": "#c0cad6",
            "--tw-prose-td-borders": "#e4e9f0",
            "fontSize": "1.0625rem",
            "lineHeight": "1.7",
            "h1": {
              fontSize: "1.875rem",
              fontWeight: "700",
              letterSpacing: "-0.02em",
              marginTop: "2rem",
              marginBottom: "1rem",
            },
            "h2": {
              fontSize: "1.5rem",
              fontWeight: "600",
              letterSpacing: "-0.01em",
              marginTop: "2rem",
              marginBottom: "0.75rem",
            },
            "h3": {
              fontSize: "1.25rem",
              fontWeight: "600",
              marginTop: "1.5rem",
              marginBottom: "0.5rem",
            },
            "a": {
              color: "#1a2744",
              textDecoration: "underline",
              textDecorationColor: "#c0cad6",
              textUnderlineOffset: "3px",
              fontWeight: "500",
              transition: "text-decoration-color 150ms",
              "&:hover": {
                textDecorationColor: "#1a2744",
              },
            },
            "blockquote": {
              fontStyle: "italic",
              color: "#5a708a",
              borderLeftWidth: "3px",
              borderLeftColor: "#1a2744",
              paddingLeft: "1rem",
            },
            "table": {
              fontSize: "0.875rem",
            },
            "thead th": {
              backgroundColor: "#f5f7fa",
              padding: "0.75rem 1rem",
              fontWeight: "600",
              color: "#1a2744",
              borderBottomWidth: "2px",
              borderBottomColor: "#c0cad6",
            },
            "tbody td": {
              padding: "0.75rem 1rem",
              borderBottomWidth: "1px",
              borderBottomColor: "#e4e9f0",
            },
          },
        },
        lg: {
          css: {
            lineHeight: "1.7",
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
