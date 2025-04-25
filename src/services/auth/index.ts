import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    error?: "RefreshTokenError";
    access_token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token: string;
    expires_at: number;
    refresh_token?: string;
    error?: "RefreshTokenError";
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          // google adheres to the openid connect spec so it always requires the openid scope
          // https://developers.google.com/identity/protocols/oauth2/openid-connect#scope-param
          scope:
            "openid email profile https://www.googleapis.com/auth/spreadsheets",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }): Promise<JWT> {
      if (process.env.DEBUG_AUTH === "true") {
        console.log(
          `\x1b[36m[AUTH] jwt ${JSON.stringify(token)} ${JSON.stringify(
            account
          )}\x1b[0m`
        );
      }

      const now = Date.now();
      const expiresAt = token.expires_at * 1000;

      // First-time login, save the `access_token`, its expiry and the `refresh_token`
      if (account) {
        if (
          !account.access_token ||
          !account.expires_at ||
          !account.refresh_token
        ) {
          throw new TypeError("Missing account details");
        }

        return {
          ...token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
        } as const;
      }

      // Subsequent logins, but the `access_token` is still valid
      if (now < expiresAt) {
        return token;
      }

      // Subsequent logins, but the `access_token` has expired, try to refresh it
      if (!token.refresh_token) {
        throw new TypeError("Missing refresh_token");
      }

      try {
        const response = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          body: new URLSearchParams({
            client_id: process.env.AUTH_GOOGLE_ID!,
            client_secret: process.env.AUTH_GOOGLE_SECRET!,
            grant_type: "refresh_token",
            refresh_token: token.refresh_token!,
          }),
        });

        const tokensOrError = await response.json();

        if (!response.ok) {
          throw tokensOrError;
        }

        const newTokens = tokensOrError as {
          access_token: string;
          expires_in: number;
          refresh_token?: string;
        };

        return {
          ...token,
          access_token: newTokens.access_token,
          expires_at: Math.floor(now / 1000 + newTokens.expires_in),
          // Some providers only issue refresh tokens once, so preserve if we did not get a new one
          refresh_token: newTokens.refresh_token
            ? newTokens.refresh_token
            : token.refresh_token,
        } as const;
      } catch (error) {
        console.error("Error refreshing access_token", error);
        // If we fail to refresh the token, return an error so we can handle it on the page
        token.error = "RefreshTokenError";
        return token;
      }
    },
    async signIn({ user, account, profile, email, credentials }) {
      if (process.env.DEBUG_AUTH === "true") {
        console.log(
          `\x1b[36m[AUTH] signIn ${JSON.stringify(user)} ${JSON.stringify(
            account
          )} ${JSON.stringify(profile)} ${JSON.stringify(
            email
          )} ${JSON.stringify(credentials)}\x1b[0m`
        );
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      if (process.env.DEBUG_AUTH === "true") {
        console.log(
          `\x1b[36m[AUTH] redirect ${JSON.stringify(url)} ${JSON.stringify(
            baseUrl
          )}\x1b[0m`
        );
      }

      if (!url && !baseUrl) {
        return "/";
      }

      if (url) {
        return url;
      }

      // Allows relative callback URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) {
        return url;
      }

      return baseUrl;
    },
    async session({ session, token }) {
      if (process.env.DEBUG_AUTH === "true") {
        console.log(
          `\x1b[36m[AUTH] session ${JSON.stringify(session)} ${JSON.stringify(
            token
          )}\x1b[0m`
        );
      }
      session.error = token.error;
      session.access_token = token.access_token;
      return session;
    },
  },
  debug: process.env.DEBUG_AUTH === "true",
});
