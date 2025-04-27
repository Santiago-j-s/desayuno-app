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

    await updateTextsInSheet(session.access_token, [...texts, text]);

    return { status: "success", message: "Texto añadido" };
  } catch (error) {
    if (error instanceof Error) {
      return { status: "error", message: error.message };
    }

    console.error(error);

    return { status: "error", message: "Error al añadir respuesta" };
  }
}
