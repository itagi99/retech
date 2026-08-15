"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SpecsAccordionProps {
  specifications: Record<string, string>;
}

export default function SpecsAccordion({ specifications }: SpecsAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const keySpecs = [
    "Processor",
    "RAM",
    "Storage",
    "GPU",
    "Screen",
    "OS",
    "Weight",
  ];

  const visibleSpecs = Object.entries(specifications).filter(([key]) =>
    keySpecs.includes(key)
  );

  const otherSpecs = Object.entries(specifications).filter(
    ([key]) => !keySpecs.includes(key)
  );

  return (
    <div className="rounded-xl border border-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left font-semibold"
      >
        <span>Specifications</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </button>

      {isOpen && (
        <div className="overflow-hidden">
          <div className="border-t border-border px-4 py-3">
            <table className="w-full text-sm">
              <tbody>
                {visibleSpecs.map(([key, value]) => (
                  <tr key={key} className="border-b border-border last:border-0">
                    <td className="py-2.5 font-medium text-muted-foreground w-1/3">
                      {key}
                    </td>
                    <td className="py-2.5">{value}</td>
                  </tr>
                ))}
                {otherSpecs.map(([key, value]) => (
                  <tr key={key} className="border-b border-border last:border-0">
                    <td className="py-2.5 font-medium text-muted-foreground">
                      {key}
                    </td>
                    <td className="py-2.5">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
