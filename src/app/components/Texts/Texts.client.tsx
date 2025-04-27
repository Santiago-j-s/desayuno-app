"use client";

import { useActionState, useOptimistic } from "react";
import { addText, Response } from "./actions";
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

function TextLine({
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
    "text-gray-200",
    "transition-colors",
    "hover:bg-gray-700",
  ];
  const statusClasses = status === "loading" ? ["animate-pulse"] : [];
  const className = [...classes, ...statusClasses].join(" ");

  return <div className={className}>{children}</div>;
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
    </form>
  );
}

export function TextsClient({ texts }: { texts: string[] }) {
  const [, action, isPending] = useActionState(
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
      {texts.map((row, index) => {
        return (
          <ViewTransition key={index} enter="fade-in">
            <TextLine status={"idle"}>
              {splitWords(row).map((part, index) => (
                <Word key={index} word={part} />
              ))}
            </TextLine>
          </ViewTransition>
        );
      })}
      <TextsForm isPending={isPending} action={action} />
    </>
  );
}
