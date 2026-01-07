import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import { Layers, Repeat, Search, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2 text-xl font-bold">
            <Sparkles className="h-5 w-5" />
            FlashyCardy
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <SignedIn>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </SignedIn>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <a href="#features">Features</a>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <a href="#how-it-works">How it works</a>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <a href="#pricing">Pricing</a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-16">
        <div className="flex flex-col items-center text-center">
          <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Learn faster with flashcards that don&apos;t feel like{" "}
            <span className="text-muted-foreground">homework.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Create, organize, and master your study material with beautifully simple flashcards. Built for learners who value speed and clarity.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" className="text-base">
              Create a deck
            </Button>
            <Button size="lg" variant="outline" className="text-base">
              Try demo
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <Badge variant="secondary" className="px-3 py-1">
              Neon Postgres
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              Drizzle ORM
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              Clerk Auth
            </Badge>
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      {/* Feature Cards */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-border p-8 transition-shadow hover:shadow-md">
            <Layers className="mb-4 h-10 w-10 text-primary" />
            <h3 className="mb-2 text-xl font-semibold">Decks & Cards</h3>
            <p className="text-muted-foreground">
              Organize your knowledge into decks and cards with a clean, distraction-free interface.
            </p>
          </Card>

          <Card className="border-border p-8 transition-shadow hover:shadow-md">
            <Repeat className="mb-4 h-10 w-10 text-primary" />
            <h3 className="mb-2 text-xl font-semibold">Spaced repetition-ready</h3>
            <p className="text-muted-foreground">
              Study smarter with built-in support for spaced repetition learning techniques.
            </p>
          </Card>

          <Card className="border-border p-8 transition-shadow hover:shadow-md">
            <Search className="mb-4 h-10 w-10 text-primary" />
            <h3 className="mb-2 text-xl font-semibold">Fast search</h3>
            <p className="text-muted-foreground">
              Find any card instantly with lightning-fast search powered by modern databases.
            </p>
          </Card>
        </div>
      </section>

      {/* Demo Preview */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-24">
        <div className="flex flex-col items-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            See it in action
          </h2>
          <p className="mb-12 text-center text-lg text-muted-foreground">
            Simple, intuitive flashcards that just work
          </p>

          <Card className="w-full max-w-2xl border-border p-8 shadow-lg">
            <Tabs defaultValue="front" className="w-full">
              <TabsList className="mb-6 grid w-full grid-cols-2">
                <TabsTrigger value="front">Front</TabsTrigger>
                <TabsTrigger value="back">Back</TabsTrigger>
              </TabsList>
              
              <TabsContent value="front" className="min-h-[200px]">
                <div className="flex items-center justify-center rounded-lg border border-dashed p-12 text-center">
                  <p className="text-2xl font-medium">
                    What is spaced repetition?
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="back" className="min-h-[200px]">
                <div className="flex items-center justify-center rounded-lg border border-dashed p-12 text-center">
                  <p className="text-lg text-muted-foreground">
                    A learning technique that involves reviewing information at increasing intervals to improve long-term retention.
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex justify-center">
              <Button variant="outline" size="sm">
                Flip
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-sm text-muted-foreground">
            Built for testing • Next.js + shadcn/ui
          </p>
        </div>
      </footer>
    </div>
  );
}
