import { getTextsFromSheet } from "@/services/sheets";
import { TextLineSkeleton, TextsClient, TextsForm } from "./Texts.client";
import { auth } from "@/services/auth";
import { Suspense } from "react";
import { unstable_ViewTransition as ViewTransition } from "react";

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
      <Suspense
        fallback={
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <TextLineSkeleton key={index} />
            ))}
          </>
        }
      >
        {textsData
          .then((texts) => <TextsClient texts={texts} />)
          .catch((error) => (
            <div>Error: {error.message}</div>
          ))}
      </Suspense>
    </div>
  );
}
