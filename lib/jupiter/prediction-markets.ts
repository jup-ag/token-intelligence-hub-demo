/**
 * Jupiter Prediction Market API Client
 *
 * Provides functions to interact with Jupiter's prediction market API,
 * including fetching events, markets, and creating orders.
 *
 * @see https://prediction-market-api.jup.ag/docs
 */

const PM_BASE_URL = "https://prediction-market-api.jup.ag";

// =============================================================================
// Types - Event & Market
// =============================================================================

export type PMMarketStatus = "open" | "closed" | "cancelled";
export type PMMarketResult = "" | "pending" | "yes" | "no";
export type PMEventCategory =
  | "all"
  | "crypto"
  | "sports"
  | "politics"
  | "esports"
  | "culture"
  | "economics"
  | "tech";

export interface PMMarketMetadata {
  marketId: string;
  title: string;
  subtitle?: string;
  description?: string;
  status: PMMarketStatus;
  result?: PMMarketResult;
  closeTime: number;
  openTime: number;
  settlementTime?: number;
  isTradable: boolean;
  rulesPrimary?: string;
  rulesSecondary?: string;
}

export interface PMMarketPricing {
  /** Price to buy Yes contracts in micro-dollars (null if no liquidity) */
  buyYesPriceUsd: number | null;
  /** Price to buy No contracts in micro-dollars (null if no liquidity) */
  buyNoPriceUsd: number | null;
  /** Price to sell Yes contracts in micro-dollars */
  sellYesPriceUsd: number | null;
  /** Price to sell No contracts in micro-dollars */
  sellNoPriceUsd: number | null;
  /** Total volume traded in micro-dollars */
  volume: number;
  /** 24h volume in micro-dollars */
  volume24h: number;
  openInterest?: number;
  liquidityDollars?: number;
  notionalValueDollars?: number;
}

export interface PMMarket {
  marketId: string;
  event: string;
  status: PMMarketStatus;
  result: PMMarketResult;
  openTime: number;
  closeTime: number;
  settlementTime: number;
  metadata: PMMarketMetadata;
  pricing: PMMarketPricing;
}

export interface PMEventMetadata {
  eventId: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  isLive?: boolean;
  earlyCloseCondition?: string;
}

export interface PMEvent {
  eventId: string;
  series: string;
  winner: string;
  multipleWinners: boolean;
  isActive: boolean;
  isLive: boolean;
  category: PMEventCategory;
  subcategory: string;
  metadata: PMEventMetadata;
  markets: PMMarket[];
  tvlDollars: string;
  volumeUsd: string;
  closeCondition?: string;
  beginAt: string | null;
  rulesPdf?: string;
}

interface PMEventsResponse {
  data: PMEvent[];
  pagination?: {
    start: number;
    end: number;
    total: number;
    hasNext: boolean;
  };
}

// =============================================================================
// Types - Orders
// =============================================================================

export interface CreateOrderRequest {
  ownerPubkey: string;
  marketId: string;
  isYes: boolean;
  isBuy: boolean;
  contracts: number | string;
  maxBuyPriceUsd?: number | string;
  minSellPriceUsd?: number | string;
  depositAmount?: number | string;
  positionPubkey?: string;
}

export interface OrderDetails {
  orderPubkey: string | null;
  ownerPubkey: string;
  marketId: string;
  positionPubkey: string;
  isBuy: boolean;
  isYes: boolean;
  contracts: string;
  orderCostUsd: string;
  newAvgPriceUsd: string;
  depositAmountUsd: string;
  requiredDepositUsd: string;
  estimatedTotalFeeUsd: string;
  newPayoutUsd: string;
}

export interface CreateOrderResponse {
  /** Base64-encoded unsigned transaction */
  transaction: string | null;
  txMeta: {
    blockhash: string;
    lastValidBlockHeight: number;
  } | null;
  externalOrderId: string | null;
  order: OrderDetails;
}

export interface OrderStatusResponse {
  pubkey: string;
  status: "pending" | "filled" | "failed";
  owner: string;
  marketId: string;
  isYes: boolean;
  isBuy: boolean;
  contracts: string;
  createdAt: number;
  updatedAt: number;
  fillPriceUsd?: string;
  fillTimestamp?: number;
}

// =============================================================================
// API Functions - Events
// =============================================================================

/**
 * Fetch prediction markets by category.
 * Returns only active events with open markets.
 * 
 * Gracefully handles API errors (including 429 rate limits) by returning empty array.
 */
export async function getCryptoPredictionMarkets(
  limit = 10
): Promise<PMEvent[]> {
  try {
    const url = `${PM_BASE_URL}/api/v1/events?category=crypto&limit=${limit}`;
    const response = await fetch(url, { next: { revalidate: 300 } }); // Cache 5 min

    if (!response.ok) {
      // Log but don't throw - return empty array for graceful degradation
      console.warn(`Prediction Market API returned ${response.status}`);
      return [];
    }

    const data: PMEventsResponse = await response.json();
    return data.data.filter((event) => event.isActive);
  } catch (error) {
    console.warn("Failed to fetch prediction markets:", error);
    return [];
  }
}

/**
 * Search prediction markets by query string.
 * Matches against event titles.
 */
export async function searchPredictionMarkets(
  query: string
): Promise<PMEvent[]> {
  const url = `${PM_BASE_URL}/api/v1/events/search?query=${encodeURIComponent(query)}&limit=10`;
  const response = await fetch(url, { next: { revalidate: 60 } });

  if (!response.ok) {
    throw new Error(`Prediction Market API error: ${response.status}`);
  }

  const data: PMEventsResponse = await response.json();
  return data.data;
}

/**
 * Get a specific prediction market event by ID.
 * Returns null if not found.
 */
export async function getPredictionMarketEvent(
  eventId: string
): Promise<PMEvent | null> {
  const url = `${PM_BASE_URL}/api/v1/events/${encodeURIComponent(eventId)}`;
  const response = await fetch(url, { next: { revalidate: 60 } });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.data || data;
}

// =============================================================================
// API Functions - Orders
// =============================================================================

/**
 * Create a prediction market order.
 * Returns an unsigned transaction to be signed by the user's wallet.
 */
export async function createPMOrder(
  request: CreateOrderRequest
): Promise<CreateOrderResponse> {
  const response = await fetch(`${PM_BASE_URL}/api/v1/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `Prediction Market API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Get the status of an existing order.
 */
export async function getPMOrderStatus(
  orderPubkey: string
): Promise<OrderStatusResponse> {
  const response = await fetch(
    `${PM_BASE_URL}/api/v1/orders/status/${orderPubkey}`
  );

  if (!response.ok) {
    throw new Error(`Prediction Market API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Get all positions for a wallet address.
 */
export async function getPMPositions(ownerPubkey: string): Promise<unknown[]> {
  const response = await fetch(
    `${PM_BASE_URL}/api/v1/positions?ownerPubkey=${ownerPubkey}`
  );

  if (!response.ok) {
    throw new Error(`Prediction Market API error: ${response.status}`);
  }

  const data = await response.json();
  return data.data || [];
}

// =============================================================================
// Utility Functions - Formatting & Conversion
// =============================================================================

/**
 * Convert micro-dollar price to probability percentage.
 * Jupiter PM uses micro-dollars where $1 = 1,000,000.
 *
 * @example getProbability(500000) // returns 50 (50%)
 */
export function getProbability(buyPriceUsd: number | null): number {
  if (buyPriceUsd === null) return 0;
  return buyPriceUsd / 10000;
}

/**
 * Format micro-dollar price for display.
 *
 * @example formatPMPrice(140000) // returns "14¢"
 */
export function formatPMPrice(priceUsd: number | null): string {
  if (priceUsd === null) return "—";
  const cents = priceUsd / 10000;
  return `${cents.toFixed(0)}¢`;
}

/**
 * Format volume for display with appropriate suffix.
 *
 * @example formatPMVolume(1500000) // returns "$1.5M"
 */
export function formatPMVolume(volume: number): string {
  if (volume >= 1_000_000) {
    return `$${(volume / 1_000_000).toFixed(1)}M`;
  }
  if (volume >= 1_000) {
    return `$${(volume / 1_000).toFixed(0)}K`;
  }
  return `$${volume.toFixed(0)}`;
}

/**
 * Convert dollar amount to number of contracts at a given price.
 * Each contract pays $1 if the prediction is correct.
 *
 * @example dollarsToContracts(10, 200000) // Buy $10 worth at 20¢ = 50 contracts
 */
export function dollarsToContracts(
  dollarAmount: number,
  priceInMicroDollars: number
): number {
  if (priceInMicroDollars <= 0) return 0;
  return Math.floor((dollarAmount * 1_000_000) / priceInMicroDollars);
}

/**
 * Convert number of contracts to dollar cost at a given price.
 *
 * @example contractsToDollars(50, 200000) // 50 contracts at 20¢ = $10
 */
export function contractsToDollars(
  contracts: number,
  priceInMicroDollars: number
): number {
  return (contracts * priceInMicroDollars) / 1_000_000;
}
