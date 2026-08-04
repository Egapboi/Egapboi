import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sunil Kumar Sahu | Portfolio",
  description:
    "Portfolio of Sunil Kumar Sahu — EnC Student at VIT-AP, Software & Hardware Enthusiast. Specializing in Python, C++, Qt, React, and Linux.",
  keywords: [
    "Sunil Kumar Sahu",
    "portfolio",
    "developer",
    "VIT-AP",
    "Python",
    "C++",
    "Qt",
    "React",
    "Linux",
  ],
  authors: [{ name: "Sunil Kumar Sahu" }],
  openGraph: {
    title: "Sunil Kumar Sahu | Portfolio",
    description:
      "Software & Hardware Enthusiast | EnC Student @ VIT-AP",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
