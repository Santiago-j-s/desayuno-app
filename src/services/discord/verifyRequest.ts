import nacl from "tweetnacl";
import { DiscordInteraction } from "./types";

export async function verifyRequest(request: Request) {
  const signature = request.headers.get("x-signature-ed25519");
  const timestamp = request.headers.get("x-signature-timestamp");

  if (!signature || !timestamp) {
    throw new Error("Missing signature or timestamp");
  }

  const rawBody = await request.text();

  const isVerified = nacl.sign.detached.verify(
    Buffer.from(timestamp + rawBody),
    Buffer.from(signature, "hex"),
    Buffer.from(process.env.DISCORD_PUBLIC_KEY!, "hex")
  );

  if (!isVerified) {
    throw new Error("Invalid signature");
  }

  return JSON.parse(rawBody) as DiscordInteraction;
}
