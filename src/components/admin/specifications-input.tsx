"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SpecsInputProps {
  defaultValue?: Record<string, string>;
}

export default function SpecsInput({ defaultValue }: SpecsInputProps) {
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([]);
  const hiddenRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (defaultValue && Object.keys(defaultValue).length > 0) {
      setSpecs(Object.entries(defaultValue).map(([key, val]) => ({ key, value: String(val) })));
    } else {
      setSpecs([{ key: "", value: "" }]);
    }
  }, [defaultValue]);

  const updateSpecs = (newSpecs: { key: string; value: string }[]) => {
    setSpecs(newSpecs);
    if (hiddenRef.current) {
      const result: Record<string, string> = {};
      newSpecs.forEach(s => {
        if (s.key.trim()) {
          result[s.key.trim()] = s.value;
        }
      });
      hiddenRef.current.value = JSON.stringify(result);
    }
  };

  return (
    <div className="space-y-2">
      <input ref={hiddenRef} type="hidden" name="specifications" defaultValue={defaultValue ? JSON.stringify(defaultValue) : "{}"} />
      {specs.map((spec, index) => (
        <div key={index} className="flex gap-2">
          <Input
            placeholder="Key"
            value={spec.key}
            onChange={(e) => {
              const newSpecs = [...specs];
              newSpecs[index].key = e.target.value;
              updateSpecs(newSpecs);
            }}
          />
          <Input
            placeholder="Value"
            value={spec.value}
            onChange={(e) => {
              const newSpecs = [...specs];
              newSpecs[index].value = e.target.value;
              updateSpecs(newSpecs);
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              const newSpecs = specs.filter((_, i) => i !== index);
              updateSpecs(newSpecs.length > 0 ? newSpecs : [{ key: "", value: "" }]);
            }}
            className="shrink-0"
          >
            Remove
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => updateSpecs([...specs, { key: "", value: "" }])}>
        Add Specification
      </Button>
    </div>
  );
}
