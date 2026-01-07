import { db } from "@/lib/db";
import { decksTable, cardsTable } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function getDeckByIdAndUserId(deckId: number, userId: string) {
  const [deck] = await db
    .select()
    .from(decksTable)
    .where(and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)));

  return deck;
}

export async function getDecksWithCardCountsByUserId(userId: string) {
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

  return decksWithCounts;
}

export async function deleteDeckById(deckId: number) {
  await db.delete(decksTable).where(eq(decksTable.id, deckId));
}

