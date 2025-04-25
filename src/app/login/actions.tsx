"use server";

import { signIn } from "@/services/auth";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

interface SignInWithGoogleResult {
  result: "error";
}

export async function signInWithGoogle(): Promise<SignInWithGoogleResult | void> {
  try {
    await signIn("google", {
      redirectTo: "/",
    });
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof AuthError) {
      console.error(
        `\x1b[31m[LOGIN] signInWithGoogle ${JSON.stringify(error)}\x1b[0m`
      );

      return { result: "error" };
    }

    if (error instanceof Error) {
      console.error(
        `\x1b[31m[LOGIN] signInWithGoogle ${JSON.stringify(error)}\x1b[0m`
      );

      return { result: "error" };
    }

    throw error;
  }
}
