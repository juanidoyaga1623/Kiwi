import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Kiwi — Fractional Stock Trading",
    template: "%s | Kiwi",
  },
  description:
    "Invertí en acciones fraccionadas de las mejores empresas del mundo desde $1 USD.",
  keywords: ["stocks", "fractional shares", "investing", "trading", "kiwi"],
  authors: [{ name: "Kiwi" }],
  openGraph: {
    title: "Kiwi — Fractional Stock Trading",
    description: "Invertí en acciones fraccionadas desde $1 USD",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
