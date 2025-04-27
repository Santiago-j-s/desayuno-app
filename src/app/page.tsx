import { Images } from "./components/Images";
import { Texts } from "./components/Texts";

export default async function Home() {
  return (
    <main className="flex flex-col gap-4 p-4">
      <Texts />
      <Images />
    </main>
  );
}
