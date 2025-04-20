export interface DiscordInteraction {
  type: number; // 1 = PING, 2 = APPLICATION_COMMAND, etc.
  id: string; // ID de la interacción
  application_id: string; // ID de la aplicación (bot)
  guild_id?: string; // Opcional, solo si el comando se ejecuta en un servidor
  channel_id?: string; // Opcional, si el comando se ejecuta en un canal
  member?: {
    user: {
      id: string;
      username: string;
      discriminator: string;
      avatar?: string;
    };
    roles: string[];
    premium_since?: string;
    permissions: string;
    pending?: boolean;
    nick?: string;
    mute: boolean;
    deaf: boolean;
  };
  user?: {
    id: string;
    username: string;
    discriminator: string;
    avatar?: string;
  };
  token: string;
  version: number;
  data?: {
    id: string;
    name: string;
    type: number;
    options?: {
      name: string;
      type: number;
      value: string | number | boolean;
    }[];
  };
}

export interface DiscordMessage {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    global_name: string;
  };
  timestamp: string;
}

export interface InteractionResponse {
  type: number;
  data?: {
    content?: string;
    embeds?: Array<{
      image?: {
        url: string;
      };
    }>;
  };
}
