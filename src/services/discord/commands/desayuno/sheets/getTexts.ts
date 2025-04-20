import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export async function getTexts() {
  "use cache";
  cacheTag("texts");
  cacheLife("minutes"); // stale: 5 minutes, revalidate: 1 minute, expire: 1 hour

  const texts = await fetch(process.env.TEXTS_TSV!).then((res) => res.text());
  return texts.split("\n");
}
