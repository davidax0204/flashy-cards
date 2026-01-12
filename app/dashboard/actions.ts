"use server";

import { auth } from "@clerk/nextjs/server";
import { getDeckByIdAndUserId, deleteDeckById, updateDeckById } from "@/lib/db/queries/decks";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const deleteDeckSchema = z.object({
  deckId: z.number().int().positive(),
});

type DeleteDeckInput = z.infer<typeof deleteDeckSchema>;

export async function deleteDeck(input: DeleteDeckInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const validated = deleteDeckSchema.parse(input);

  const deck = await getDeckByIdAndUserId(validated.deckId, userId);

  if (!deck) {
    throw new Error("Deck not found or access denied");
  }

  await deleteDeckById(validated.deckId);

  revalidatePath("/dashboard");
}

const updateDeckSchema = z.object({
  deckId: z.number().int().positive(),
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  description: z.string().max(500, "Description is too long").optional(),
});

type UpdateDeckInput = z.infer<typeof updateDeckSchema>;

export async function updateDeck(input: UpdateDeckInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const validated = updateDeckSchema.parse(input);

  const deck = await getDeckByIdAndUserId(validated.deckId, userId);

  if (!deck) {
    throw new Error("Deck not found or access denied");
  }

  await updateDeckById(validated.deckId, {
    name: validated.name,
    description: validated.description,
  });

  revalidatePath("/dashboard");
}


