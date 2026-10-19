import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { businessConfig } from "@config/business.config";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: businessConfig.seo.title,
  description: businessConfig.seo.description,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: businessConfig.colors.primary,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cssVars = {
    "--navy-950": "#020617",
    "--navy-900": businessConfig.colors.primary,
    "--navy-800": businessConfig.colors.primaryHover,
    "--navy-700": businessConfig.colors.primaryMuted,
    "--orange-500": businessConfig.colors.accent,
    "--orange-600": businessConfig.colors.accentHover,
    "--orange-700": businessConfig.colors.accentDark,
    "--orange-50": businessConfig.colors.accentTint,
    "--font-heading": "var(--font-inter)",
  } as React.CSSProperties;

  return (
    <html lang="en" className="font-sans" style={cssVars}>
      <body className="font-sans min-h-screen bg-white text-navy-900 antialiased flex flex-col">
        {/* Accessibility Skip-To-Content Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-orange-500 focus:text-navy-950 focus:font-bold focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-navy-900"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main-content" className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
        <Toaster
          position="top-center"
          toastOptions={{
            className: "border border-slate-200 bg-white text-navy-900 font-medium shadow-md",
          }}
        />
      </body>
    </html>
  );
}
