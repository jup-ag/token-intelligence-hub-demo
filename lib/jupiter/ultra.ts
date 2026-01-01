import { jupiterFetch } from "@/lib/jupiter/client";

interface OrderParams {
  inputMint: string;
  outputMint: string;
  amount: string;
  slippageBps?: number;
}

interface OrderResponse {
  /** Base64-encoded unsigned transaction (null if taker not provided) */
  transaction: string | null;
  /** Request ID to use with /execute endpoint */
  requestId: string;
  /** Input token amount in raw units */
  inAmount?: string;
  /** Output token amount in raw units */
  outAmount?: string;
  /** Fee mint address */
  feeMint?: string;
  /** Fee in basis points */
  feeBps?: number;
  [key: string]: any;
}

interface ExecuteParams {
  signedTransaction: string;
  requestId: string;
}

interface ExecuteResponse {
  signature?: string;
  status?: string;
  [key: string]: any;
}

export async function getOrder(params: OrderParams & { taker?: string }): Promise<OrderResponse> {
  const queryParams = new URLSearchParams({
    inputMint: params.inputMint,
    outputMint: params.outputMint,
    amount: params.amount,
    ...(params.slippageBps && { slippageBps: params.slippageBps.toString() }),
    ...(params.taker && { taker: params.taker }),
  });
  
  const response = await jupiterFetch<OrderResponse>(
    `/ultra/v1/order?${queryParams.toString()}`
  );
  
  return response;
}

export async function executeOrder(params: ExecuteParams): Promise<ExecuteResponse> {
  const response = await jupiterFetch<ExecuteResponse>(`/ultra/v1/execute`, {
    method: "POST",
    body: JSON.stringify(params),
  });
  
  return response;
}

export async function getHoldings(address: string) {
  const response = await jupiterFetch(`/ultra/v1/holdings/${address}`);
  return response;
}

export async function searchTokens(query: string) {
  const response = await jupiterFetch(
    `/ultra/v1/search?query=${encodeURIComponent(query)}`
  );
  return response;
}

