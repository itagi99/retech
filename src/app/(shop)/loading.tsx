import { Skeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between px-6 py-4">
        <Skeleton className="h-8 w-24" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-40" />
            </div>
          </div>
          <Skeleton className="h-64 lg:h-96 rounded-2xl" />
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-10 w-64 mx-auto mb-10" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-10 w-64 mx-auto mb-10" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-10 w-48 mx-auto mb-10" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-48 shrink-0 rounded-xl" />
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-10 w-48 mx-auto mb-10" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-10 w-64 mx-auto mb-10" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-10 w-64 mx-auto mb-10" />
          <div className="flex justify-center gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-16 rounded-full" />
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-10 w-48 mx-auto mb-6" />
          <Skeleton className="h-6 w-96 mx-auto mb-8" />
          <div className="flex gap-4 max-w-md mx-auto">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
