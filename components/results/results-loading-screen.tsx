'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { IconAlertCircle } from '@tabler/icons-react'

type ResultsLoadingScreenProps = {
  /** When set, shows a progress bar that fills over this duration. Omit for indefinite (e.g. polling). */
  durationMs?: number
}

export function ResultsLoadingScreen({ durationMs }: ResultsLoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-20 flex min-h-svh min-w-full flex-col items-center justify-center gap-8 bg-background px-4">
      <div className="relative flex items-center justify-center">
        <div className="absolute size-24 animate-ping rounded-full bg-primary/30" />
        <div className="absolute size-20 rounded-full bg-primary/20" />
        <Spinner className="relative size-14 text-primary" />
      </div>
      <div className="flex flex-col items-center gap-3">
        <p className="text-lg font-medium text-foreground">Preparing your results</p>
        <span className="flex gap-1.5" aria-hidden>
          <span
            className="size-2 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="size-2 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="size-2 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: '300ms' }}
          />
        </span>
      </div>
      <Alert className="max-w-md">
        <IconAlertCircle className="size-4" />
        <AlertTitle>Please keep this page open</AlertTitle>
        <AlertDescription>
          Closing this tab or navigating away will restart the process. Your results will not be
          saved until loading is complete.
        </AlertDescription>
      </Alert>
      <div className="absolute bottom-12 left-4 right-4 h-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full w-0 rounded-full bg-primary"
          style={{
            animation: `results-loading-bar ${durationMs}ms ease-out forwards`,
          }}
        />
      </div>
    </div>
  )
}
