import { db } from "@/lib/db";
import { cardsTable } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function getCardsByDeckId(deckId: number) {
  const cards = await db
    .select()
    .from(cardsTable)
    .where(eq(cardsTable.deckId, deckId))
    .orderBy(sql`${cardsTable.updatedAt} desc`);

  return cards;
}

export async function createCard(data: {
  deckId: number;
  front: string;
  back: string;
}) {
  await db.insert(cardsTable).values({
    deckId: data.deckId,
    front: data.front,
    back: data.back,
  });
}

export async function deleteCardById(cardId: number, deckId: number) {
  await db
    .delete(cardsTable)
    .where(and(eq(cardsTable.id, cardId), eq(cardsTable.deckId, deckId)));
}

