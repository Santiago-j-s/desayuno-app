"use client";

import { useActionState, useOptimistic } from "react";
import { addImage, Response } from "./actions";
import { toast } from "sonner";

function ImagePreview({ src }: { src: string }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
      <img src={src} alt="Preview" className="h-full w-full object-cover" />
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
  const classes = [
    "rounded-lg",
    "border",
    "border-gray-700",
    "bg-gray-800",
    "p-3",
    "transition-colors",
    "hover:bg-gray-700",
  ];
  const statusClasses = status === "loading" ? ["animate-pulse"] : [];
  const className = [...classes, ...statusClasses].join(" ");

  return <div className={className}>{children}</div>;
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
          className={`absolute top-1/2 right-2 -translate-y-1/2 rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold shadow transition duration-150 ease-in-out hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-300`}
        >
          Añadir
        </button>
      </form>
    </div>
  );
}
