"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Products page error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-2 text-center max-w-md">
        {error.message || "We couldn't load products. Please try again."}
      </p>
      {error.digest && (
        <p className="text-xs text-muted-foreground mb-4">Error ID: {error.digest}</p>
      )}
      {error.stack && (
        <pre className="text-xs bg-muted p-4 rounded-lg mb-4 max-w-lg overflow-auto text-left">
          {error.stack}
        </pre>
      )}
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
