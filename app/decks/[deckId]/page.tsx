import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getDeckByIdAndUserId } from "@/lib/db/queries/decks";
import { getCardsByDeckId } from "@/lib/db/queries/cards";
import { DeckCardsClient } from "./deck-cards-client";
import { SerializedCard } from "./page-types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface DeckDetailsPageProps {
  params: Promise<{
    deckId: string;
  }>;
}

export default async function DeckDetailsPage({ params }: DeckDetailsPageProps) {
  const { deckId } = await params;
  const parsedDeckId = Number(deckId);

  if (!Number.isFinite(parsedDeckId) || !Number.isInteger(parsedDeckId) || parsedDeckId <= 0) {
    return <DeckNotFound />;
  }

  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const deck = await getDeckByIdAndUserId(parsedDeckId, userId);

  if (!deck) {
    return <DeckNotFound />;
  }

  const cards = await getCardsByDeckId(deck.id);

  const serializedCards: SerializedCard[] = cards.map((card) => ({
    id: card.id,
    deckId: card.deckId,
    front: card.front,
    back: card.back,
    createdAt: card.createdAt.toISOString(),
    updatedAt: card.updatedAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-background">
      <DeckCardsClient
        deckId={deck.id}
        deckName={deck.name}
        deckDescription={deck.description ?? "Study and manage your cards"}
        cards={serializedCards}
      />
    </div>
  );
}

function DeckNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-10 text-center shadow-lg">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Oops
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
          Deck not found
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Either that deck has been deleted or you don&apos;t have access to it.
        </p>
        <Link href="/dashboard">
          <Button className="mt-6">Back to dashboard</Button>
        </Link>
      </div>
    </div>
  );
}

