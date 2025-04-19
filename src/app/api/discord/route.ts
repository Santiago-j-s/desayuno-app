import { verifyRequest } from "@/services/discord/verifyRequest";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await verifyRequest(request);

  // Handle ping
  if (body.type === 1) {
    return NextResponse.json({ type: 1 });
  }

  // Handle command
  if (body.type === 2) {
    switch (body.data?.name) {
      // get text from TEXT_TSV
      case "desayuno": {
        const texts = await fetch(process.env.TEXTS_TSV!).then((res) =>
          res.text()
        );

        console.log("\x1b[36m%s\x1b[0m", "text", texts);

        console.log("\x1b[36m%s\x1b[0m", "texts", texts.split("\r\n"));

        const text =
          texts.split("\n")[
            Math.floor(Math.random() * texts.split("\n").length)
          ];

        console.log(text);

        const images = await fetch(process.env.IMAGES_TSV!).then((res) =>
          res.text()
        );
        const image =
          images.split("\n")[
            Math.floor(Math.random() * images.split("\n").length)
          ];

        return NextResponse.json({
          type: 4,
          data: {
            content: text,
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
