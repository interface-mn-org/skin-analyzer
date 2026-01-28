'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

export function YoucamCameraViewport({
  isOpen,
  viewportRef,
  moduleRef,
  className,
}: {
  isOpen: boolean
  viewportRef: React.RefObject<HTMLDivElement | null>
  moduleRef: React.RefObject<HTMLDivElement | null>
  className?: string
}) {
  return (
    <div
      ref={viewportRef}
      className={cn(
        'relative h-[500px] w-full rounded-2xl border border-border bg-muted/40',
        className,
      )}
    >
      <div id="YMK-module" ref={moduleRef} />
      {!isOpen ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center p-6 text-center text-sm text-muted-foreground">
          Press “Open” to start the camera.
        </div>
      ) : null}
    </div>
  )
}
