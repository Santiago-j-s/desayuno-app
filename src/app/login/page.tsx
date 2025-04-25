"use client";
import { useRouter } from "next/navigation";
import { signInWithGoogle } from "./actions";
import { useFormStatus } from "react-dom";
import { signIn } from "@/services/auth";
import { useState } from "react";

function SignInButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Signing in..." : "Signin with Google"}
    </button>
  );
}

export default function SignIn() {
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      action={async () => {
        const result = await signInWithGoogle();

        if (result?.result === "error") {
          setError("Error signing in with Google");
        }
      }}
    >
      <SignInButton />
      {error && <p>{error}</p>}
    </form>
  );
}
