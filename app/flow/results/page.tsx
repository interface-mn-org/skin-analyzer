/* eslint-disable @next/next/no-img-element */
'use client'

import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  IconChevronLeft,
  IconChevronRight,
  IconDownload,
  IconFileText,
  IconRefresh,
} from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface AnalysisImage {
  id: string
  imageUrl: string
  title: string
  description: string
}

const mockAnalysisResults = {
  overallSummary:
    'Your skin shows healthy characteristics with minor areas that could benefit from targeted care. Overall hydration levels are good, with slight oiliness in the T-zone area.',
  recommendation:
    'We recommend a gentle daily cleanser, lightweight moisturizer with SPF 30+, and incorporating a vitamin C serum in your morning routine for brightness.',
  images: [
    {
      id: '1',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      title: 'Forehead Analysis',
      description: 'Minimal fine lines detected. Good hydration levels with slight oiliness.',
    },
    {
      id: '2',
      imageUrl: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop',
      title: 'Left Cheek',
      description: 'Healthy texture observed. Pores are within normal range.',
    },
    {
      id: '3',
      imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&h=400&fit=crop',
      title: 'Right Cheek',
      description: 'Even skin tone with good elasticity. Minor dryness noted.',
    },
    {
      id: '4',
      imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop',
      title: 'Nose Area',
      description: 'Visible pores in T-zone. Recommend pore-minimizing treatment.',
    },
    {
      id: '5',
      imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&h=400&fit=crop',
      title: 'Chin Region',
      description: 'Slight congestion detected. Exfoliation may help improve clarity.',
    },
    {
      id: '6',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      title: 'Under Eye Area',
      description: 'Minor dark circles present. Eye cream with caffeine recommended.',
    },
  ] as AnalysisImage[],
}

export default function ResultsStep() {
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

  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
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
                onClick={handleDownloadPDF}
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

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8 pb-32 lg:pb-8">
        {/* Summary Section */}
        <section className="mb-10">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Summary
          </h2>
          <p className="text-foreground leading-relaxed">{mockAnalysisResults.overallSummary}</p>
        </section>

        {/* Recommendation Section */}
        <section className="mb-10 p-5 rounded-xl border border-border bg-muted/30">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Our Recommendation
          </h2>
          <p className="text-foreground leading-relaxed">{mockAnalysisResults.recommendation}</p>
        </section>

        {/* Analysis Images */}
        <section className="mb-10">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
            Detailed Analysis
          </h2>

          <div className="space-y-3">
            {mockAnalysisResults.images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => {
                  setSelectedImageIndex(index)
                  setIsGalleryOpen(true)
                }}
                className="w-full flex items-center gap-4 p-3 rounded-xl border border-border bg-background hover:bg-muted/50 transition-colors text-left group"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                  <img
                    src={image.imageUrl || '/placeholder.svg'}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{image.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {image.description}
                  </p>
                </div>
                <IconChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </section>

        {/* Privacy Note */}
        <p className="text-xs text-muted-foreground text-center">
          Your image was used only for this analysis and has been discarded.
        </p>
      </main>

      {/* Image Gallery Dialog */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen} modal>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          {selectedImage && (
            <>
              <div className="aspect-square w-full bg-muted">
                <img
                  src={selectedImage.imageUrl || '/placeholder.svg'}
                  alt={selectedImage.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <DialogHeader className="mb-3">
                  <DialogTitle className="text-lg">{selectedImage.title}</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedImage.description}
                </p>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    {(selectedImageIndex ?? 0) + 1} / {mockAnalysisResults.images.length}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePreviousImage}
                      disabled={selectedImageIndex === 0}
                      className="h-8 w-8 bg-transparent"
                    >
                      <IconChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleNextImage}
                      disabled={selectedImageIndex === mockAnalysisResults.images.length - 1}
                      className="h-8 w-8 bg-transparent"
                    >
                      <IconChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Fixed Bottom Actions - Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border lg:hidden">
        <div className="max-w-3xl mx-auto flex gap-3">
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            className="flex-1 gap-2 bg-transparent"
          >
            <IconDownload className="w-4 h-4" />
            Download PDF
          </Button>
          <Button onClick={handleAnalyzeAgain} className="flex-1 gap-2">
            <IconRefresh className="w-4 h-4" />
            New Analysis
          </Button>
        </div>
      </div>

      {/* Desktop Actions */}
      <div className="hidden lg:block max-w-3xl mx-auto px-4 pb-8">
        <div className="flex justify-center">
          <Button onClick={handleAnalyzeAgain} variant="outline" className="gap-2 bg-transparent">
            <IconRefresh className="w-4 h-4" />
            Start New Analysis
          </Button>
        </div>
      </div>
    </div>
  )
}
