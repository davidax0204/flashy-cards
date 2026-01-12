"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, RotateCcw, ChevronLeft, ChevronRight, Shuffle, CheckCircle2 } from "lucide-react";

interface StudyCard {
  id: number;
  front: string;
  back: string;
}

interface StudyClientProps {
  deckId: number;
  deckName: string;
  cards: StudyCard[];
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function StudyClient({ deckId, deckName, cards: initialCards }: StudyClientProps) {
  const [cards, setCards] = useState(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedCards, setStudiedCards] = useState<Set<number>>(new Set());
  const [isCompleted, setIsCompleted] = useState(false);

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setStudiedCards((prev) => new Set(prev).add(currentCard.id));
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      // Mark last card as studied and show completion
      setStudiedCards((prev) => new Set(prev).add(currentCard.id));
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      setIsCompleted(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setStudiedCards(new Set());
    setIsCompleted(false);
  };

  const handleShuffle = () => {
    setCards(shuffleArray(cards));
    setCurrentIndex(0);
    setIsFlipped(false);
    setStudiedCards(new Set());
    setIsCompleted(false);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          if (!isCompleted) {
            handleNext();
          }
          break;
        case "ArrowLeft":
          event.preventDefault();
          handlePrevious();
          break;
        case " ":
          event.preventDefault();
          if (!isCompleted) {
            handleFlip();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, isFlipped, isCompleted]);

  const isLastCard = currentIndex === cards.length - 1;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/decks/${deckId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to deck
            </Button>
          </Link>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShuffle}>
            <Shuffle className="mr-2 h-4 w-4" />
            Shuffle
          </Button>
          <Button variant="outline" size="sm" onClick={handleRestart}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Restart
          </Button>
        </div>
      </div>

      {/* Deck name and progress */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{deckName}</h1>
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Card {currentIndex + 1} of {cards.length}
            </span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Flashcard */}
      {!isCompleted ? (
        <div className="mb-8" style={{ perspective: "1000px" }}>
          <div
            className="relative cursor-pointer"
            onClick={handleFlip}
            style={{
              transformStyle: "preserve-3d",
              transition: "transform 0.6s",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              minHeight: "400px",
            }}
          >
            {/* Front side */}
            <Card
              className="absolute inset-0 border-border hover:shadow-lg"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-8">
                <Badge
                  variant="secondary"
                  className="absolute left-6 top-6 px-3 py-1"
                >
                  Front
                </Badge>
                <div className="text-center">
                  <p className="text-2xl font-medium leading-relaxed">
                    {currentCard.front}
                  </p>
                </div>
                <p className="absolute bottom-6 text-sm text-muted-foreground">
                  Click or press Space to flip
                </p>
              </CardContent>
            </Card>

            {/* Back side */}
            <Card
              className="absolute inset-0 border-border hover:shadow-lg"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-8">
                <Badge
                  variant="secondary"
                  className="absolute left-6 top-6 px-3 py-1"
                >
                  Back
                </Badge>
                <div className="text-center">
                  <p className="text-2xl font-medium leading-relaxed">
                    {currentCard.back}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Completion Card */
        <div className="mb-8">
          <Card className="border-border p-8 text-center">
            <CardContent className="flex min-h-[400px] flex-col items-center justify-center space-y-6 p-0">
              <CheckCircle2 className="h-20 w-20 text-primary" />
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  Congratulations!
                </h2>
                <p className="mt-3 text-lg text-muted-foreground">
                  You&apos;ve completed all {cards.length} cards in this deck.
                </p>
              </div>
              <div className="flex gap-3">
                <Button size="lg" onClick={handleRestart}>
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Study Again
                </Button>
                <Link href={`/decks/${deckId}`}>
                  <Button size="lg" variant="outline">
                    Back to Deck
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation */}
      {!isCompleted && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <Button onClick={handleFlip} variant="secondary">
            Flip Card
          </Button>

          <Button onClick={handleNext}>
            {isLastCard ? "Finish" : "Next"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          Keyboard shortcuts: <kbd className="rounded bg-muted px-2 py-1">←</kbd> Previous •{" "}
          <kbd className="rounded bg-muted px-2 py-1">→</kbd> Next •{" "}
          <kbd className="rounded bg-muted px-2 py-1">Space</kbd> Flip
        </p>
      </div>
    </div>
  );
}
