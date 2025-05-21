import { getRandomItem } from "@/services/discord/commands/desayuno/utils/getRandomItem";
import {
  DiscordInteraction,
  InteractionResponse,
} from "@/services/discord/types";
import { getDesayunos } from "./sheets/getDesayunos";

export async function handleDesayunoCommand(
  body: DiscordInteraction,
): Promise<InteractionResponse> {
  const desayunos = await getDesayunos();

  const desayuno = getRandomItem(desayunos);

  if (process.env.DEBUG_REQUESTS === "true") {
    console.log("\x1b[36m%s\x1b[0m", "desayuno", desayuno);
  }

  return {
    type: 4,
    data: {
      content: desayuno.text.replace(
        "{user}",
        body.member ? `<@${body.member.user.id}>` : "",
      ),
      embeds: [
        {
          image: {
            url: desayuno.image_url,
          },
        },
      ],
    },
  };
}
