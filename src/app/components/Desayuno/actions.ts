"use server";

import { auth } from "@/services/auth";
import {
  getDesayunosFromSheet,
  updateDesayunosInSheet,
} from "@/services/sheets";
import { uploadImage } from "@/services/imgur";

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

export async function addDesayuno(formData: FormData): Promise<Response> {
  const session = await auth();

  const text = formData.get("text");
  const image = formData.get("image");

  if (!text) {
    return { status: "error", message: "Texto requerido" };
  }

  if (!image) {
    return { status: "error", message: "Imagen requerida" };
  }

  if (typeof text !== "string") {
    return { status: "error", message: "Texto debe ser un string" };
  }

  if (!(image instanceof File)) {
    return { status: "error", message: "Debe ser un archivo de imagen" };
  }

  try {
    if (!session) {
      return { status: "error", message: "No session" };
    }

    const uploadResponse = await uploadImage(image, {
      title: "Desayuno upload",
      description: "This is a desayuno image upload in Imgur",
    });

    const desayunos = await getDesayunosFromSheet(session.access_token);

    await updateDesayunosInSheet(session.access_token, [
      ...desayunos,
      [text, uploadResponse.data.link],
    ]);

    return { status: "success", message: "Desayuno añadido" };
  } catch (error) {
    if (error instanceof Error) {
      return { status: "error", message: error.message };
    }

    console.error(error);

    return { status: "error", message: "Error al añadir desayuno" };
  }
}

export async function updateDesayunoText(
  formData: FormData,
): Promise<Response> {
  const session = await auth();
  const newText = formData.get("newText");
  const index = formData.get("index");

  if (!newText) {
    return { status: "error", message: "Texto requerido" };
  }

  if (typeof newText !== "string") {
    return { status: "error", message: "Texto debe ser un string" };
  }

  if (typeof index !== "string") {
    return { status: "error", message: "Índice inválido" };
  }

  try {
    if (!session) {
      return { status: "error", message: "No session" };
    }

    const desayunos = await getDesayunosFromSheet(session.access_token);
    const indexNum = parseInt(index, 10);

    if (isNaN(indexNum) || indexNum < 0 || indexNum >= desayunos.length) {
      return { status: "error", message: "Índice inválido" };
    }

    desayunos[indexNum][0] = newText;

    await updateDesayunosInSheet(session.access_token, desayunos);

    return { status: "success", message: "Desayuno actualizado" };
  } catch (error) {
    if (error instanceof Error) {
      return { status: "error", message: error.message };
    }

    console.error(error);

    return { status: "error", message: "Error al actualizar desayuno" };
  }
}
