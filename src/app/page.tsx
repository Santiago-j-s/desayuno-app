import { Suspense } from "react";
import { Texts } from "./components/Texts";

function Images({ images }: { images: string[] }) {
  return (
    <div>
      {/* {images.map((row) => (
        <img key={row} src={row} alt={row} />
      ))} */}
    </div>
  );
}

async function AuthenticatedSegment() {
  // const session = await auth();

  // if (!session) {
  //   return <div>Not authenticated</div>;
  // }

  // const imagesData = await getImagesFromSheet(session.access_token);

  return (
    <div>
      <Texts />
      {/* <Images images={imagesData} /> */}
    </div>
  );
}

export default async function Home() {
  return (
    <main className="flex flex-col gap-4 p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <AuthenticatedSegment />
      </Suspense>
    </main>
  );
}
