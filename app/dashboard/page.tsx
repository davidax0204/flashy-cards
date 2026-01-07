import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { decksTable, cardsTable } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { DeckGallery } from "./deck-gallery";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch user's decks with card counts
  const decksWithCounts = await db
    .select({
      id: decksTable.id,
      name: decksTable.name,
      description: decksTable.description,
      updatedAt: decksTable.updatedAt,
      cardsCount: sql<number>`cast(count(${cardsTable.id}) as int)`,
    })
    .from(decksTable)
    .leftJoin(cardsTable, eq(cardsTable.deckId, decksTable.id))
    .where(eq(decksTable.userId, userId))
    .groupBy(decksTable.id)
    .orderBy(sql`${decksTable.updatedAt} desc`);

  return <DeckGallery decks={decksWithCounts} />;
}
