import { getTextsFromSheet } from "@/services/sheets";
import { TextsClient } from "./Texts.client";
import { auth } from "@/services/auth";
import { Suspense } from "react";

async function getTexts() {
  const session = await auth();

  if (!session) {
    return [];
  }

  return getTextsFromSheet(session.access_token);
}

export async function Texts() {
  const textsData = getTexts();

  return (
    <div className="flex w-full flex-col gap-4 rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
      {/* TODO: Improve fallback */}
      <Suspense fallback={<div>Loading...</div>}>
        {textsData
          .then((texts) => <TextsClient texts={texts} />)
          .catch((error) => (
            <div>Error: {error.message}</div>
          ))}
      </Suspense>
    </div>
  );
}
