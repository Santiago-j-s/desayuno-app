import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

if (!process.env.DESAYUNOS_TSV) {
  throw new Error("DESAYUNOS_TSV is not set");
}

export async function getDesayunos() {
  "use cache";
  cacheTag("desayunos");
  cacheLife("minutes"); // stale: 5 minutes, revalidate: 1 minute, expire: 1 hour

  const desayunos = await fetch(process.env.DESAYUNOS_TSV!).then((res) =>
    res.text(),
  );

  const rows = desayunos.split("\n").map((row) => row.split("\t"));

  return rows.map((row) => ({
    uuid: row[0],
    text: row[1],
    image_url: row[2],
  }));
}
