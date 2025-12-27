"use client"; // JUSTIFIED: uses useState, useMemo, useContext for wallet state management

import React, { createContext, useContext, useState, useMemo } from "react";
import {
  useWallets,
  type UiWallet,
  type UiWalletAccount,
} from "@wallet-standard/react";
import { createSolanaRpc, createSolanaRpcSubscriptions } from "@solana/kit";
import { StandardConnect } from "@wallet-standard/core";
import { config } from "@/lib/config";

// Solana chain identifier for mainnet
const chain = "solana:mainnet";

// RPC connections - initialized only on client side
// Why: WebSocket and RPC connections require browser environment
let rpc: ReturnType<typeof createSolanaRpc> | null = null;
let ws: ReturnType<typeof createSolanaRpcSubscriptions> | null = null;

if (typeof window !== "undefined") {
  rpc = createSolanaRpc(config.solanaRpcUrl);
  ws = createSolanaRpcSubscriptions(config.solanaWsUrl);
}

/**
 * Solana Context State
 * 
 * Provides wallet connection state and RPC access throughout the app.
 */
interface SolanaContextState {
  /** RPC client for Solana blockchain queries */
  rpc: ReturnType<typeof createSolanaRpc> | null;
  /** WebSocket subscriptions for real-time updates */
  ws: ReturnType<typeof createSolanaRpcSubscriptions> | null;
  /** Chain identifier (solana:mainnet) */
  chain: typeof chain;
  /** Available Solana wallets */
  wallets: UiWallet[];
  /** Currently selected wallet */
  selectedWallet: UiWallet | null;
  /** Currently selected account from wallet */
  selectedAccount: UiWalletAccount | null;
  /** Whether a wallet is currently connected */
  isConnected: boolean;
  /** Function to update selected wallet and account */
  setWalletAndAccount: (
    wallet: UiWallet | null,
    account: UiWalletAccount | null
  ) => void;
}

const SolanaContext = createContext<SolanaContextState | undefined>(undefined);

/**
 * useSolana Hook
 * 
 * Access Solana wallet state and RPC clients from any component.
 * Must be used within SolanaProvider.
 * 
 * @throws {Error} If used outside SolanaProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isConnected, selectedAccount } = useSolana();
 *   return <div>{isConnected ? selectedAccount.address : 'Not connected'}</div>;
 * }
 * ```
 */
export function useSolana() {
  const context = useContext(SolanaContext);
  if (!context) {
    throw new Error("useSolana must be used within a SolanaProvider");
  }
  return context;
}

/**
 * Solana Provider Component
 * 
 * Manages wallet connection state and provides Solana RPC access.
 * Based on Solana Kit pattern: https://solana.com/docs/frontend/kit
 * 
 * Responsibilities:
 * - Detect and filter available Solana wallets
 * - Track selected wallet and account
 * - Provide RPC clients for blockchain queries
 * - Manage connection state
 * 
 * Why Client Component: Uses React hooks for state management
 * and browser-only wallet detection
 */
export function SolanaProvider({ children }: { children: React.ReactNode }) {
  const allWallets = useWallets();

  // Filter for Solana wallets only that support signAndSendTransaction
  const wallets = useMemo(() => {
    return allWallets.filter(
      (wallet) =>
        wallet.chains?.some((c) => c.startsWith("solana:")) &&
        wallet.features.includes(StandardConnect) &&
        wallet.features.includes("solana:signAndSendTransaction")
    );
  }, [allWallets]);

  // State management
  const [selectedWallet, setSelectedWallet] = useState<UiWallet | null>(null);
  const [selectedAccount, setSelectedAccount] =
    useState<UiWalletAccount | null>(null);

  // Check if connected (account must exist in the wallet's accounts)
  const isConnected = useMemo(() => {
    if (!selectedAccount || !selectedWallet) return false;

    // Find the wallet and check if it still has this account
    const currentWallet = wallets.find((w) => w.name === selectedWallet.name);
    return !!(
      currentWallet &&
      currentWallet.accounts.some(
        (acc) => acc.address === selectedAccount.address
      )
    );
  }, [selectedAccount, selectedWallet, wallets]);

  const setWalletAndAccount = (
    wallet: UiWallet | null,
    account: UiWalletAccount | null
  ) => {
    setSelectedWallet(wallet);
    setSelectedAccount(account);
  };

  // Create context value
  const contextValue = useMemo<SolanaContextState>(
    () => ({
      // Static RPC values
      rpc,
      ws,
      chain,

      // Dynamic wallet values
      wallets,
      selectedWallet,
      selectedAccount,
      isConnected,
      setWalletAndAccount,
    }),
    [wallets, selectedWallet, selectedAccount, isConnected]
  );

  return (
    <SolanaContext.Provider value={contextValue}>
      {children}
    </SolanaContext.Provider>
  );
}

