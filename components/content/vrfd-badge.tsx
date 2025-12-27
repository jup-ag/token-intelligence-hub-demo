import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// Badge variants using class-variance-authority
// Why: Consistent styling variants with type safety
const vrfdBadgeVariants = cva("text-xs", {
  variants: {
    variant: {
      /** Green badge indicating verified content */
      verified: "bg-green-500/10 text-green-400 border-green-500/30",
      /** Blue badge indicating content available */
      available: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    },
  },
  defaultVariants: { variant: "verified" },
});

interface VrfdBadgeProps extends VariantProps<typeof vrfdBadgeVariants> {
  className?: string;
}

/**
 * VRFD Badge Component
 * 
 * Displays verification status from Jupiter VRFD.
 * Minimal design with color-coded variants.
 * 
 * Variants:
 * - "verified": Green badge for verified content
 * - "available": Blue badge for content availability
 * 
 * Design: Small, subtle badge that doesn't compete with main content
 * 
 * @example
 * ```tsx
 * <VrfdBadge variant="verified" />
 * <VrfdBadge variant="available" />
 * ```
 */
export function VrfdBadge({ variant, className }: VrfdBadgeProps) {
  return (
    <Badge variant="outline" className={cn(vrfdBadgeVariants({ variant }), className)}>
      VRFD
    </Badge>
  );
}

