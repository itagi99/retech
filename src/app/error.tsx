"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
          <h2 className="text-2xl font-bold mb-2">Something went wrong!</h2>
          <p className="text-muted-foreground mb-2 text-center max-w-md">
            {error.message || "We apologize for the inconvenience. Please try again later."}
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
      </body>
    </html>
  );
}
