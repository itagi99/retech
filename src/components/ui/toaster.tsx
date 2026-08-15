"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          error: "bg-red-500 text-white",
          success: "bg-green-500 text-white",
          warning: "bg-yellow-500 text-white",
          info: "bg-blue-500 text-white",
        },
      }}
    />
  );
}
