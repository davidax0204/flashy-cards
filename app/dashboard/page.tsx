import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Plus, Search } from "lucide-react";
import { DeckGrid } from "./deck-grid";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header - Always visible */}
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

          {/* Search and sort - Always visible */}
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

        {/* Decks grid - Shows loading skeleton only here */}
        <DeckGrid userId={userId} />
      </div>
    </div>
  );
}
