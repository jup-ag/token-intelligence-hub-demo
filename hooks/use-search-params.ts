"use client"; // JUSTIFIED: wraps useQueryStates which uses useSearchParams

import { useQueryStates, type Options } from "nuqs";
import { searchParams, searchUrlKeys } from "@/lib/nuqs";

// Wrap nuqs with project defaults (team pattern)
export function useSearchParams(options?: Partial<Options>) {
  return useQueryStates(searchParams, {
    urlKeys: searchUrlKeys,
    ...options,
  });
}

