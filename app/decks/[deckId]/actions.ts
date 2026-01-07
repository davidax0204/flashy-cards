"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { decksTable, cardsTable } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const addCardSchema = z.object({
  deckId: z.number().int().positive(),
  front: z.string().min(1).max(2000),
  back: z.string().min(1).max(2000),
});

export type AddCardInput = z.infer<typeof addCardSchema>;

export async function addDeckCard(input: AddCardInput) {
  const validated = addCardSchema.parse(input);
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const [deck] = await db
    .select()
    .from(decksTable)
    .where(
      and(eq(decksTable.id, validated.deckId), eq(decksTable.userId, userId))
    );

  if (!deck) {
    throw new Error("Deck not found or access denied");
  }

  await db.insert(cardsTable).values({
    deckId: validated.deckId,
    front: validated.front.trim(),
    back: validated.back.trim(),
  });

  revalidatePath(`/decks/${validated.deckId}`);
}

const deleteCardSchema = z.object({
  deckId: z.number().int().positive(),
  cardId: z.number().int().positive(),
});

export type DeleteCardInput = z.infer<typeof deleteCardSchema>;

export async function deleteDeckCard(input: DeleteCardInput) {
  const validated = deleteCardSchema.parse(input);
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const [deck] = await db
    .select()
    .from(decksTable)
    .where(
      and(eq(decksTable.id, validated.deckId), eq(decksTable.userId, userId))
    );

  if (!deck) {
    throw new Error("Deck not found or access denied");
  }

  await db
    .delete(cardsTable)
    .where(
      and(
        eq(cardsTable.id, validated.cardId),
        eq(cardsTable.deckId, validated.deckId)
      )
    );

  revalidatePath(`/decks/${validated.deckId}`);
}

