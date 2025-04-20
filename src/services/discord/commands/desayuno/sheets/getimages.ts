import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export async function getImages() {
  "use cache";
  cacheTag("images");
  cacheLife("minutes"); // stale: 5 minutes, revalidate: 1 minute, expire: 1 hour

  const images = await fetch(process.env.IMAGES_TSV!).then((res) => res.text());
  return images.split("\n");
}
