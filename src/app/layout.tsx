import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MVA Compensation",
  description:
    "Motor vehicle accident compensation information and free case evaluation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
