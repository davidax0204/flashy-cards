import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDeckByIdAndUserId } from "@/lib/db/queries/decks";
import { getCardsByDeckId } from "@/lib/db/queries/cards";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StudyClient } from "./study-client";

interface StudyPageProps {
  params: Promise<{
    deckId: string;
  }>;
}

export default async function StudyPage({ params }: StudyPageProps) {
  const { deckId } = await params;
  const parsedDeckId = Number(deckId);

  if (!Number.isFinite(parsedDeckId) || !Number.isInteger(parsedDeckId) || parsedDeckId <= 0) {
    return <DeckNotFound />;
  }

  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  // Verify deck ownership
  const deck = await getDeckByIdAndUserId(parsedDeckId, userId);

  if (!deck) {
    return <DeckNotFound />;
  }

  // Get cards for studying
  const cards = await getCardsByDeckId(parsedDeckId);

  if (cards.length === 0) {
    return <NoCardsFound deckId={parsedDeckId} />;
  }

  // Serialize cards for client component
  const serializedCards = cards.map((card) => ({
    id: card.id,
    front: card.front,
    back: card.back,
  }));

  return (
    <div className="min-h-screen bg-background">
      <StudyClient
        deckId={parsedDeckId}
        deckName={deck.name}
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

function NoCardsFound({ deckId }: { deckId: number }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-10 text-center shadow-lg">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          No Cards
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
          This deck is empty
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Add some cards to this deck before starting a study session.
        </p>
        <Link href={`/decks/${deckId}`}>
          <Button className="mt-6">Go to deck</Button>
        </Link>
      </div>
    </div>
  );
}
