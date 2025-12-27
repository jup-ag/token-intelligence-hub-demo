import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TypographyH2, TypographyMuted } from "@/components/ui/typography";

/**
 * 404 Not Found Page
 * 
 * Displayed when user navigates to a non-existent route.
 * Provides clear messaging and navigation back to home.
 */
export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center space-y-6 max-w-md px-6">
        <div className="text-6xl font-bold">404</div>
        <div className="space-y-2">
          <TypographyH2 className="text-3xl border-none pb-0">
            Page Not Found
          </TypographyH2>
          <TypographyMuted className="[&:not(:first-child)]:mt-0">
            The page you're looking for doesn't exist
          </TypographyMuted>
        </div>
        <Link href="/">
          <Button className="bg-white text-black hover:bg-white/90 font-semibold">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

