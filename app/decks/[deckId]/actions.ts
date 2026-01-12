"use server";

import { auth } from "@clerk/nextjs/server";
import { getDeckByIdAndUserId } from "@/lib/db/queries/decks";
import { createCard, deleteCardById, updateCardById } from "@/lib/db/queries/cards";
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

  const deck = await getDeckByIdAndUserId(validated.deckId, userId);

  if (!deck) {
    throw new Error("Deck not found or access denied");
  }

  await createCard({
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

  const deck = await getDeckByIdAndUserId(validated.deckId, userId);

  if (!deck) {
    throw new Error("Deck not found or access denied");
  }

  await deleteCardById(validated.cardId, validated.deckId);

  revalidatePath(`/decks/${validated.deckId}`);
}

const updateCardSchema = z.object({
  deckId: z.number().int().positive(),
  cardId: z.number().int().positive(),
  front: z.string().min(1, "Front is required").max(2000, "Front is too long"),
  back: z.string().min(1, "Back is required").max(2000, "Back is too long"),
});

export type UpdateCardInput = z.infer<typeof updateCardSchema>;

export async function updateDeckCard(input: UpdateCardInput) {
  const validated = updateCardSchema.parse(input);
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const deck = await getDeckByIdAndUserId(validated.deckId, userId);

  if (!deck) {
    throw new Error("Deck not found or access denied");
  }

  await updateCardById(validated.cardId, validated.deckId, {
    front: validated.front.trim(),
    back: validated.back.trim(),
  });

  revalidatePath(`/decks/${validated.deckId}`);
}

