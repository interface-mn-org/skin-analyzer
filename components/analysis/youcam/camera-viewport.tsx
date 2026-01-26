"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export function YoucamCameraViewport({
  isOpen,
  viewportRef,
  moduleRef,
  className,
}: {
  isOpen: boolean;
  viewportRef: React.RefObject<HTMLDivElement | null>;
  moduleRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
}) {
  return (
    <div
      ref={viewportRef}
      className={cn(
        "relative min-h-[320px] overflow-hidden rounded-2xl border border-border bg-muted/40",
        "h-[min(58vh,520px)] sm:h-[min(62vh,580px)]",
        className
      )}
    >
      <div id="YMK-module" ref={moduleRef} className="ymk-hide-instructions absolute inset-0" />
      {!isOpen ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center p-6 text-center text-sm text-muted-foreground">
          Press “Open” to start the camera.
        </div>
      ) : null}
    </div>
  );
}

