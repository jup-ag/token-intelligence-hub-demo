"use client"; // JUSTIFIED: uses useState and useConnect hooks from Wallet Standard

import { useState } from "react";
import { ChevronDown, Wallet, LogOut } from "lucide-react";
import {
  useConnect,
  type UiWallet,
} from "@wallet-standard/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSolana } from "@/components/providers/solana-provider";

/**
 * Truncate wallet address for display
 * Shows first 4 and last 4 characters
 * @example "abc...xyz" from "abcdefghijklmnopqrstuvwxyz"
 */
function truncateAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

/**
 * Wallet Icon Component
 * Displays wallet logo with fallback to first 2 letters
 */
function WalletIcon({
  wallet,
  className,
}: {
  wallet: UiWallet;
  className?: string;
}) {
  return (
    <Avatar className={className}>
      {wallet.icon && (
        <AvatarImage src={wallet.icon} alt={`${wallet.name} icon`} />
      )}
      <AvatarFallback>{wallet.name.slice(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}

/**
 * Wallet Menu Item Component
 * 
 * Individual wallet option in the connection dropdown.
 * Handles the connection flow using Wallet Standard.
 */
function WalletMenuItem({
  wallet,
  onConnect,
}: {
  wallet: UiWallet;
  onConnect: () => void;
}) {
  const { setWalletAndAccount } = useSolana();
  const [isConnecting, connect] = useConnect(wallet);

  const handleConnect = async () => {
    if (isConnecting) return;

    try {
      const accounts = await connect();

      if (accounts && accounts.length > 0) {
        const account = accounts[0];
        setWalletAndAccount(wallet, account);
        onConnect();
      }
    } catch (err) {
      console.error(`Failed to connect ${wallet.name}:`, err);
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className="flex w-full items-center justify-between px-2 py-1.5 text-sm outline-none hover:bg-accent focus:bg-accent disabled:pointer-events-none disabled:opacity-50"
    >
      <div className="flex items-center gap-2">
        <WalletIcon wallet={wallet} className="size-6" />
        <span>{wallet.name}</span>
      </div>
      {isConnecting && <span className="text-xs">Connecting...</span>}
    </button>
  );
}

/**
 * Wallet Connect Button Component
 * 
 * Primary wallet connection interface for the application.
 * Displays available Solana wallets and manages connection state.
 * 
 * Features:
 * - Auto-detects installed Solana wallets
 * - Dropdown menu for wallet selection
 * - Shows connected wallet with truncated address
 * - Disconnect functionality
 * 
 * States:
 * - Not Connected: Shows "Connect Wallet" button with dropdown
 * - Connected: Shows wallet icon + truncated address
 * 
 * Design: Minimal button with clean dropdown matching solprice.now aesthetic
 * 
 * @example
 * ```tsx
 * // In layout or header
 * <WalletConnectButton />
 * ```
 */
export function WalletConnectButton() {
  const { wallets, selectedWallet, selectedAccount, isConnected, setWalletAndAccount } = useSolana();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDisconnect = async () => {
    if (selectedWallet) {
      try {
        // Directly set wallet and account to null instead of using disconnect hook
        setWalletAndAccount(null, null);
      } catch (err) {
        console.error("Failed to disconnect:", err);
      }
    }
    setIsDropdownOpen(false);
  };

  if (!isConnected || !selectedAccount || !selectedWallet) {
    return (
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/50"
          >
            <Wallet className="mr-2 size-4" />
            Connect Wallet
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Select Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {wallets.length === 0 ? (
            <div className="px-2 py-6 text-center text-sm text-muted-foreground">
              No wallets found. Please install a Solana wallet.
            </div>
          ) : (
            wallets.map((wallet) => (
              <WalletMenuItem
                key={wallet.name}
                wallet={wallet}
                onConnect={() => setIsDropdownOpen(false)}
              />
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline"
          className="bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/50"
        >
          <WalletIcon wallet={selectedWallet} className="mr-2 size-4" />
          {truncateAddress(selectedAccount.address)}
          <ChevronDown className="ml-2 size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex items-center gap-2">
            <WalletIcon wallet={selectedWallet} className="size-6" />
            <div>
              <div className="font-medium">{selectedWallet.name}</div>
              <div className="text-xs font-normal text-muted-foreground">
                {truncateAddress(selectedAccount.address)}
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDisconnect}>
          <LogOut className="mr-2 size-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

