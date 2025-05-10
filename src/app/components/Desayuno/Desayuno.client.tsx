"use client";

import { useActionState, useOptimistic } from "react";
import { toast } from "sonner";

function DesayunoPreview({ src }: { src: string }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
      <picture>
        <source srcSet={src} type="image/webp" />
        <img src={src} alt="Preview" className="h-full w-full object-cover" />
      </picture>
    </div>
  );
}

function DesayunoContainer({
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

function splitWords(text: string) {
  return text.split(/(\s+|[.,!?])/);
}

function Word({ word }: { word: string }) {
  return (
    <span className={word === "{user}" ? "font-semibold text-blue-400" : ""}>
      {word}
    </span>
  );
}

function DesayunoItem({
  text,
  image,
  status = "idle",
}: {
  text: string;
  image: string;
  status?: "loading" | "idle";
}) {
  return (
    <div
      className={[
        "rounded-lg border border-gray-700 bg-gray-800 p-3",
        status === "loading" ? "animate-pulse" : "",
      ].join(" ")}
    >
      <div className="mb-2 min-h-[60px]">
        <p className="line-clamp-3 text-gray-200">
          {splitWords(text).map((part, index) => (
            <Word key={index} word={part} />
          ))}
        </p>
      </div>
      <DesayunoPreview src={image} />
    </div>
  );
}

export function DesayunoClient({ desayunos }: { desayunos: string[][] }) {
  // const [optimisticDesayunos, addOptimisticDesayuno] = useOptimistic(
  //   { status: "idle" as "idle" | "loading", desayunos },
  //   (state, desayuno: string[]) => ({
  //     status: "loading" as const,
  //     desayunos: [...state.desayunos, desayuno],
  //   }),
  // );

  // const [, action, isPending] = useActionState(
  //   async (_prevState: Response, formData: FormData) => {
  //     const file = formData.get("image") as File;

  //     if (file) {
  //       const imageUrl = URL.createObjectURL(file);
  //       addOptimisticImage(imageUrl);
  //     }

  //     const response = await addImage(formData);

  //     if (response.status === "error") {
  //       console.error(response.message);
  //       toast.error(response.message);
  //     }

  //     return response;
  //   },
  //   {
  //     status: "idle",
  //   },
  // );

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {desayunos.map(([text, image], index) => (
          <DesayunoItem key={index} text={text} image={image} />
        ))}
      </div>
    </div>
  );
}
