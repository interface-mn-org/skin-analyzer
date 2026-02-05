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
import { useMutation } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const LOADING_DURATION_MS = 2500

export function ResultsStepView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const taskId = searchParams.get('taskId')
  const [isRevealed, setIsRevealed] = useState(false)
  const [isRevealLoading, setIsRevealLoading] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const { data: session } = useSession()
  const accessToken = session?.backendTokens?.accessToken

  const statusMutation = useMutation({
    mutationFn: async () => {
      if (!taskId) {
        throw new Error('Даалгаврын дугаар олдсонгүй.')
      }
      if (!accessToken) {
        throw new Error('Нэвтэрсэн эрх баталгаажаагүй байна.')
      }
      return getTaskStatus(taskId, accessToken)
    },
    onSuccess: ({ data, resultId }) => {
      if (data.task_status === 'success') {
        router.replace(`/account/results/${resultId ?? taskId}`)
        return
      }
      toast.error(data.error_code ?? `Task status: ${data.task_status}`)
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Үр дүнг авахад алдаа гарлаа.')
    },
  })

  const isLoading = isRevealLoading || statusMutation.isPending

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
    if (isLoading) return
    if (!taskId) {
      setIsRevealLoading(true)
      return
    }
    statusMutation.mutate()
  }

  useEffect(() => {
    if (!isRevealLoading || taskId) return
    const t = setTimeout(() => {
      setIsRevealLoading(false)
      setIsRevealed(true)
    }, LOADING_DURATION_MS)
    return () => clearTimeout(t)
  }, [isRevealLoading, taskId])

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

      {!isRevealed && (
        <ResultsRevealOverlay onReveal={handleRevealClick} isLoading={isLoading} />
      )}

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
