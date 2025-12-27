import { type Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SolanaProvider } from "@/components/providers/solana-provider";
import { NuqsProvider } from "@/components/providers/nuqs-adapter";
import { WalletConnectButton } from "@/components/wallet/wallet-connect-button";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Token Intelligence Hub",
  description: "Jupiter-powered token research and trading platform with VRFD verification",
};

// Force dynamic rendering for wallet integration
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SolanaProvider>
          <NuqsProvider>
            <div className="min-h-screen flex flex-col bg-black text-white">
              {/* Clean navbar - perfectly aligned like solprice.now */}
              <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                  {/* Logo/Brand */}
                  <a 
                    href="/" 
                    className="text-base font-medium tracking-tight hover:text-white/80 transition-colors"
                  >
                    Token Intelligence
                  </a>
                  
                  {/* Center Navigation */}
                  <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                    <a 
                      href="/search" 
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      Search
                    </a>
                    <a 
                      href="/portfolio" 
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      Portfolio
                    </a>
                    <a 
                      href="/content" 
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      Content
                    </a>
                  </div>
                  
                  {/* Wallet Button */}
                  <div>
                    <WalletConnectButton />
                  </div>
                </nav>
              </header>
              
              <main className="flex-1">{children}</main>
            </div>
          </NuqsProvider>
        </SolanaProvider>
      </body>
    </html>
  );
}
