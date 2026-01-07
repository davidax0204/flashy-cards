"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import type { SerializedCard } from "./page-types";

interface CardsDisplayProps {
  cards: SerializedCard[];
  search: string;
  viewMode: "gallery" | "compact";
  onAddCardClick: () => void;
  onDeleteCardClick: (card: SerializedCard) => void;
}

export function CardsDisplay({
  cards,
  search,
  viewMode,
  onAddCardClick,
  onDeleteCardClick,
}: CardsDisplayProps) {
  const filteredCards = useMemo(() => {
    if (!search.trim()) {
      return cards;
    }

    const needle = search.trim().toLowerCase();

    return cards.filter(
      (card) =>
        card.front.toLowerCase().includes(needle) ||
        card.back.toLowerCase().includes(needle)
    );
  }, [cards, search]);

  const galleryClasses =
    viewMode === "gallery"
      ? "columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4"
      : "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";

  if (filteredCards.length === 0 && cards.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 pb-10">
        <Card className="border-dashed border-border bg-muted-foreground/5 p-10 text-center">
          <p className="text-xl font-semibold text-foreground">No cards yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Add your first flashcard to begin the study flow.
          </p>
          <Button
            className="mt-6 inline-flex items-center justify-center"
            size="sm"
            onClick={onAddCardClick}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add card
          </Button>
        </Card>
      </div>
    );
  }

  if (filteredCards.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 pb-10">
        <Card className="border-dashed border-border bg-muted-foreground/5 p-10 text-center">
          <p className="text-xl font-semibold text-foreground">No cards found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your search term.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pb-10">
      <div className={cn("w-full", galleryClasses)}>
        {filteredCards.map((card) => (
          <article
            key={card.id}
            className="break-inside-avoid mb-6 rounded-3xl border border-border bg-card/80 p-5 shadow-[0_15px_45px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                    Front
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground">
                    {card.front}
                  </p>
                </div>
                <div className="h-px w-full bg-muted-foreground/20" />
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                    Back
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {card.back}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => onDeleteCardClick(card)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-6 text-xs text-muted-foreground">
              <span>Updated {formatRelative(card.updatedAt)}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function formatRelative(timestamp: string) {
  const date = new Date(timestamp);
  const now = Date.now();
  const diffMs = now - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
}

