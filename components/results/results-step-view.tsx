'use client'

import { ResultsAnalysisList } from '@/components/results/results-analysis-list'
import { ResultsDesktopActions } from '@/components/results/results-desktop-actions'
import { ResultsGalleryDialog } from '@/components/results/results-gallery-dialog'
import { ResultsHeader } from '@/components/results/results-header'
import { ResultsLoadingScreen } from '@/components/results/results-loading-screen'
import { ResultsMobileActions } from '@/components/results/results-mobile-actions'
import { ResultsPrivacyNote } from '@/components/results/results-privacy-note'
import { ResultsRecommendation } from '@/components/results/results-recommendation'
import { ResultsRevealOverlay } from '@/components/results/results-reveal-overlay'
import { ResultsSummary } from '@/components/results/results-summary'
import type { AnalysisImage } from '@/components/results/types'
import { getTaskStatus } from '@/lib/api/poll-status'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const LOADING_DURATION_MS = 2500

export function ResultsStepView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const taskId = searchParams.get('taskId')
  const [isRevealed, setIsRevealed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  const galleryImages: AnalysisImage[] = []

  const selectedImage =
    selectedImageIndex !== null && selectedImageIndex < galleryImages.length
      ? galleryImages[selectedImageIndex]
      : null

  const handlePreviousImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1)
    }
  }

  const handleNextImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex < galleryImages.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1)
    }
  }

  const handleDownloadPDF = () => {
    // PDF export can be wired to actual export when backend supports it
  }

  const handleAnalyzeAgain = () => {
    localStorage.clear()
    sessionStorage.clear()
    router.replace('/flow/capture')
  }

  const handleRevealClick = async () => {
    setIsLoading(true)
    if (taskId) {
      try {
        const { data, resultId } = await getTaskStatus(taskId)
        if (data.task_status === 'success') {
          router.replace(`/account/results/${resultId ?? taskId}`)
          return
        } else {
          setIsLoading(false)
          toast.error(data.error_code ?? `Task status: ${data.task_status}`)
        }
      } catch (e) {
        setIsLoading(false)
        toast.error(e instanceof Error ? e.message : 'Failed to load results')
      }
    }
  }

  useEffect(() => {
    if (!isLoading || taskId) return
    const t = setTimeout(() => {
      setIsLoading(false)
      setIsRevealed(true)
    }, LOADING_DURATION_MS)
    return () => clearTimeout(t)
  }, [isLoading, taskId])

  return (
    <div className="min-h-svh bg-background relative">
      <div
        className={`transition-all duration-300 ${!isRevealed ? 'pointer-events-none select-none blur-md' : ''}`}
      >
        <ResultsHeader onDownloadPDF={handleDownloadPDF} />

        <main className="max-w-3xl mx-auto px-4 py-8 pb-32 lg:pb-8">
          <ResultsSummary summary="Your analysis is being prepared. Click Reveal to view your results when ready." />
          <ResultsRecommendation recommendation="Complete the flow to see personalized recommendations." />
          <ResultsAnalysisList
            images={galleryImages}
            onSelectImage={(index) => {
              setSelectedImageIndex(index)
              setIsGalleryOpen(true)
            }}
          />
          <ResultsPrivacyNote />
        </main>
      </div>

      {!isRevealed && !isLoading && <ResultsRevealOverlay onReveal={handleRevealClick} />}

      {isLoading && <ResultsLoadingScreen durationMs={LOADING_DURATION_MS} />}

      <ResultsGalleryDialog
        isOpen={isGalleryOpen}
        onOpenChange={setIsGalleryOpen}
        selectedImage={selectedImage}
        selectedIndex={selectedImageIndex}
        totalImages={galleryImages.length}
        onPrevious={handlePreviousImage}
        onNext={handleNextImage}
      />

      {isRevealed && (
        <>
          <ResultsMobileActions
            onDownloadPDF={handleDownloadPDF}
            onAnalyzeAgain={handleAnalyzeAgain}
          />
          <ResultsDesktopActions onAnalyzeAgain={handleAnalyzeAgain} />
        </>
      )}
    </div>
  )
}
