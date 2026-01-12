import { Suspense } from "react";
import { getDecksWithCardCountsByUserId } from "@/lib/db/queries/decks";
import { DeckCard } from "./deck-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Layers } from "lucide-react";

async function DeckGridData({ userId }: { userId: string }) {
  const decks = await getDecksWithCardCountsByUserId(userId);

  if (decks.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
      {decks.map((deck) => (
        <DeckCard key={deck.id} deck={deck} />
      ))}
    </div>
  );
}

function DeckGridLoading() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="group relative h-full">
          {/* Stack shadows */}
          <div className="absolute left-2 top-2 h-full w-full rounded-lg border border-border bg-card opacity-40" />
          <div className="absolute left-1 top-1 h-full w-full rounded-lg border border-border bg-card opacity-70" />

          {/* Main card skeleton */}
          <div className="relative flex h-full flex-col rounded-lg border border-border bg-card p-6">
            <Skeleton className="mb-1 h-7 w-3/4" />
            <div className="mb-4 flex items-center gap-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-2" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="mb-4 flex-grow">
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-md border-border p-12 text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-primary/10 p-6">
            <Layers className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h3 className="mb-2 text-2xl font-semibold tracking-tight">
          No decks yet
        </h3>
        <p className="mb-6 text-muted-foreground">
          Create your first deck to start mastering new knowledge with flashcards.
        </p>
        <Button size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Create your first deck
        </Button>
      </Card>
    </div>
  );
}

export function DeckGrid({ userId }: { userId: string }) {
  return (
    <Suspense fallback={<DeckGridLoading />}>
      <DeckGridData userId={userId} />
    </Suspense>
  );
}

