/**
 * Server-side configuration
 * 
 * API keys are NOT prefixed with NEXT_PUBLIC_ to keep them server-only.
 * These are only accessible in Server Components, API routes, and server actions.
 */
export const config = {
  jupiterApiKey: process.env.JUPITER_API_KEY || "",
} as const;

/**
 * Public configuration (safe to expose to client)
 * 
 * RPC URLs need to be public for wallet connections in the browser.
 */
export const publicConfig = {
  solanaRpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com",
  solanaWsUrl: process.env.NEXT_PUBLIC_SOLANA_WS_URL || "",
} as const;

