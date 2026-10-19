import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { businessConfig } from "@config/business.config";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

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
    "--navy-900": businessConfig.colors.primary,
    "--navy-800": businessConfig.colors.primaryHover,
    "--navy-700": businessConfig.colors.primaryMuted,
    "--orange-500": businessConfig.colors.accent,
    "--orange-600": businessConfig.colors.accentHover,
    "--orange-700": businessConfig.colors.accentDark,
    "--orange-50": businessConfig.colors.accentTint,
  } as React.CSSProperties;

  return (
    <html lang="en" className={inter.variable} style={cssVars}>
      <body className="font-sans min-h-screen bg-white text-navy-900 antialiased flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col">{children}</div>
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
