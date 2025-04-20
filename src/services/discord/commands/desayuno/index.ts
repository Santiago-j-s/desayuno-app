import { getRandomItem } from "@/services/discord/commands/desayuno/utils/getRandomItem";
import {
  DiscordInteraction,
  InteractionResponse,
} from "@/services/discord/types";
import { getTexts } from "./sheets/getTexts";
import { getImages } from "./sheets/getimages";

export async function handleDesayunoCommand(
  body: DiscordInteraction
): Promise<InteractionResponse> {
  const texts = await getTexts();
  const images = await getImages();

  const text = getRandomItem(texts);
  const image = getRandomItem(images);

  if (process.env.DEBUG_REQUESTS === "true") {
    console.log("\x1b[36m%s\x1b[0m", "text", text);
    console.log("\x1b[36m%s\x1b[0m", "image", image);
  }

  return {
    type: 4,
    data: {
      content: text.replace(
        "{user}",
        body.member ? `<@${body.member.user.id}>` : ""
      ),
      embeds: [
        {
          image: {
            url: image,
          },
        },
      ],
    },
  };
}
