import { getImagesFromSheet } from "@/services/sheets";
import { ImagesClient } from "./Images.client";
import { auth } from "@/services/auth";
import { Suspense } from "react";

async function getImages() {
  const session = await auth();

  if (!session) {
    return [];
  }

  return getImagesFromSheet(session.access_token);
}

export async function Images() {
  const imagesData = getImages();

  return (
    <div className="flex w-full flex-col gap-4 rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
      <Suspense fallback={<div>Loading...</div>}>
        {imagesData
          .then((images) => <ImagesClient images={images} />)
          .catch((error) => (
            <div>Error: {error.message}</div>
          ))}
      </Suspense>
    </div>
  );
}
