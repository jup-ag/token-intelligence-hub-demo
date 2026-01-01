"use client";

import { useSolana } from "@/components/providers/solana-provider";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

function truncateAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function WalletConnectButton() {
  const { isConnected, account, disconnect } = useSolana();
  const { setVisible } = useWalletModal();

  if (!isConnected || !account) {
    return (
      <button 
        onClick={() => setVisible(true)}
        className="px-4 py-2 rounded-full bg-white text-black text-[13px] font-medium hover:bg-white/90 transition-apple"
      >
        Connect
      </button>
    );
  }

  return (
    <button 
      onClick={disconnect}
      className="px-4 py-2 rounded-full bg-white/[0.06] text-[13px] font-medium text-white/80 hover:bg-white/[0.1] hover:text-white transition-apple font-mono"
    >
      {truncateAddress(account)}
    </button>
  );
}
