"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SORT_OPTIONS } from "@/lib/products";

export default function SortSelectClient({ value }: { value: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createUrl = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    params.delete("page");
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => {
          router.push(createUrl(e.target.value));
        }}
        className="h-9 appearance-none rounded-lg border border-border bg-background pl-3 pr-8 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
    </div>
  );
}
