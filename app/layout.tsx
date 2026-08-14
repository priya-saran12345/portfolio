import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Priya Saran — MERN Stack & Next.js Developer",
  description:
    "Portfolio of Priya Saran, a MERN Stack / Next.js developer building SEO-optimized marketing sites, internal ERP tools, and customer-facing platforms.",
  keywords: [
    "Priya Saran",
    "MERN Stack Developer",
    "Next.js Developer",
    "React Developer",
    "Full Stack Developer",
  ],
  openGraph: {
    title: "Priya Saran — MERN Stack & Next.js Developer",
    description:
      "2 years shipping production web apps with React, Next.js, Node.js, Express and MongoDB.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-base text-ink font-body antialiased">{children}</body>
    </html>
  );
}
