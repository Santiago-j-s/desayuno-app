interface ImageData {
  title: string;
  description: string;
}

interface UploadResponse {
  status: number;
  success: boolean;
  data: {
    id: string;
    deletehash: string;
    account_id: number | null;
    account_url: string | null;
    ad_type: string | null;
    ad_url: string | null;
    title: string;
    description: string;
    name: string;
    type: `image/${"jpeg" | "jpg" | "png" | "gif"}`;
    width: number;
    height: number;
    size: number;
    views: number;
    section: string | null;
    vote: string | null;
    bandwidth: number;
    animated: boolean;
    favorite: boolean;
    in_gallery: boolean;
    in_most_viral: boolean;
    has_sound: boolean;
    is_ad: boolean;
    nsfw: string | null;
    link: string;
    tags: string[];
    datetime: number;
    mp4: string;
    hls: string;
  };
}

export async function uploadImage(
  image: File,
  data: ImageData,
): Promise<UploadResponse> {
  const formData = new FormData();

  formData.append("image", image);
  formData.append("type", "image");
  formData.append("title", data.title);
  formData.append("description", data.description);

  const response = await fetch("https://api.imgur.com/3/image", {
    method: "POST",
    headers: {
      Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  try {
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Failed to upload image");
  }
}
