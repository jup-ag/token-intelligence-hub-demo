import { NextRequest, NextResponse } from "next/server";
import {
  createPMOrder,
  type CreateOrderRequest,
} from "@/lib/jupiter/prediction-markets";

/**
 * POST /api/pm/order
 *
 * Creates a prediction market order and returns an unsigned transaction.
 * The client is responsible for signing and submitting the transaction.
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json();

    // Validate required fields
    if (!body.ownerPubkey || !body.marketId) {
      return NextResponse.json(
        { error: "Missing required fields: ownerPubkey, marketId" },
        { status: 400 }
      );
    }

    const orderResponse = await createPMOrder(body);
    return NextResponse.json(orderResponse);
  } catch (error) {
    console.error("PM Order error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create order",
      },
      { status: 500 }
    );
  }
}
