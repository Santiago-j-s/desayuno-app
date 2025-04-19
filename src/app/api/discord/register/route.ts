import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get("secret");

  if (secret !== process.env.SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const data = await fetch(
    `https://discord.com/api/v10/applications/${process.env
      .APPLICATION_ID!}/guilds/${process.env.DISCORD_GUILD_ID!}/commands`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN!}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          name: "desayuno",
          description: "Muestra una opción para desayunar",
          type: 1,
          options: [],
        },
      ]),
    }
  ).then((res) => res.json());

  return NextResponse.json(data);
}
