import { Skeleton } from "@/components/ui/skeleton";

export function DeckCardsLoading() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-10">
      <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="mb-6 break-inside-avoid rounded-3xl border border-border bg-card/80 p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 space-y-4">
                <div>
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="mt-1 h-5 w-full" />
                </div>
                <Skeleton className="h-px w-full" />
                <div>
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="mt-1 h-4 w-full" />
                  <Skeleton className="mt-1 h-4 w-5/6" />
                </div>
              </div>
              <Skeleton className="h-8 w-8 shrink-0" />
            </div>
            <Skeleton className="mt-6 h-3 w-32" />
          </div>
        ))}
      </div>
    </section>
  );
}

