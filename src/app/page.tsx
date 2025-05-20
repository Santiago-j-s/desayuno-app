import { Tabs } from "@/components/Tabs";
import { Desayuno } from "./components/Desayuno";

export default async function Home() {
  const tabs = [
    {
      id: "desayuno",
      label: "Desayunos",
      content: <Desayuno />,
    },
  ];

  return (
    <main className="mx-auto flex max-w-screen-lg flex-col gap-4 p-4">
      <Tabs tabs={tabs} defaultTab="desayuno" />
    </main>
  );
}
