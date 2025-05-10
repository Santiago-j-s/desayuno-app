"use client";

import { Fragment, useActionState, useOptimistic, useState } from "react";
import { toast } from "sonner";
import { addDesayuno, updateDesayunoText, Response } from "./actions";
import { unstable_ViewTransition as ViewTransition } from "react";
import { unstable_Activity as Activity } from "react";

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
  onCancel,
  desayuno,
}: {
  isPending: boolean;
  action: (formData: FormData) => void;
  onCancel: () => void;
  desayuno: { text: string; image: string; id: string | null };
}) {
  if (desayuno.id === null) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <form action={action} className="relative flex w-full items-start gap-2">
        <input type="hidden" name="text" value={desayuno.text} />
        <input type="hidden" name="id" value={desayuno.id} />
        <textarea
          disabled={isPending}
          name="newText"
          defaultValue={desayuno.text}
          placeholder="Editar texto..."
          rows={2}
          className="flex-1 resize-none rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-gray-200 transition-colors placeholder:text-gray-500 hover:border-gray-600 focus:border-transparent focus:ring-2 focus:ring-gray-600 focus:ring-offset-1 focus:ring-offset-gray-900 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-900"
        />
        <button
          type="submit"
          disabled={isPending}
          title="Guardar"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-gray-800 text-gray-200 transition-colors duration-150 hover:bg-gray-700 focus:ring-2 focus:ring-gray-600 focus:ring-offset-1 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:bg-gray-900 disabled:text-gray-400"
        >
          {isPending ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-white" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          title="Cancelar"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-gray-800 text-gray-200 transition-colors duration-150 hover:bg-gray-700 focus:ring-2 focus:ring-gray-600 focus:ring-offset-1 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:bg-gray-900 disabled:text-gray-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </form>
      <DesayunoPreview src={desayuno.image} />
    </div>
  );
}

function DesayunoItem({
  desayuno,
  status = "idle",
  onEdit,
}: {
  desayuno: { text: string; image: string; id: string | null };
  status?: "loading" | "idle";
  onEdit: (id: string) => void;
}) {
  const id = desayuno.id;

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
            {splitWords(desayuno.text).map((part, index) => (
              <Word key={index} word={part} />
            ))}
          </p>
          {id !== null && (
            <button
              onClick={() => onEdit(id)}
              className="rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
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
          )}
        </div>
      </div>
      <DesayunoPreview src={desayuno.image} />
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

type DesayunoOptimisticState = {
  desayunos: {
    status: "idle" | "loading";
    id: string | null;
    text: string;
    image: string;
  }[];
};

type DesayunoOptimisticAction =
  | {
      type: "add";
      payload: {
        id: string | null;
        text: string;
        image: string;
      };
    }
  | {
      type: "update";
      payload: {
        id: string;
        text: string;
      };
    };

function useOptimisticDesayunoReducer(
  desayunos: { id: string; text: string; image: string }[],
) {
  return useOptimistic<DesayunoOptimisticState, DesayunoOptimisticAction>(
    {
      desayunos: desayunos.map((desayuno) => ({
        ...desayuno,
        status: "idle",
      })),
    },
    (state, action) => {
      switch (action.type) {
        case "add":
          return {
            desayunos: [
              ...state.desayunos,
              { ...action.payload, status: "loading" },
            ],
          };
        case "update":
          return {
            desayunos: state.desayunos.map((desayuno) =>
              desayuno.id === action.payload.id
                ? { ...desayuno, text: action.payload.text, status: "loading" }
                : desayuno,
            ),
          };
      }
    },
  );
}

export function DesayunoClient({
  desayunos,
}: {
  desayunos: { id: string; text: string; image: string }[];
}) {
  const [optimisticDesayunos, dispatchOptimisticDesayuno] =
    useOptimisticDesayunoReducer(desayunos);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [, addAction, isAddPending] = useActionState(
    async (_prevState: Response, formData: FormData) => {
      const text = formData.get("text") as string;
      const file = formData.get("image") as File;

      if (file) {
        const imageUrl = URL.createObjectURL(file);

        dispatchOptimisticDesayuno({
          type: "add",
          payload: { id: null, text, image: imageUrl },
        });
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
      const id = formData.get("id") as string;
      const text = formData.get("text") as string;

      dispatchOptimisticDesayuno({
        type: "update",
        payload: { id, text },
      });

      const response = await updateDesayunoText(formData);

      if (response.status === "error") {
        console.error(response.message);
        toast.error(response.message);
      } else {
        setEditingId(null);
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
        {optimisticDesayunos.desayunos.map((desayuno) => {
          const isLoading = desayuno.status === "loading";
          const isEditingThisElement =
            editingId !== null && desayuno.id === editingId;

          return (
            <article key={desayuno.id}>
              <Activity mode={isEditingThisElement ? "visible" : "hidden"}>
                <div className="rounded-lg border border-gray-700 bg-gray-800 p-3">
                  <ViewTransition>
                    <EditDesayunoForm
                      isPending={isUpdatePending}
                      action={updateAction}
                      desayuno={desayuno}
                      onCancel={() => setEditingId(null)}
                    />
                  </ViewTransition>
                </div>
              </Activity>
              <Activity mode={isEditingThisElement ? "hidden" : "visible"}>
                <DesayunoItem
                  desayuno={desayuno}
                  status={isLoading ? "loading" : "idle"}
                  onEdit={setEditingId}
                />
              </Activity>
            </article>
          );
        })}
      </div>
      <DesayunoForm isPending={isAddPending} action={addAction} />
    </div>
  );
}
