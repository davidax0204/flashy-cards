"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { BookOpen, Trash2, Loader2 } from "lucide-react";
import { deleteDeck } from "./actions";
import Link from "next/link";
import { toast } from "sonner";

type Deck = {
  id: number;
  name: string;
  description: string | null;
  cardsCount: number;
  updatedAt: Date;
};

export function DeckCard({ deck }: { deck: Deck }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteDeck({ deckId: deck.id });
      toast.success("Deck deleted successfully");
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete deck");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffWeeks = Math.floor(diffMs / 604800000);

    if (diffMins < 60) return diffMins <= 1 ? "just now" : `${diffMins} minutes ago`;
    if (diffHours < 24) return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    if (diffDays < 7) return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
    if (diffWeeks < 4) return diffWeeks === 1 ? "1 week ago" : `${diffWeeks} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <div className="group relative">
        {/* Stack shadow layers */}
        <div className="absolute left-2 top-2 h-full w-full rounded-lg border border-border bg-card opacity-40 transition-all group-hover:left-3 group-hover:top-3" />
        <div className="absolute left-1 top-1 h-full w-full rounded-lg border border-border bg-card opacity-70 transition-all group-hover:left-2 group-hover:top-2" />

        {/* Main card */}
        <Card className="relative transform border-border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1">
          {/* Delete button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 h-8 w-8 p-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          {/* Deck name */}
          <h3 className="mb-1 text-xl font-semibold tracking-tight">
            {deck.name}
          </h3>

          {/* Meta info */}
          <div className="mb-4 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {deck.cardsCount} {deck.cardsCount === 1 ? "card" : "cards"}
            </span>
            <span>•</span>
            <span>{formatDate(deck.updatedAt)}</span>
          </div>

          {/* Description */}
          {deck.description && (
            <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
              {deck.description}
            </p>
          )}

          {/* Actions */}
          <div className="flex">
            <Button
              asChild
              className="flex-1 justify-center text-base"
              size="sm"
            >
              <Link
                href={`/decks/${deck.id}`}
                className="block w-full text-center font-semibold"
              >
                Open deck
              </Link>
            </Button>
          </div>
        </Card>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete deck?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the deck &quot;{deck.name}&quot; and all its cards. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

