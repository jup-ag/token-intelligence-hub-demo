import { type Metadata } from "next";
import { Inter } from "next/font/google";
import { SolanaProvider } from "@/components/providers/solana-provider";
import { NuqsProvider } from "@/components/providers/nuqs-adapter";
import { WalletConnectButton } from "@/components/wallet/wallet-connect-button";
import { SearchCommand, SearchTrigger } from "@/components/search/search-command";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "Token Intelligence",
  description: "Research and trade Solana tokens with verified intelligence",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <SolanaProvider>
          <NuqsProvider>
            <div className="min-h-screen flex flex-col">
              {/* Minimal navbar */}
              <header className="fixed top-0 left-0 right-0 z-50">
                <div className="glass glass-border">
                  <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 h-14">
                    {/* Logo */}
                    <Link 
                      href="/" 
                      className="text-[15px] font-medium text-white/90 hover:text-white transition-apple"
                    >
                      Token Intelligence
                    </Link>
                    
                    {/* Center - Search + Nav */}
                    <div className="hidden md:flex items-center gap-6">
                      <SearchTrigger />
                      <div className="w-px h-4 bg-white/10" />
                      <Link 
                        href="/content" 
                        className="text-[13px] text-white/50 hover:text-white transition-apple"
                      >
                        Content
                      </Link>
                      <Link 
                        href="/portfolio" 
                        className="text-[13px] text-white/50 hover:text-white transition-apple"
                      >
                        Portfolio
                      </Link>
                    </div>
                    
                    {/* Wallet */}
                    <WalletConnectButton />
                  </nav>
                </div>
              </header>
              
              {/* Spotlight search dialog */}
              <SearchCommand />
              
              {/* Main content */}
              <main className="flex-1 pt-14">{children}</main>
            </div>
          </NuqsProvider>
        </SolanaProvider>
      </body>
    </html>
  );
}
