"use server";

import { auth } from "@/services/auth";
import { getImagesFromSheet, updateImagesInSheet } from "@/services/sheets";

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

export async function addImage(formData: FormData): Promise<Response> {
  const session = await auth();

  const image = formData.get("image");

  if (!image) {
    return { status: "error", message: "Imagen requerida" };
  }

  if (!(image instanceof File)) {
    return { status: "error", message: "Debe ser un archivo de imagen" };
  }

  try {
    if (!session) {
      return { status: "error", message: "No session" };
    }

    // TODO: Upload image to imgur
    // For now, we'll just store a placeholder URL
    const imageUrl = "https://placeholder.com/image.jpg";

    const images = await getImagesFromSheet(session.access_token);
    await updateImagesInSheet(session.access_token, [...images, imageUrl]);

    return { status: "success", message: "Imagen añadida" };
  } catch (error) {
    if (error instanceof Error) {
      return { status: "error", message: error.message };
    }

    console.error(error);

    return { status: "error", message: "Error al añadir imagen" };
  }
}
