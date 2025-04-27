"use client";

import { useActionState, useOptimistic } from "react";
import { addText, deleteText, Response } from "./actions";
import { toast } from "sonner";
import { unstable_ViewTransition as ViewTransition } from "react";

function splitWords(text: string) {
  return text.split(/(\s+|[.,!?])/);
}

function Word({ word }: { word: string }) {
  return (
    <span className={word === "{user}" ? "text-blue-400" : ""}>{word}</span>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-400 hover:text-red-500"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function TextLine({
  status = "idle",
  children,
  index,
}: {
  status?: "loading" | "idle";
  children: React.ReactNode;
  index: string;
}) {
  const classes = [
    "rounded-lg",
    "border",
    "border-gray-700",
    "bg-gray-800",
    "p-3",
    "text-gray-200",
    "transition-colors",
    "hover:bg-gray-700",
    "group",
    "relative",
    "min-h-[50px]",
  ];

  const [, deleteAction, isDeletePending] = useActionState(
    async (_prevState: Response, formData: FormData) => {
      const response = await deleteText(formData);

      if (response.status === "error") {
        toast.error(response.message);
      }

      return response;
    },
    {
      status: "idle",
    },
  );

  const statusClasses =
    status === "loading" || isDeletePending ? ["animate-pulse"] : [];
  const className = [...classes, ...statusClasses].join(" ");

  return (
    <div className={className}>
      {children}
      <form action={deleteAction}>
        <button
          value={index}
          name="text-index"
          type="submit"
          disabled={isDeletePending}
          className="absolute top-1/2 right-2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
        >
          {isDeletePending ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
          ) : (
            <TrashIcon />
          )}
        </button>
      </form>
    </div>
  );
}

export function TextLineSkeleton() {
  return (
    <ViewTransition>
      <div className="min-h-[50px] animate-pulse rounded-lg border border-gray-700 bg-gray-800 p-3 text-gray-200 transition-colors hover:bg-gray-700" />
    </ViewTransition>
  );
}

export function TextsForm({
  isPending,
  action,
}: {
  isPending: boolean;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="relative">
      <input
        disabled={isPending}
        type="text"
        name="text"
        placeholder="Agregar nueva respuesta..."
        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-gray-200 transition-colors placeholder:text-gray-500 hover:border-gray-600 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-900"
      />
      {isPending && (
        <div className="absolute top-1/2 right-3 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
        </div>
      )}
    </form>
  );
}

export function TextsClient({
  texts,
}: {
  texts: { key: string; text: string }[];
}) {
  const [, addAction, isAddPending] = useActionState(
    async (_prevState: Response, formData: FormData) => {
      const response = await addText(formData);

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
    <>
      {texts.map(({ key, text }) => {
        return (
          <ViewTransition key={key} enter="fade-in">
            <TextLine index={key}>
              {splitWords(text).map((part, index) => (
                <Word key={index} word={part} />
              ))}
            </TextLine>
          </ViewTransition>
        );
      })}
      <TextsForm isPending={isAddPending} action={addAction} />
    </>
  );
}
