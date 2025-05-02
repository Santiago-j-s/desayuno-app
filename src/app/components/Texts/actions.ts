"use server";

import { auth } from "@/services/auth";
import { getTextsFromSheet, updateTextsInSheet } from "@/services/sheets";

interface SuccessResponse {
  status: "success";
  message: string;
}

interface ErrorResponse {
  status: "error";
  message: string;
}

interface Idle {
  status: "idle";
}

export type Response = SuccessResponse | ErrorResponse | Idle;

export async function addText(formData: FormData): Promise<Response> {
  const session = await auth();

  const text = formData.get("text");

  if (!text) {
    return { status: "error", message: "Texto requerido" };
  }

  if (typeof text !== "string") {
    return { status: "error", message: "Texto debe ser un string" };
  }

  try {
    if (!session) {
      return { status: "error", message: "No session" };
    }

    const texts = await getTextsFromSheet(session.access_token);
    const newTexts = [...texts, { key: `${texts.length}-${text}`, text }];

    await updateTextsInSheet(session.access_token, newTexts);

    return { status: "success", message: "Texto añadido" };
  } catch (error) {
    if (error instanceof Error) {
      return { status: "error", message: error.message };
    }

    console.error(error);

    return { status: "error", message: "Error al añadir respuesta" };
  }
}

export async function deleteText(formData: FormData): Promise<Response> {
  const session = await auth();

  const textIndex = formData.get("text-index");

  if (!textIndex) {
    return { status: "error", message: "Índice de texto requerido" };
  }

  if (typeof textIndex !== "string") {
    return { status: "error", message: "Índice de texto debe ser un string" };
  }

  try {
    if (!session) {
      return { status: "error", message: "No session" };
    }

    const texts = await getTextsFromSheet(session.access_token);

    const textIndexNumber = parseInt(textIndex);
    const textToDelete = texts[textIndexNumber];

    await updateTextsInSheet(
      session.access_token,
      texts.map(({ key, text }) => {
        if (key === textToDelete.key) {
          return { key: `${key}-${textToDelete.text}`, text: "" };
        }

        return { key, text };
      }),
    );

    return { status: "success", message: "Texto eliminado" };
  } catch (error) {
    if (error instanceof Error) {
      return { status: "error", message: error.message };
    }

    console.error(error);

    return { status: "error", message: "Error al eliminar respuesta" };
  }
}
