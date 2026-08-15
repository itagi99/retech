import { cn } from "@/lib/utils";

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700",
        className
      )}
    />
  );
}

function FilterSkeleton() {
  return (
    <div className="hidden lg:block w-64 flex-shrink-0 space-y-6">
      <Skeleton className="h-6 w-24" />
      {[...Array(8)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <Skeleton className="aspect-square w-full" />
      <div className="flex flex-1 flex-col p-4 space-y-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-4 w-20" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

export default function ProductsLoading() {
  return (
    <div className="flex min-h-[600px]">
      <FilterSkeleton />
      <div className="flex-1">
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-9 w-40" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function FilterSidebarSkeleton() {
  return (
    <div className="lg:hidden space-y-4 p-4">
      <Skeleton className="h-10 w-full" />
      <div className="grid grid-cols-2 gap-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-9 w-full" />
        ))}
      </div>
    </div>
  );
}
