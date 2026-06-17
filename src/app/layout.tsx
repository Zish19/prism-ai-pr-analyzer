import { ClerkProvider } from '@clerk/nextjs'
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
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-dvh`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider
            appearance={{
              variables: {
                colorPrimary: '#3B82F6',
                fontFamily: 'var(--font-geist-sans)',
              },
              elements: {
                card: 'bg-card border border-border rounded-none',
                headerTitle: 'font-mono text-foreground',
                headerSubtitle: 'font-mono text-muted-foreground',
                formFieldInput: 'bg-input border-border rounded-none font-mono text-foreground focus:ring-primary',
                formFieldLabel: 'font-mono text-foreground',
                formButtonPrimary: 'rounded-none font-mono tracking-widest uppercase hover:bg-primary/90 transition-colors',
                footerActionLink: 'text-primary hover:text-primary/80 font-mono',
              }
            }}
          >
            {children}
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
