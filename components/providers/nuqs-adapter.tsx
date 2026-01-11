"use client"; // JUSTIFIED: nuqs adapter requires client

import { NuqsAdapter } from "nuqs/adapters/next";

export function NuqsProvider({ children }: { children: React.ReactNode }) {
  return <NuqsAdapter>{children}</NuqsAdapter>;
}


