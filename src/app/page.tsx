import { Tabs } from "@/components/Tabs";
import { Images } from "./components/Images";
import { Texts } from "./components/Texts";
import { Desayuno } from "./components/Desayuno";

export default async function Home() {
  const tabs = [
    {
      id: "texts",
      label: "Respuestas",
      content: <Texts />,
    },
    {
      id: "images",
      label: "Imágenes",
      content: <Images />,
    },
    {
      id: "desayuno",
      label: "Desayuno",
      content: <Desayuno />,
    },
  ];

  return (
    <main className="mx-auto flex max-w-screen-lg flex-col gap-4 p-4">
      <Tabs tabs={tabs} defaultTab="texts" />
    </main>
  );
}
