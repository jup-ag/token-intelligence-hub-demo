"use client"; // JUSTIFIED: uses useState for form state and onClick event handlers

import { useState } from "react";
import { ArrowDownUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSolana } from "@/components/providers/solana-provider";

interface SwapWidgetProps {
  /** Mint address of the output token (pre-filled for token detail pages) */
  defaultOutputMint?: string;
}

/**
 * Swap Widget Component
 * 
 * Inline token swap interface powered by Jupiter Ultra Swap API.
 * Clean, minimal design inspired by solprice.now.
 * 
 * Features:
 * - Large input fields (h-16, text-3xl) for easy interaction
 * - Real-time quote fetching (TODO: implement with Ultra API)
 * - Wallet connection requirement
 * - Transaction execution via Jupiter
 * 
 * Design Decisions:
 * - Black input backgrounds: Matches overall theme
 * - Large text: Easy to read amounts
 * - White action button: Clear primary action
 * - Centered swap icon: Visual balance
 * 
 * TODO: Complete Ultra API integration for:
 * - Getting swap quotes
 * - Executing swaps
 * - Transaction confirmation
 * 
 * Why Client Component: Needs form state and wallet connection
 * 
 * @example
 * ```tsx
 * // Pre-fill output token on token detail page
 * <SwapWidget defaultOutputMint={tokenMint} />
 * 
 * // Generic swap widget
 * <SwapWidget />
 * ```
 */
export function SwapWidget({ defaultOutputMint }: SwapWidgetProps) {
  const { isConnected } = useSolana();
  const [inputAmount, setInputAmount] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);

  const handleSwap = async () => {
    if (!isConnected || !inputAmount) return;

    setIsSwapping(true);
    try {
      // TODO: Implement swap logic with Ultra API
      console.log("Swapping:", inputAmount);
      // For now, just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Swap failed:", error);
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-8">
      <div className="space-y-6">
        {/* You pay */}
        <div className="space-y-3">
          <div className="text-sm text-white/60">You pay</div>
          <div className="flex gap-3">
            <Input
              type="number"
              placeholder="0.00"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              disabled={!isConnected}
              className="text-3xl font-bold h-16 tabular-nums bg-black border-white/10 focus-visible:border-white/30"
            />
            <Button 
              variant="outline" 
              disabled 
              className="min-w-28 h-16 text-base bg-white/5 border-white/10"
            >
              SOL
            </Button>
          </div>
        </div>

        {/* Swap direction */}
        <div className="flex justify-center -my-1">
          <div className="rounded-full border border-white/10 p-2 bg-black">
            <ArrowDownUp className="size-4 text-white/40" />
          </div>
        </div>

        {/* You receive */}
        <div className="space-y-3">
          <div className="text-sm text-white/60">You receive</div>
          <div className="flex gap-3">
            <Input 
              placeholder="0.00" 
              disabled 
              className="text-3xl font-bold h-16 tabular-nums bg-black border-white/10"
            />
            <Button 
              variant="outline" 
              disabled 
              className="min-w-28 h-16 text-base bg-white/5 border-white/10"
            >
              Token
            </Button>
          </div>
        </div>

        {/* Action button */}
        {!isConnected ? (
          <div className="text-center py-6 text-sm text-white/60">
            Connect wallet to swap
          </div>
        ) : (
          <Button
            className="w-full h-14 text-base font-semibold bg-white text-black hover:bg-white/90"
            onClick={handleSwap}
            disabled={!inputAmount || isSwapping}
          >
            {isSwapping ? "Swapping..." : "Swap"}
          </Button>
        )}

        {/* Footer */}
        <div className="text-xs text-center text-white/40 pt-2">
          powered by Jupiter Ultra
        </div>
      </div>
    </div>
  );
}

