"use client";
import { signInWithGoogle } from "./actions";
import { useFormStatus } from "react-dom";
import { useState } from "react";

function LoadingSpinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg
      className="h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
    >
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

function SignInButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? (
        <>
          <LoadingSpinner />
          Signing in...
        </>
      ) : (
        <>
          <GoogleIcon />
          Sign in with Google
        </>
      )}
    </button>
  );
}

export default function SignIn() {
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="mx-auto flex h-full max-w-screen-lg flex-col items-center justify-center gap-4 p-4">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
        <h1 className="text-center text-xl font-semibold text-white">
          Welcome Back
        </h1>
        <p className="text-center text-sm text-gray-400">
          Sign in to your account to continue
        </p>
        <form
          action={async () => {
            const result = await signInWithGoogle();

            if (result?.result === "error") {
              setError("Error signing in with Google");
            }
          }}
          className="flex flex-col gap-4"
        >
          <SignInButton />
          {error && <p className="text-center text-sm text-red-500">{error}</p>}
        </form>
      </div>
    </main>
  );
}
