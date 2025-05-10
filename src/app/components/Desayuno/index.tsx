import { getDesayunosFromSheet } from "@/services/sheets";
import { auth } from "@/services/auth";
import { Suspense } from "react";
import { DesayunoClient } from "./Desayuno.client";

async function getDesayuno() {
  const session = await auth();

  if (!session) {
    return [];
  }

  console.log(session.access_token);

  return getDesayunosFromSheet(session.access_token);
}

export async function Desayuno() {
  const desayunoData = getDesayuno();

  return (
    <div className="flex w-full flex-col gap-4 rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
      <Suspense fallback={<div>Loading...</div>}>
        {desayunoData
          .then((desayunos) => <DesayunoClient desayunos={desayunos} />)
          .catch((error) => (
            <div className="text-sm font-bold text-red-400">
              {error instanceof Error ? error.message : "Unknown error"}
            </div>
          ))}
      </Suspense>
    </div>
  );
}
