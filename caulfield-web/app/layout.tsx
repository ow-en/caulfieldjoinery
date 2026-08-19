import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Providers } from "./providers";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

const bricolage = Bricolage_Grotesque({
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${bricolage.variable} ${inter.variable} ${plexMono.variable}`}>
        <ThemeProvider>
          <Providers>
            <div className="min-h-screen flex flex-col">
              <header className="sticky top-0 z-10 border-b border-[var(--color-rule)] bg-[var(--color-paper)]/80 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-8 py-5 flex items-center justify-between">
                  <Link href="/" className="font-[family-name:var(--font-display)] font-medium text-xl tracking-tight text-[var(--color-ink)]">
                    Caulfield Joinery
                  </Link>
                  <div className="flex items-center gap-8">
                    <nav className="flex gap-8 text-sm text-[var(--color-ink-muted)]">
                      <Link href="/" className="transition-colors hover:text-[var(--color-oak)]">Dashboard</Link>
                      <Link href="/customers" className="transition-colors hover:text-[var(--color-oak)]">Customers</Link>
                    </nav>
                    <ThemeToggle />
                  </div>
                </div>
              </header>
              <main className="flex-1 max-w-6xl mx-auto w-full px-8 py-14">
                {children}
              </main>
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
