"use client";

import { FormEvent, useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { addDeckCard, deleteDeckCard } from "./actions";
import type { SerializedCard } from "./page-types";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Plus, Search, Columns, List, Trash2 } from "lucide-react";

interface DeckCardsClientProps {
  deckId: number;
  deckName: string;
  deckDescription: string;
  cards: SerializedCard[];
}

export function DeckCardsClient({
  deckId,
  deckName,
  deckDescription,
  cards,
}: DeckCardsClientProps) {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"gallery" | "compact">("gallery");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [frontText, setFrontText] = useState("");
  const [backText, setBackText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<SerializedCard | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleAddCard = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!frontText.trim() || !backText.trim()) {
      setErrorMessage("Both front and back text are required.");
      return;
    }

    setIsSaving(true);

    try {
      await addDeckCard({
        deckId,
        front: frontText,
        back: backText,
      });
      setFrontText("");
      setBackText("");
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
      setErrorMessage("Unable to add card right now. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCard = async () => {
    if (!selectedCard) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteDeckCard({
        deckId,
        cardId: selectedCard.id,
      });
      setAlertOpen(false);
      setSelectedCard(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const cardsCountLabel = `${cards.length} ${cards.length === 1 ? "card" : "cards"}`;
  const galleryClasses =
    viewMode === "gallery"
      ? "columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4"
      : "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";

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
        <Button size="lg" onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-5 w-5" />
          Add Card
        </Button>
      </div>

      <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-border bg-card/70 p-4 shadow-sm shadow-muted-foreground/10 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search cards..."
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2 whitespace-nowrap">
            <Button
              variant={viewMode === "gallery" ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setViewMode("gallery")}
            >
              <Columns className="h-4 w-4" />
              Gallery
            </Button>
          <Button
            variant={viewMode === "compact" ? "default" : "outline"}
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setViewMode("compact")}
          >
            <List className="h-4 w-4" />
            Compact
          </Button>
        </div>

        <span className="ml-auto text-sm font-medium text-muted-foreground">
          {cardsCountLabel}
        </span>
      </div>

      <div className="mt-10">
        {filteredCards.length === 0 ? (
          <Card className="border-dashed border-border bg-muted-foreground/5 p-10 text-center">
            <p className="text-xl font-semibold text-foreground">No cards yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Add your first flashcard to begin the study flow.
            </p>
            <Button
              className="mt-6 inline-flex items-center justify-center"
              size="sm"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add card
            </Button>
          </Card>
        ) : (
          <div className={cn("w-full", galleryClasses)}>
            {filteredCards.map((card) => (
              <article
                key={card.id}
                className="break-inside-avoid mb-6 rounded-3xl border border-border bg-card/80 p-5 shadow-[0_15px_45px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl"
              >
                <div className="relative">
                  <div className="absolute right-3 top-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        setSelectedCard(card);
                        setAlertOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
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
                </div>

                <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Updated {formatRelative(card.updatedAt)}</span>
                  <span>{Math.max(card.front.length, card.back.length)} chars</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Add a new card</DialogTitle>
            <DialogDescription>
              Create a fresh flashcard to keep this deck growing.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleAddCard}>
            <div>
              <label className="mb-2 block text-sm font-semibold text-muted-foreground">
                Front
              </label>
              <Textarea
                value={frontText}
                onChange={(event) => setFrontText(event.target.value)}
                placeholder="Prompt or question"
                rows={3}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-muted-foreground">
                Back
              </label>
              <Textarea
                value={backText}
                onChange={(event) => setBackText(event.target.value)}
                placeholder="Answer or explanation"
                rows={3}
              />
            </div>
            {errorMessage && (
              <p className="text-xs text-destructive">{errorMessage}</p>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={isSaving}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save card"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={alertOpen}
        onOpenChange={(open) => {
          setAlertOpen(open);
          if (!open) {
            setSelectedCard(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete card?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the flashcard forever. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteCard}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete card"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
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

