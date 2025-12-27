import { jupiterFetch } from "@/lib/jupiter/client";

interface OrderParams {
  inputMint: string;
  outputMint: string;
  amount: string;
  slippageBps?: number;
  userPublicKey: string;
}

interface OrderResponse {
  requestId: string;
  transaction: string;
  message?: string;
}

interface ExecuteParams {
  signedTransaction: string;
  requestId: string;
}

interface ExecuteResponse {
  signature: string;
  status: string;
}

export async function getOrder(params: OrderParams): Promise<OrderResponse> {
  const response = await jupiterFetch<OrderResponse>(`/ultra/v1/order`, {
    method: "POST",
    body: JSON.stringify(params),
  });
  
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
  const response = await jupiterFetch(`/ultra/v1/holdings?address=${address}`);
  return response;
}

export async function searchTokens(query: string) {
  const response = await jupiterFetch(
    `/ultra/v1/search?query=${encodeURIComponent(query)}`
  );
  return response;
}

