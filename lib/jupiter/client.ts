import { config } from "@/lib/config";

/**
 * Jupiter API Base Client
 * 
 * Centralized fetch wrapper for all Jupiter API calls.
 * Handles authentication, error handling, and response parsing.
 * 
 * Benefits of this pattern:
 * - Single place to update API key handling
 * - Consistent error handling across all endpoints
 * - Type-safe responses with generics
 * - Easy to add rate limiting, retry logic, etc.
 */

const BASE_URL = "https://api.jup.ag";

/**
 * Generic fetch wrapper for Jupiter API
 * 
 * Automatically includes API key authentication and handles errors.
 * All Jupiter API modules use this function for consistency.
 * 
 * @template T - Expected response type
 * @param endpoint - API endpoint path (e.g., "/tokens/v2/search")
 * @param options - Fetch options (method, body, etc.)
 * @returns Typed API response
 * @throws Error if response is not ok (status >= 400)
 * 
 * @example
 * ```typescript
 * // GET request (default)
 * const tokens = await jupiterFetch<TokensResponse>('/tokens/v2/search?query=SOL');
 * 
 * // POST request
 * const result = await jupiterFetch<ExecuteResponse>('/ultra/v1/execute', {
 *   method: 'POST',
 *   body: JSON.stringify({ transaction: signedTx })
 * });
 * ```
 */
export async function jupiterFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      "x-api-key": config.jupiterApiKey || "",
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  // Enhanced error handling with status code and message
  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`Jupiter API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

