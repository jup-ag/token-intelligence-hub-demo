import { cn } from "@/lib/utils";
import { type TokenPrice } from "@/types/jupiter";

interface PriceDisplayProps {
  /** Price data including USD price and 24h change */
  price: TokenPrice | null;
  /** Additional CSS classes */
  className?: string;
  /** Size variant: "default" (3xl) for cards, "large" (6xl) for hero displays */
  size?: "default" | "large";
}

/**
 * Price Display Component
 * 
 * Renders token price with 24h change in a clean, prominent format.
 * Supports two sizes: default for cards, large for hero sections.
 * 
 * Features:
 * - Two size variants (3xl and 6xl)
 * - Tabular numbers for perfect alignment
 * - Color-coded change indicators (green ↗ / red ↘)
 * - Handles null prices gracefully
 * - Smart decimal formatting (more decimals for small prices)
 * 
 * Design Philosophy:
 * - Price is the hero element (largest text on screen)
 * - Changes use arrows for quick visual scanning
 * - Tabular nums prevent layout shift during updates
 * 
 * @example
 * ```tsx
 * // For cards
 * <PriceDisplay price={tokenPrice} size="default" />
 * 
 * // For hero sections
 * <PriceDisplay price={tokenPrice} size="large" />
 * ```
 */
export function PriceDisplay({ price, className, size = "default" }: PriceDisplayProps) {
  if (!price) {
    return (
      <div className={cn("space-y-2", className)}>
        <div className={cn(
          "font-bold text-muted-foreground tabular-nums",
          size === "large" ? "text-6xl" : "text-3xl"
        )}>
          --
        </div>
        <div className="text-sm text-muted-foreground">No price data</div>
      </div>
    );
  }

  const hasChange = price.priceChange24h !== undefined && price.priceChange24h !== null;
  const isPositive = hasChange && price.priceChange24h >= 0;
  const changeColor = isPositive ? "text-green-500" : "text-red-500";

  return (
    <div className={cn("space-y-2", className)}>
      <div className={cn(
        "font-bold tabular-nums",
        size === "large" ? "text-6xl" : "text-3xl"
      )}>
        ${price.usdPrice.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: price.usdPrice < 1 ? 6 : 2,
        })}
      </div>
      {hasChange && (
        <div className={cn("flex items-center gap-2 text-sm font-medium", changeColor)}>
          <span>{isPositive ? "↗" : "↘"}</span>
          <span>
            {isPositive ? "+" : ""}
            {price.priceChange24h.toFixed(2)}% today
          </span>
        </div>
      )}
    </div>
  );
}

