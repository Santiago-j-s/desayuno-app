import { auth } from "@/services/auth";
import { Suspense } from "react";

async function AuthenticatedSegment() {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return <pre>{JSON.stringify(session, null, 2)}</pre>;
}

export default async function Home() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <AuthenticatedSegment />
      </Suspense>
      <table>
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
      </table>
    </main>
  );
}
