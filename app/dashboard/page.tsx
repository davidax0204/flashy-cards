import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDecksWithCardCountsByUserId } from "@/lib/db/queries/decks";
import { DeckGallery } from "./deck-gallery";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const decksWithCounts = await getDecksWithCardCountsByUserId(userId);

  return <DeckGallery decks={decksWithCounts} />;
}
