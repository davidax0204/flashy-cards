"use client";

import { FormEvent, Suspense, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { Loader2 } from "lucide-react";
import { addDeckCard, deleteDeckCard, updateDeckCard } from "./actions";
import type { SerializedCard } from "./page-types";
import { DeckHeader } from "./deck-header";
import { CardsDisplay } from "./cards-display";
import { DeckCardsLoading } from "./deck-cards-loading";

interface DeckPageClientProps {
  deckId: number;
  deckName: string;
  deckDescription: string;
  cardsPromise: Promise<SerializedCard[]>;
}

export function DeckPageClient({
  deckId,
  deckName,
  deckDescription,
  cardsPromise,
}: DeckPageClientProps) {
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<SerializedCard | null>(null);
  const [editFrontText, setEditFrontText] = useState("");
  const [editBackText, setEditBackText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [editErrorMessage, setEditErrorMessage] = useState<string | null>(null);
  const [cardsCount, setCardsCount] = useState<number | undefined>(undefined);

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

  const handleEditCard = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEditErrorMessage(null);

    if (!editFrontText.trim() || !editBackText.trim()) {
      setEditErrorMessage("Both front and back text are required.");
      return;
    }

    if (!editingCard) {
      return;
    }

    setIsUpdating(true);

    try {
      await updateDeckCard({
        deckId,
        cardId: editingCard.id,
        front: editFrontText,
        back: editBackText,
      });
      setEditFrontText("");
      setEditBackText("");
      setIsEditDialogOpen(false);
      setEditingCard(null);
    } catch (error) {
      console.error(error);
      setEditErrorMessage("Unable to update card right now. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      {/* Header - Always visible */}
      <DeckHeader
        deckId={deckId}
        deckName={deckName}
        deckDescription={deckDescription}
        onAddCardClick={() => setIsDialogOpen(true)}
        search={search}
        onSearchChange={setSearch}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        cardsCount={cardsCount}
      />

      {/* Cards - Shows loading skeleton */}
      <Suspense fallback={<DeckCardsLoading />}>
        <CardsLoader
          cardsPromise={cardsPromise}
          search={search}
          viewMode={viewMode}
          onAddCardClick={() => setIsDialogOpen(true)}
          onDeleteCardClick={(card) => {
            setSelectedCard(card);
            setAlertOpen(true);
          }}
          onEditCardClick={(card) => {
            setEditingCard(card);
            setEditFrontText(card.front);
            setEditBackText(card.back);
            setIsEditDialogOpen(true);
          }}
          onCardsLoaded={setCardsCount}
        />
      </Suspense>

      {/* Add Card Dialog */}
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
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSaving ? "Saving..." : "Save card"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Card Dialog */}
      <Dialog 
        open={isEditDialogOpen} 
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setEditingCard(null);
            setEditErrorMessage(null);
          }
        }}
      >
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Edit card</DialogTitle>
            <DialogDescription>
              Make changes to your flashcard.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleEditCard}>
            <div>
              <label className="mb-2 block text-sm font-semibold text-muted-foreground">
                Front
              </label>
              <Textarea
                value={editFrontText}
                onChange={(event) => setEditFrontText(event.target.value)}
                placeholder="Prompt or question"
                rows={3}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-muted-foreground">
                Back
              </label>
              <Textarea
                value={editBackText}
                onChange={(event) => setEditBackText(event.target.value)}
                placeholder="Answer or explanation"
                rows={3}
              />
            </div>
            {editErrorMessage && (
              <p className="text-xs text-destructive">{editErrorMessage}</p>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={isUpdating}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isUpdating ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Card Dialog */}
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
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isDeleting ? "Deleting..." : "Delete card"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function CardsLoader({
  cardsPromise,
  search,
  viewMode,
  onAddCardClick,
  onDeleteCardClick,
  onEditCardClick,
  onCardsLoaded,
}: {
  cardsPromise: Promise<SerializedCard[]>;
  search: string;
  viewMode: "gallery" | "compact";
  onAddCardClick: () => void;
  onDeleteCardClick: (card: SerializedCard) => void;
  onEditCardClick: (card: SerializedCard) => void;
  onCardsLoaded: (count: number) => void;
}) {
  const cards = use(cardsPromise);

  // Notify parent of cards count after render
  useEffect(() => {
    onCardsLoaded(cards.length);
  }, [cards.length, onCardsLoaded]);

  return (
    <CardsDisplay
      cards={cards}
      search={search}
      viewMode={viewMode}
      onAddCardClick={onAddCardClick}
      onDeleteCardClick={onDeleteCardClick}
      onEditCardClick={onEditCardClick}
    />
  );
}

// React 19 use() hook polyfill for Promise unwrapping
function use<T>(promise: Promise<T>): T {
  if ((promise as any).status === "fulfilled") {
    return (promise as any).value;
  } else if ((promise as any).status === "rejected") {
    throw (promise as any).reason;
  } else if ((promise as any).status === "pending") {
    throw promise;
  } else {
    (promise as any).status = "pending";
    promise.then(
      (value) => {
        (promise as any).status = "fulfilled";
        (promise as any).value = value;
      },
      (reason) => {
        (promise as any).status = "rejected";
        (promise as any).reason = reason;
      }
    );
    throw promise;
  }
}

