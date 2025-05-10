"use client";

import { useActionState, useOptimistic, useState } from "react";
import { toast } from "sonner";
import { addDesayuno, updateDesayunoText, Response } from "./actions";

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

function EditDesayunoForm({
  isPending,
  action,
  initialText,
  onCancel,
  image,
  index,
}: {
  isPending: boolean;
  action: (formData: FormData) => void;
  initialText: string;
  onCancel: () => void;
  image: string;
  index: number;
}) {
  return (
    <div className="flex flex-col gap-3">
      <form action={action} className="flex flex-col gap-2">
        <input type="hidden" name="text" value={initialText} />
        <input type="hidden" name="index" value={index} />
        <input
          disabled={isPending}
          type="text"
          name="newText"
          defaultValue={initialText}
          placeholder="Editar texto..."
          className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-gray-200 transition-colors placeholder:text-gray-500 hover:border-gray-600 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-900"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isPending}
            className={`inline-flex h-8 items-center justify-center rounded-md bg-gray-700 px-4 text-sm font-medium text-gray-200 transition-colors duration-150 hover:bg-gray-600 focus:ring-2 focus:ring-gray-600 focus:ring-offset-1 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-500`}
          >
            {isPending ? (
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-500 border-t-gray-200" />
            ) : (
              "Guardar"
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className={`inline-flex h-8 items-center justify-center rounded-md bg-gray-700 px-4 text-sm font-medium text-gray-200 transition-colors duration-150 hover:bg-gray-600 focus:ring-2 focus:ring-gray-600 focus:ring-offset-1 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-500`}
          >
            Cancelar
          </button>
        </div>
      </form>
      <DesayunoPreview src={image} />
    </div>
  );
}

function DesayunoItem({
  text,
  image,
  status = "idle",
  index,
  onEdit,
}: {
  text: string;
  image: string;
  status?: "loading" | "idle";
  index: number;
  onEdit: (index: number) => void;
}) {
  return (
    <div
      className={[
        "rounded-lg border border-gray-700 bg-gray-800 p-3",
        status === "loading" ? "animate-pulse" : "",
      ].join(" ")}
    >
      <div className="mb-2 min-h-[60px]">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-3 flex-1 text-gray-200">
            {splitWords(text).map((part, index) => (
              <Word key={index} word={part} />
            ))}
          </p>
          <button
            onClick={() => onEdit(index)}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
          </button>
        </div>
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

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [, addAction, isAddPending] = useActionState(
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

  const [, updateAction, isUpdatePending] = useActionState(
    async (_prevState: Response, formData: FormData) => {
      const response = await updateDesayunoText(formData);

      if (response.status === "error") {
        console.error(response.message);
        toast.error(response.message);
      } else {
        setEditingIndex(null);
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

          if (editingIndex === index) {
            return (
              <div
                key={index}
                className="rounded-lg border border-gray-700 bg-gray-800 p-3"
              >
                <EditDesayunoForm
                  isPending={isUpdatePending}
                  action={updateAction}
                  initialText={text}
                  onCancel={() => setEditingIndex(null)}
                  image={image}
                  index={index}
                />
              </div>
            );
          }

          return (
            <DesayunoItem
              key={index}
              text={text}
              image={image}
              status={isLoading ? "loading" : "idle"}
              index={index}
              onEdit={setEditingIndex}
            />
          );
        })}
      </div>
      <DesayunoForm isPending={isAddPending} action={addAction} />
    </div>
  );
}
