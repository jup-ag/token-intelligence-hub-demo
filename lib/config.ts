export const config = {
  jupiterApiKey: process.env.NEXT_PUBLIC_JUPITER_API_KEY!,
  solanaRpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL!,
  solanaWsUrl: process.env.NEXT_PUBLIC_SOLANA_WS_URL!,
} as const;

// Validate on startup - API key can be empty for now during development
if (typeof window === "undefined" && !config.jupiterApiKey) {
  console.warn("NEXT_PUBLIC_JUPITER_API_KEY is not set. Some features may not work.");
}

