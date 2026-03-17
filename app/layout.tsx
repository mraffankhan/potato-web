import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ARGON | The Ultimate Esports Tournament Management Platform",
  description: "Automate your esports tournaments, scrims, and community management with Argon. The most powerful Discord-integrated platform for competitive gaming.",
  keywords: ["esports management", "tournament automation", "discord bot", "argon bot", "scrims manager", "gaming community", "esports platform"],
  authors: [{ name: "Argon Team", url: "https://argon.gg" }],
  openGraph: {
    title: "ARGON | Elite Esports Management",
    description: "Scale your gaming community with automated tournaments and powerful Discord integration.",
    url: "https://argon.gg",
    siteName: "Argon",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Argon Esports Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ARGON | Elite Esports Management",
    description: "The next generation of Discord-driven esports automation.",
    images: ["/og-image.png"],
    creator: "@argonbot",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-black text-white min-h-screen flex flex-col selection:bg-primary/30 selection:text-white`}>
        {/* Maintenance Banner */}
        <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-yellow-500/10 via-amber-500/20 to-yellow-500/10 border-b border-yellow-500/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-center gap-2 text-xs sm:text-sm text-yellow-300/90">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400"></span>
            </span>
            🔧 This site is currently under maintenance. Some features may be unavailable.
          </div>
        </div>
        <Navbar />
        <main className="flex-grow pt-24">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
