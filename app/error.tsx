"use client"; // JUSTIFIED: error components must be client components per Next.js requirements

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TypographyH2, TypographyMuted } from "@/components/ui/typography";

/**
 * Global Error Boundary
 * 
 * Catches and displays errors that occur during rendering.
 * Provides a user-friendly error message and retry functionality.
 * 
 * Why Client Component: Next.js requires error components to be client components
 * to handle runtime errors and provide interactive reset functionality.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log error for debugging
  // Why: useEffect to avoid logging during SSR
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center space-y-6 max-w-md px-6">
        <div className="text-6xl">⚠️</div>
        <div className="space-y-2">
          <TypographyH2 className="text-3xl border-none pb-0">
            Something went wrong
          </TypographyH2>
          <TypographyMuted className="[&:not(:first-child)]:mt-0">
            {error.message || "An unexpected error occurred"}
          </TypographyMuted>
        </div>
        <Button 
          onClick={reset} 
          className="bg-white text-black hover:bg-white/90 font-semibold"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}

