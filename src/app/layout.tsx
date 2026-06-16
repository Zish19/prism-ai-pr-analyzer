import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/* -------------------------------------------------------------------
   Font configuration — Geist Sans (UI) + Geist Mono (code)
   ------------------------------------------------------------------- */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/* -------------------------------------------------------------------
   SEO Metadata
   ------------------------------------------------------------------- */
export const metadata: Metadata = {
  title: "PRISM — AI PR Reviewer",
  description:
    "AI-powered pull request analysis platform for code quality, security, and performance insights.",
  keywords: [
    "pull request",
    "code review",
    "AI",
    "code quality",
    "security",
    "performance",
    "GitHub",
  ],
  authors: [{ name: "PRISM Team" }],
  openGraph: {
    title: "PRISM — AI PR Reviewer",
    description:
      "AI-powered pull request analysis platform for code quality, security, and performance insights.",
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  themeColor: "#8b5cf6",
  width: "device-width",
  initialScale: 1,
};

/* -------------------------------------------------------------------
   Root Layout
   ------------------------------------------------------------------- */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh antialiased">
        {children}
      </body>
    </html>
  );
}
