import { getTextsFromSheet } from "@/services/sheets";
import { TextLineSkeleton, TextsClient } from "./Texts.client";
import { auth } from "@/services/auth";
import { Suspense } from "react";
import { unstable_ViewTransition as ViewTransition } from "react";

async function TextsData() {
  const session = await auth();

  if (!session) {
    return (
      <div className="text-center text-sm text-red-500">Error: No session</div>
    );
  }

  const texts = await getTextsFromSheet(session.access_token);

  return <TextsClient texts={texts} />;
}

export async function Texts() {
  return (
    <div className="flex w-full flex-col gap-4 rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
      <Suspense>
        <TextsData />
      </Suspense>
    </div>
  );
}
