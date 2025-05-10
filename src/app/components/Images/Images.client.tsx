"use client";

import { useActionState, useOptimistic } from "react";
import { addImage, Response } from "./actions";
import { toast } from "sonner";

function ImagePreview({ src }: { src: string }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
      <picture>
        <source srcSet={src} type="image/webp" />
        <img src={src} alt="Preview" className="h-full w-full object-cover" />
      </picture>
    </div>
  );
}

function ImageContainer({
  status = "idle",
  children,
}: {
  status?: "loading" | "idle";
  children: React.ReactNode;
}) {
  return (
    <div
      className={[
        "rounded-lg border border-gray-700 bg-gray-800 p-3",
        status === "loading" ? "animate-pulse" : "",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function ImagesClient({ images }: { images: string[] }) {
  const [optimisticImages, addOptimisticImage] = useOptimistic(
    { status: "idle" as "idle" | "loading", images },
    (state, newImage: string) => ({
      status: "loading" as const,
      images: [...state.images, newImage],
    }),
  );

  const [, action, isPending] = useActionState(
    async (_prevState: Response, formData: FormData) => {
      const file = formData.get("image") as File;

      if (file) {
        const imageUrl = URL.createObjectURL(file);
        addOptimisticImage(imageUrl);
      }

      const response = await addImage(formData);

      if (response.status === "error") {
        console.error(response.message);
        toast.error(response.message);
      }

      return response;
    },
    {
      status: "idle",
    },
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-3">
        {optimisticImages.images.map((imageUrl, index) => {
          const isLoading =
            index === optimisticImages.images.length - 1 &&
            optimisticImages.status === "loading";

          return (
            <ImageContainer key={index} status={isLoading ? "loading" : "idle"}>
              <ImagePreview src={imageUrl} />
            </ImageContainer>
          );
        })}
      </div>
      <form action={action} className="relative">
        <input
          disabled={isPending}
          type="file"
          name="image"
          accept="image/*"
          className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-gray-200 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-gray-200 hover:border-gray-600 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-900"
        />
        <button
          type="submit"
          disabled={isPending}
          className={`absolute top-1/2 right-2 inline-flex h-8 -translate-y-1/2 items-center justify-center rounded-md bg-gray-700 px-4 text-sm font-medium text-gray-200 transition-colors duration-150 hover:bg-gray-600 focus:ring-2 focus:ring-gray-600 focus:ring-offset-1 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-500`}
        >
          {isPending ? (
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-500 border-t-gray-200" />
          ) : (
            "Añadir"
          )}
        </button>
      </form>
    </div>
  );
}
