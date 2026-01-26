"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type FlowStep = {
  title: string;
  href: string;
};

export function FlowProgress({
  steps,
  activeStep,
  onStepChange,
  allowFutureSteps = false,
  className,
}: {
  steps: FlowStep[];
  activeStep: number;
  onStepChange?: (step: number) => void;
  allowFutureSteps?: boolean;
  className?: string;
}) {
  const current = steps[Math.max(0, Math.min(steps.length - 1, activeStep - 1))];

  return (
    <div className={cn("min-w-0 space-y-2", className)}>
      <div className="flex min-w-0 items-center justify-between gap-4">
        <p className="truncate text-sm font-medium text-foreground">
          {current?.title ?? "Progress"}
        </p>
        <p className="shrink-0 text-xs text-muted-foreground">
          {activeStep}/{steps.length}
        </p>
      </div>
      <div className="flex w-full gap-2">
        {steps.map((step, idx) => {
          const stepNumber = idx + 1;
          const isActive = stepNumber === activeStep;
          const isCompleted = stepNumber < activeStep;
          const isDisabled = !allowFutureSteps && stepNumber > activeStep;

          return (
            <button
              key={step.href}
              type="button"
              aria-label={`Go to ${step.title}`}
              disabled={isDisabled || !onStepChange}
              onClick={() => onStepChange?.(stepNumber)}
              className={cn(
                "h-2 flex-1 rounded-full transition",
                isCompleted || isActive ? "bg-primary" : "bg-border",
                isActive && "ring-2 ring-primary/25 ring-offset-2 ring-offset-background",
                (isDisabled || !onStepChange) && "cursor-not-allowed opacity-70"
              )}
            />
          );
        })}
      </div>
    </div>
  );
}

