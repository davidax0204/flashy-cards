"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { decksTable, cardsTable } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
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

  // Verify ownership before deleting
  const [deck] = await db
    .select()
    .from(decksTable)
    .where(
      and(
        eq(decksTable.id, validated.deckId),
        eq(decksTable.userId, userId)
      )
    );

  if (!deck) {
    throw new Error("Deck not found or access denied");
  }

  // Delete the deck (cards will cascade delete)
  await db
    .delete(decksTable)
    .where(eq(decksTable.id, validated.deckId));

  revalidatePath("/dashboard");
}


