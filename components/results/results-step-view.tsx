'use client'

import { mockAnalysisResults } from '@/components/results/mock-analysis-results'
import { ResultsAnalysisList } from '@/components/results/results-analysis-list'
import { ResultsDesktopActions } from '@/components/results/results-desktop-actions'
import { ResultsGalleryDialog } from '@/components/results/results-gallery-dialog'
import { ResultsHeader } from '@/components/results/results-header'
import { ResultsMobileActions } from '@/components/results/results-mobile-actions'
import { ResultsPrivacyNote } from '@/components/results/results-privacy-note'
import { ResultsRecommendation } from '@/components/results/results-recommendation'
import { ResultsSummary } from '@/components/results/results-summary'
import { CAPTURED_IMAGES_KEY } from '@/lib/constants'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type StoredCapture = {
  image: string
  width: number
  height: number
  phase: number
}

export function ResultsStepView() {
  const router = useRouter()
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const selectedImage =
    selectedImageIndex !== null ? mockAnalysisResults.images[selectedImageIndex] : null

  const handlePreviousImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1)
    }
  }

  const handleNextImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex < mockAnalysisResults.images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1)
    }
  }

  const handleDownloadPDF = () => {
    console.log('Downloading PDF report...')
  }

  const handleAnalyzeAgain = () => {
    localStorage.clear()
    sessionStorage.clear()
    router.replace('/flow/capture')
  }

  const checkCapturedImagesInSessionStorage = () => {
    const raw = sessionStorage.getItem(CAPTURED_IMAGES_KEY)
    if (!raw) return false
    const images = JSON.parse(raw) as StoredCapture[]
    return images.length > 0
  }

  return (
    <div className="min-h-svh bg-background">
      <ResultsHeader onDownloadPDF={handleDownloadPDF} />

      <main className="max-w-3xl mx-auto px-4 py-8 pb-32 lg:pb-8">
        <ResultsSummary summary={mockAnalysisResults.overallSummary} />
        <ResultsRecommendation recommendation={mockAnalysisResults.recommendation} />
        <ResultsAnalysisList
          images={mockAnalysisResults.images}
          onSelectImage={(index) => {
            setSelectedImageIndex(index)
            setIsGalleryOpen(true)
          }}
        />
        <ResultsPrivacyNote />
      </main>

      <ResultsGalleryDialog
        isOpen={isGalleryOpen}
        onOpenChange={setIsGalleryOpen}
        selectedImage={selectedImage}
        selectedIndex={selectedImageIndex}
        totalImages={mockAnalysisResults.images.length}
        onPrevious={handlePreviousImage}
        onNext={handleNextImage}
      />

      <ResultsMobileActions onDownloadPDF={handleDownloadPDF} onAnalyzeAgain={handleAnalyzeAgain} />

      <ResultsDesktopActions onAnalyzeAgain={handleAnalyzeAgain} />
    </div>
  )
}
