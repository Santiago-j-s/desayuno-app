"use client";

import { useActionState, useOptimistic } from "react";
import { toast } from "sonner";
import { addDesayuno, Response } from "./actions";

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

function DesayunoForm({
  isPending,
  action,
}: {
  isPending: boolean;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="flex flex-col gap-2">
      <input
        disabled={isPending}
        type="text"
        name="text"
        placeholder="Agregar nuevo desayuno..."
        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-gray-200 transition-colors placeholder:text-gray-500 hover:border-gray-600 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-900"
      />
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
        className={`inline-flex h-8 items-center justify-center rounded-md bg-gray-700 px-4 text-sm font-medium text-gray-200 transition-colors duration-150 hover:bg-gray-600 focus:ring-2 focus:ring-gray-600 focus:ring-offset-1 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-500`}
      >
        {isPending ? (
          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-500 border-t-gray-200" />
        ) : (
          "Añadir"
        )}
      </button>
    </form>
  );
}

export function DesayunoClient({ desayunos }: { desayunos: string[][] }) {
  const [optimisticDesayunos, addOptimisticDesayuno] = useOptimistic(
    { status: "idle" as "idle" | "loading", desayunos },
    (state, newDesayuno: string[]) => ({
      status: "loading" as const,
      desayunos: [...state.desayunos, newDesayuno],
    }),
  );

  const [, action, isPending] = useActionState(
    async (_prevState: Response, formData: FormData) => {
      const text = formData.get("text") as string;
      const file = formData.get("image") as File;

      if (file) {
        const imageUrl = URL.createObjectURL(file);
        addOptimisticDesayuno([text, imageUrl]);
      }

      const response = await addDesayuno(formData);

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
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {optimisticDesayunos.desayunos.map(([text, image], index) => {
          const isLoading =
            index === optimisticDesayunos.desayunos.length - 1 &&
            optimisticDesayunos.status === "loading";

          return (
            <DesayunoItem
              key={index}
              text={text}
              image={image}
              status={isLoading ? "loading" : "idle"}
            />
          );
        })}
      </div>
      <DesayunoForm isPending={isPending} action={action} />
    </div>
  );
}
