import { verifyRequest } from "@/services/discord/verifyRequest";
import { handleDesayunoCommand } from "@/services/discord/commands/desayuno";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await verifyRequest(request);

  if (process.env.DEBUG_REQUESTS === "true") {
    console.log("\x1b[36m%s\x1b[0m", "body", body);
  }

  // Handle ping
  if (body.type === 1) {
    return NextResponse.json({ type: 1 });
  }

  // Handle command
  if (body.type === 2) {
    switch (body.data?.name) {
      case "desayuno": {
        const response = await handleDesayunoCommand(body);
        return NextResponse.json(response);
      }

      default:
        return new Response("Unknown command", { status: 400 });
    }
  }

  // Handle unknown type
  return new Response("Unknown interaction type", { status: 400 });
}
