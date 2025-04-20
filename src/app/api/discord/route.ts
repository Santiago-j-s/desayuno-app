import { verifyRequest } from "@/services/discord/verifyRequest";
import { unstable_cacheLife as cacheLife } from "next/cache";
import { unstable_cacheTag as cacheTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Get a random item using a cryptographically secure random number generator.
 * Uses modulo bias correction to ensure uniform distribution.
 */
function getRandomItem(array: string[]) {
  // Calculate the largest multiple of array.length that fits in a uint32
  const maxValue = Math.floor((0xffffffff + 1) / array.length) * array.length;

  while (true) {
    const randomBuffer = new Uint32Array(1);
    crypto.getRandomValues(randomBuffer);

    // Reject values that would create modulo bias
    if (randomBuffer[0] >= maxValue) continue;
    return array[randomBuffer[0] % array.length];
  }
}

async function getTexts() {
  "use cache";
  cacheTag("texts");
  cacheLife("minutes"); // stale: 5 minutes, revalidate: 1 minute, expire: 1 hour

  const texts = await fetch(process.env.TEXTS_TSV!).then((res) => res.text());

  return texts.split("\n");
}

async function getImages() {
  "use cache";
  cacheTag("images");
  cacheLife("minutes"); // stale: 5 minutes, revalidate: 1 minute, expire: 1 hour

  const images = await fetch(process.env.IMAGES_TSV!).then((res) => res.text());

  return images.split("\n");
}

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
      // get text from TEXT_TSV
      case "desayuno": {
        const texts = await getTexts();
        const images = await getImages();

        const text = getRandomItem(texts);
        const image = getRandomItem(images);

        if (process.env.DEBUG_REQUESTS === "true") {
          console.log("\x1b[36m%s\x1b[0m", "text", text);
          console.log("\x1b[36m%s\x1b[0m", "image", image);
        }

        return NextResponse.json({
          type: 4,
          data: {
            content: text,
            embeds: [
              {
                image: {
                  url: image,
                },
              },
            ],
          },
        });
      }

      default:
        return new Response("Unknown command", { status: 400 });
    }
  }

  // Handle unknown type
  return new Response("Unknown interaction type", { status: 400 });
}
