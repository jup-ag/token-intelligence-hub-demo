import { jupiterFetch } from "@/lib/jupiter/client";
import { type PortfolioResponse } from "@/types/jupiter";

export async function getPositions(
  address: string,
  platforms?: string[]
): Promise<PortfolioResponse> {
  const platformsParam = platforms ? `?platforms=${platforms.join(",")}` : "";
  const response = await jupiterFetch<PortfolioResponse>(
    `/portfolio/v1/positions/${address}${platformsParam}`
  );
  
  return response;
}

export async function getStakedJup(address: string) {
  const response = await jupiterFetch(
    `/portfolio/v1/staked-jup/${address}`
  );
  
  return response;
}

export async function getPlatforms() {
  const response = await jupiterFetch(`/portfolio/v1/platforms`);
  return response;
}

