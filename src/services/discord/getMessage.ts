export async function getMessage(
  messageId: string,
  channelId: string = process.env.DEFAULT_CHANNEL_ID!
): Promise<DiscordMessage> {
  const url = `https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "No error body");

    throw new Error(
      `Failed to fetch message: ${response.status} ${response.statusText}\n` +
        `Channel ID: ${process.env.DISCORD_GUILD_ID}\n` +
        `Message ID: ${messageId}\n` +
        `Error body: ${errorBody}`
    );
  }

  const message = await response.json();

  return message;
}
