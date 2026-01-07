"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Columns, List } from "lucide-react";

interface DeckHeaderProps {
  deckName: string;
  deckDescription: string;
  onAddCardClick: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  viewMode: "gallery" | "compact";
  onViewModeChange: (mode: "gallery" | "compact") => void;
  cardsCount?: number;
}

export function DeckHeader({
  deckName,
  deckDescription,
  onAddCardClick,
  search,
  onSearchChange,
  viewMode,
  onViewModeChange,
  cardsCount,
}: DeckHeaderProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Deck
          </p>
          <h1 className="mt-1 text-4xl font-bold tracking-tight">{deckName}</h1>
          <p className="mt-1 text-lg text-muted-foreground">
            {deckDescription}
          </p>
        </div>
        <Button size="lg" onClick={onAddCardClick}>
          <Plus className="mr-2 h-5 w-5" />
          Add Card
        </Button>
      </div>

      <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-border bg-card/70 p-4 shadow-sm shadow-muted-foreground/10 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search cards..."
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2 whitespace-nowrap">
          <Button
            variant={viewMode === "gallery" ? "default" : "outline"}
            size="sm"
            className="flex items-center gap-1"
            onClick={() => onViewModeChange("gallery")}
          >
            <Columns className="h-4 w-4" />
            Gallery
          </Button>
          <Button
            variant={viewMode === "compact" ? "default" : "outline"}
            size="sm"
            className="flex items-center gap-1"
            onClick={() => onViewModeChange("compact")}
          >
            <List className="h-4 w-4" />
            Compact
          </Button>
        </div>

        {cardsCount !== undefined && (
          <span className="ml-auto text-sm font-medium text-muted-foreground">
            {cardsCount} {cardsCount === 1 ? "card" : "cards"}
          </span>
        )}
      </div>
    </section>
  );
}

