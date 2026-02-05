'use client'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { IconSparkles } from '@tabler/icons-react'

type ResultsRevealOverlayProps = {
  onReveal: () => void
  isLoading?: boolean
}

export function ResultsRevealOverlay({ onReveal, isLoading = false }: ResultsRevealOverlayProps) {
  return (
    <div className="fixed inset-0 z-10 flex min-h-svh min-w-full items-center justify-center bg-background/40 px-4 backdrop-blur-md">
      <div className="flex max-w-sm flex-col items-center gap-6 text-center">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Таны шинжилгээ бэлэн боллоо
          </h2>
          <p className="text-sm text-muted-foreground">
            Танд зориулсан арьсны зөвлөмж, дүгнэлтүүдийг бэлтгэлээ. Доорх товчийг дарж үр дүнгээ
            нээнэ үү.
          </p>
        </div>
        <Button
          size="lg"
          variant="default"
          className="h-12 gap-2.5 rounded-xl bg-violet-600 px-6 text-base font-medium text-white shadow-md transition-all hover:bg-violet-700 hover:shadow-lg"
          onClick={onReveal}
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? <Spinner /> : <IconSparkles className="size-5" aria-hidden />}
          {isLoading ? 'Шалгаж байна…' : 'Үр дүнгээ харах'}
        </Button>
      </div>
    </div>
  )
}
