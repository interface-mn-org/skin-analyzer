import { Button } from '@/components/ui/button'
import { IconRefresh } from '@tabler/icons-react'

interface ResultsDesktopActionsProps {
  onAnalyzeAgain: () => void
}

export function ResultsDesktopActions({ onAnalyzeAgain }: ResultsDesktopActionsProps) {
  return (
    <div className="hidden lg:block max-w-3xl mx-auto px-4 pb-8">
      <div className="flex justify-center">
        <Button onClick={onAnalyzeAgain} variant="outline" className="gap-2 bg-transparent">
          <IconRefresh className="w-4 h-4" />
          Start New Analysis
        </Button>
      </div>
    </div>
  )
}
