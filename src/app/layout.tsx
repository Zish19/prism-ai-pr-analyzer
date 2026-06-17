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
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#3B82F6',
          colorBackground: '#0a0b0f',
          fontFamily: 'var(--font-geist-sans)',
        },
        elements: {
          card: 'bg-[#12131a] border border-[#1e2028] rounded-none',
          formButtonPrimary: 'bg-[#3B82F6] hover:bg-[#2563eb] rounded-none text-white font-mono uppercase tracking-wider',
          formFieldInput: 'bg-[#0a0b0f] border-[#1e2028] rounded-none font-mono text-white focus:ring-[#3B82F6]',
          footerActionLink: 'text-[#3B82F6] hover:text-[#2563eb] font-mono',
          headerTitle: 'font-mono uppercase tracking-widest text-white',
          headerSubtitle: 'font-mono text-muted-foreground',
          socialButtonsBlockButton: 'border-[#1e2028] hover:bg-[#1a1b24] rounded-none text-white',
          socialButtonsBlockButtonText: 'font-mono text-white',
          dividerText: 'text-muted-foreground font-mono',
          dividerLine: 'bg-[#1e2028]',
          userButtonAvatarBox: 'rounded-none border border-[#1e2028]',
        }
      }}
    >
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} dark`}
        suppressHydrationWarning
      >
        <body className="min-h-dvh antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
