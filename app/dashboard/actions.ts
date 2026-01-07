"use server";

import { auth } from "@clerk/nextjs/server";
import { getDeckByIdAndUserId, deleteDeckById } from "@/lib/db/queries/decks";
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


