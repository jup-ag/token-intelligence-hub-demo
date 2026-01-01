// Token types
export interface TokenInfo {
  mint: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
  tags?: string[];
  organicScore?: number;
  marketCap?: number;
  holders?: number;
}

// Content types (VRFD)
export interface TokenContent {
  id: string;
  mint: string;
  type: "text" | "tweet" | "summary" | "news";
  content: string;
  submittedBy: string;
  source?: string;
  citations?: string[];
  status: "approved";
  createdAt: string;
  updatedAt: string;
}

// Price types
export interface TokenPrice {
  usdPrice: number;
  decimals: number;
  blockId: number;
  priceChange24h: number;
}

// Portfolio types
export interface PortfolioElement {
  platformId: string;
  platformName?: string;
  platformImage?: string;
  type: string;
  label?: string;
  value: number;
  data: any; // Platform-specific position data
}

export interface Position {
  mint: string;
  amount: string;
  value: number;
  platform: string;
}

// API Response types
export interface TokensSearchResponse {
  [mint: string]: TokenInfo;
}

// Category endpoint returns same structure as search
export interface CategoryResponse {
  [mint: string]: TokenInfo;
}

export interface PricesResponse {
  [mint: string]: TokenPrice;
}

export interface ContentResponse {
  data: TokenContent[];
  hasMore: boolean;
}

export interface CookingTokensResponse {
  data: Array<{
    mint: string;
    content: TokenContent[];
  }>;
}

export interface PortfolioResponse {
  date: number;
  owner: string;
  elements: PortfolioElement[];
  totalValue: number;
  duration?: number;
  fetcherReports?: any[];
}

