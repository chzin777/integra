"use client";

import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type StaggerFrom = "first" | "last" | "center" | number;

interface VariableFontHoverProps {
  label: string;
  fromFontVariationSettings?: string;
  toFontVariationSettings?: string;
  staggerDuration?: number;
  staggerFrom?: StaggerFrom;
  duration?: number;
  className?: string;
}

/**
 * Cada letra transiciona seu peso (font-variation-settings 'wght') no hover,
 * com stagger a partir do ponto escolhido. Requer fonte variável.
 */
export function VariableFontHover({
  label,
  fromFontVariationSettings = "'wght' 400",
  toFontVariationSettings = "'wght' 700",
  staggerDuration = 0.03,
  staggerFrom = "center",
  duration = 0.3,
  className,
}: VariableFontHoverProps) {
  const [hovered, setHovered] = useState(false);
  const letters = useMemo(() => Array.from(label), [label]);

  const delay = (i: number) => {
    const n = letters.length;
    if (staggerFrom === "first") return i * staggerDuration;
    if (staggerFrom === "last") return (n - 1 - i) * staggerDuration;
    if (staggerFrom === "center") return Math.abs(i - (n - 1) / 2) * staggerDuration;
    if (typeof staggerFrom === "number") return Math.abs(i - staggerFrom) * staggerDuration;
    return i * staggerDuration;
  };

  return (
    <span
      className={cn("inline-flex", className)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {letters.map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          aria-hidden
          className="inline-block"
          style={{
            fontVariationSettings: hovered
              ? toFontVariationSettings
              : fromFontVariationSettings,
            transition: `font-variation-settings ${duration}s ease ${delay(i)}s`,
            whiteSpace: ch === " " ? "pre" : "normal",
          }}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}
