"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface TokenLogoProps {
  logoURI?: string;
  symbol: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "size-6 text-[10px]",
  md: "size-10 text-sm",
  lg: "size-14 text-xl",
};

const roundings = {
  sm: "rounded-full",
  md: "rounded-full",
  lg: "rounded-2xl",
};

/**
 * Shared token logo component with fallback
 * Handles IPFS URLs gracefully (shows fallback)
 */
export function TokenLogo({ logoURI, symbol, size = "md", className }: TokenLogoProps) {
  const [imgError, setImgError] = useState(false);
  const hasValidLogo = logoURI && !logoURI.includes("ipfs") && !imgError;

  if (hasValidLogo) {
    return (
      <img
        src={logoURI}
        alt={symbol}
        className={cn(sizes[size], roundings[size], "object-cover", className)}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className={cn(
        sizes[size],
        roundings[size],
        "bg-white/[0.06] flex items-center justify-center font-medium text-white/50",
        className
      )}
    >
      {symbol.slice(0, 2).toUpperCase()}
    </div>
  );
}


