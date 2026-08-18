import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Providers } from "./providers";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Caulfield Joinery — Shop Manager",
  description: "Orders, inventory, scheduling, and invoicing for Caulfield Joinery.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <header className="border-b border-[var(--color-rule)] bg-[var(--color-surface)]">
              <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="font-[family-name:var(--font-display)] text-xl tracking-tight text-[var(--color-ink)]">
                  Caulfield Joinery
                </Link>
                <nav className="flex gap-6 text-sm text-[var(--color-ink-muted)]">
                  <Link href="/" className="hover:text-[var(--color-oak)]">Dashboard</Link>
                  <Link href="/customers" className="hover:text-[var(--color-oak)]">Customers</Link>
                </nav>
              </div>
            </header>
            <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
