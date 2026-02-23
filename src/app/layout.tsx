import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "DarGlobal Prestige | Luxury Real Estate Investment",
  description:
    "Exceptional luxury real estate for the global citizen. Homes and investments in UAE, UK, Saudi Arabia, Oman, Qatar, Maldives, and Spain. Live All In.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-[var(--background)] font-sans antialiased text-[var(--foreground)]">
        <AuthProvider>
          <Header />
          <main className="min-h-[calc(100vh-72px)]">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
