"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Search,
  BookOpen,
  Settings,
  Trash2,
  Layers,
} from "lucide-react";
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

interface DeckGalleryProps {
  decks: Deck[];
}

function DeckCard({ deck }: { deck: Deck }) {
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
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
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

export function DeckGallery({ decks }: DeckGalleryProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold tracking-tight">
                Your Decks
              </h1>
              <p className="text-lg text-muted-foreground">
                Dive into a deck to study or polish its cards, and pull it open
                with a single tap.
              </p>
            </div>
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              New Deck
            </Button>
          </div>

          {/* Search and sort */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search decks..." className="pl-9" />
            </div>
            <Select defaultValue="recent">
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently updated</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="cards">Most cards</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator className="mb-12" />

        {/* Decks grid or empty state */}
        {decks.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {decks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

