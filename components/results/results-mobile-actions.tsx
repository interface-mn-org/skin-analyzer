import { Button } from '@/components/ui/button'
import { IconDownload, IconRefresh } from '@tabler/icons-react'

interface ResultsMobileActionsProps {
  onDownloadPDF: () => void
  onAnalyzeAgain: () => void
}

export function ResultsMobileActions({ onDownloadPDF, onAnalyzeAgain }: ResultsMobileActionsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border lg:hidden">
      <div className="max-w-3xl mx-auto flex gap-3">
        <Button variant="outline" onClick={onDownloadPDF} className="flex-1 gap-2 bg-transparent">
          <IconDownload className="w-4 h-4" />
          Download PDF
        </Button>
        <Button onClick={onAnalyzeAgain} className="flex-1 gap-2">
          <IconRefresh className="w-4 h-4" />
          New Analysis
        </Button>
      </div>
    </div>
  )
}
