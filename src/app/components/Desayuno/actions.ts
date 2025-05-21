"use server";

import { auth } from "@/services/auth";
import {
  deleteDesayunoFromSheet,
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

    const newDesayuno = {
      id: "",
      text,
      image: uploadResponse.data.link,
    };

    const newValues = [
      ...desayunos.map(
        ({ id, text, image }) =>
          [id, text, image] satisfies [string, string, string],
      ),
      [newDesayuno.id, newDesayuno.text, newDesayuno.image] satisfies [
        string,
        string,
        string,
      ],
    ];

    await updateDesayunosInSheet(session.access_token, newValues);

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
  const editingId = formData.get("id");

  if (!newText) {
    return { status: "error", message: "Texto requerido" };
  }

  if (typeof newText !== "string") {
    return { status: "error", message: "Texto debe ser un string" };
  }

  if (typeof editingId !== "string") {
    return { status: "error", message: "Id inválido" };
  }

  try {
    if (!session) {
      return { status: "error", message: "No session" };
    }

    const desayunos = await getDesayunosFromSheet(session.access_token);

    const desayuno = desayunos.find(({ id }) => id === editingId);

    if (!desayuno) {
      return { status: "error", message: "Desayuno no encontrado" };
    }

    await updateDesayunosInSheet(
      session.access_token,
      desayunos.map(({ id, text, image }) => {
        if (id === editingId) {
          return [id, newText, image];
        }

        return [id, text, image];
      }),
    );

    return { status: "success", message: "Desayuno actualizado" };
  } catch (error) {
    if (error instanceof Error) {
      return { status: "error", message: error.message };
    }

    console.error(error);

    return { status: "error", message: "Error al actualizar desayuno" };
  }
}

export async function deleteDesayuno(formData: FormData): Promise<Response> {
  const session = await auth();
  const deletingId = formData.get("id");

  if (typeof deletingId !== "string") {
    return { status: "error", message: "Id inválido" };
  }

  try {
    if (!session) {
      return { status: "error", message: "No session" };
    }

    await deleteDesayunoFromSheet(session.access_token, deletingId);

    return { status: "success", message: "Desayuno eliminado" };
  } catch (error) {
    if (error instanceof Error) {
      return { status: "error", message: error.message };
    }

    console.error(error);

    return { status: "error", message: "Error al eliminar desayuno" };
  }
}
