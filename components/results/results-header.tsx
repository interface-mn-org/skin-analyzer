import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { IconFileText } from '@tabler/icons-react'

interface ResultsHeaderProps {
  onDownloadPDF: () => void
}

export function ResultsHeader({ onDownloadPDF }: ResultsHeaderProps) {
  return (
    <header className="border-b border-border bg-background">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-4">
          Skin Analyzer
        </p>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Your Results</h1>
            <p className="text-sm text-muted-foreground mt-1">Analysis complete</p>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button
              onClick={onDownloadPDF}
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <IconFileText className="w-4 h-4" />
              <span className="hidden sm:inline">Download PDF</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
