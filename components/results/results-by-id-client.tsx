'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import type { ResultResponse } from '@/lib/api/result'
import type { OutputItem } from '@/types/files-api'
import {
  IconChevronLeft,
  IconChevronRight,
  IconDownload,
  IconRefresh,
  IconX,
} from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

const ANALYSIS_TYPES = [
  'wrinkle',
  'droopy_upper_eyelid',
  'droopy_lower_eyelid',
  'firmness',
  'acne',
  'moisture',
  'eye_bag',
  'dark_circle_v2',
  'age_spot',
  'radiance',
  'redness',
  'oiliness',
  'pore',
  'texture',
  'tear_trough',
  'skin_type',
] as const

const analysisTypeLabels: Record<string, string> = {
  wrinkle: 'Wrinkles',
  droopy_upper_eyelid: 'Upper Eyelid',
  droopy_lower_eyelid: 'Lower Eyelid',
  firmness: 'Firmness',
  acne: 'Acne',
  moisture: 'Moisture',
  eye_bag: 'Eye Bags',
  dark_circle_v2: 'Dark Circles',
  age_spot: 'Age Spots',
  radiance: 'Radiance',
  redness: 'Redness',
  oiliness: 'Oiliness',
  pore: 'Pores',
  texture: 'Texture',
  tear_trough: 'Tear Trough',
  skin_type: 'Skin Type',
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600'
  if (score >= 60) return 'text-amber-600'
  return 'text-red-600'
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  return 'Needs Attention'
}

type Props = {
  result: ResultResponse
  summary: string
  recommendation: string
}

export function ResultsByIdClient({ result, summary, recommendation }: Props) {
  const router = useRouter()
  const reportRef = useRef<HTMLDivElement>(null)

  const output = (result.results?.output ?? []) as OutputItem[]
  const overallScore = output.find((item) => item.type === 'all')?.score ?? 0
  const skinAge = output.find((item) => item.type === 'skin_age')?.score ?? 0
  const originalImage = output.find((item) => item.type === 'resize_image')?.mask_urls?.[0]
  const analysisItems = (
    output.filter((item) =>
      ANALYSIS_TYPES.includes(item.type as (typeof ANALYSIS_TYPES)[number]),
    ) as OutputItem[]
  ).sort(
    (a, b) =>
      ANALYSIS_TYPES.indexOf(a.type as (typeof ANALYSIS_TYPES)[number]) -
      ANALYSIS_TYPES.indexOf(b.type as (typeof ANALYSIS_TYPES)[number]),
  )

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const selectedItem =
    selectedIndex !== null && selectedIndex < analysisItems.length
      ? analysisItems[selectedIndex]
      : null

  const handleDownloadPDF = async () => {
    try {
      // Optional: install html2canvas and jspdf for PDF export
      const html2canvas = (await import('html2canvas')).default
      const { default: jsPDF } = await import('jspdf')

      if (!reportRef.current) return

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save('skin-analysis-report.pdf')
    } catch (e) {
      console.error('PDF export failed:', e)
    }
  }

  const handleAnalyzeAgain = () => {
    localStorage.clear()
    sessionStorage.clear()
    router.replace('/flow/capture')
  }

  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
      <header>
        <div className=" p-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link href="/account">
              <IconChevronLeft className="size-4" />
              <span className="hidden sm:inline">Back to Account</span>
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content - exported to PDF */}
      <main ref={reportRef} className="mx-auto max-w-2xl bg-background px-4 py-8 pb-32 lg:pb-12">
        {/* Overall Score Hero */}
        <section className="mb-10 text-center">
          <h1 className="mb-2 text-lg text-muted-foreground">Your Skin Score</h1>
          <div className="flex items-baseline justify-center gap-1">
            <span className={`text-6xl font-light ${getScoreColor(Number(overallScore))}`}>
              {Math.round(Number(overallScore))}
            </span>
            <span className="text-2xl text-muted-foreground">/100</span>
          </div>
          <p className={`mt-2 text-sm ${getScoreColor(Number(overallScore))}`}>
            {getScoreLabel(Number(overallScore))}
          </p>

          {/* Skin Age */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-muted/50 px-4 py-2">
            <span className="text-sm text-muted-foreground">Estimated Skin Age:</span>
            <span className="text-sm font-medium text-foreground">{Number(skinAge)} years</span>
          </div>
        </section>

        {/* Original Image */}
        {originalImage && (
          <section className="mb-10">
            <div className="mx-auto max-w-xs aspect-square overflow-hidden rounded-2xl bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={originalImage} alt="Your photo" className="h-full w-full object-cover" />
            </div>
          </section>
        )}

        {/* Summary (when no breakdown) or optional */}
        {summary && analysisItems.length === 0 && (
          <section className="mb-10">
            <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
          </section>
        )}

        {/* Analysis Breakdown */}
        {analysisItems.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Analysis Breakdown
            </h2>

            <div className="space-y-3">
              {analysisItems.map((item, index) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => {
                    setSelectedIndex(index)
                    setIsDialogOpen(true)
                  }}
                  className="group flex w-full items-center gap-4 rounded-xl border border-border p-4 text-left transition-colors hover:border-foreground/20"
                >
                  {/* Score Circle */}
                  <div className="relative size-14 shrink-0">
                    <svg className="size-14 -rotate-90">
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-muted"
                      />
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeDasharray={`${((item.ui_score ?? 0) / 100) * 151} 151`}
                        className={getScoreColor(item.ui_score ?? 0)}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-foreground">
                      {item.ui_score ?? '—'}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <p className="font-medium text-foreground">
                        {analysisTypeLabels[item.type] ?? item.type}
                      </p>
                      <IconChevronRight className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                    </div>
                    {summary && (
                      <p className="line-clamp-1 text-sm text-muted-foreground">{summary}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Privacy Note */}
        <p className="text-center text-xs text-muted-foreground">
          Your image was used only for this analysis and has been discarded.
        </p>
      </main>

      {/* Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="max-w-[min(28rem,calc(100vw-2rem))] gap-0 overflow-hidden p-0"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">{selectedItem?.type}</DialogTitle>
          {selectedItem && (
            <>
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="absolute right-4 top-4 z-10 flex size-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-background"
                aria-label="Close"
              >
                <IconX className="size-4" />
              </button>

              {selectedItem.mask_urls?.[0] && (
                <div className="aspect-square w-full bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedItem.mask_urls[0]}
                    alt={analysisTypeLabels[selectedItem.type] ?? selectedItem.type}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <h3 className="text-xl font-semibold text-foreground">
                    {analysisTypeLabels[selectedItem.type] ?? selectedItem.type}
                  </h3>
                  <span
                    className={`text-xl font-medium ${getScoreColor(selectedItem.ui_score ?? 0)}`}
                  >
                    {selectedItem.ui_score ?? '—'}/100
                  </span>
                </div>

                {summary && (
                  <div className="mb-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">{summary}</p>
                  </div>
                )}

                {recommendation && (
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Recommendation
                    </p>
                    <p className="text-sm leading-relaxed text-foreground">{recommendation}</p>
                  </div>
                )}

                {/* Navigation */}
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-xs text-muted-foreground">
                    {(selectedIndex ?? 0) + 1} / {analysisItems.length}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSelectedIndex((prev) => (prev ?? 0) - 1)}
                      disabled={selectedIndex === 0}
                      className="size-8 bg-transparent"
                    >
                      <IconChevronLeft className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSelectedIndex((prev) => (prev ?? 0) + 1)}
                      disabled={selectedIndex === analysisItems.length - 1}
                      className="size-8 bg-transparent"
                    >
                      <IconChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Fixed Bottom Actions - Mobile */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/80 p-4 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-2xl gap-3">
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            className="flex-1 gap-2 bg-transparent"
          >
            <IconDownload className="size-4" />
            Save PDF
          </Button>
          <Button onClick={handleAnalyzeAgain} className="flex-1 gap-2">
            <IconRefresh className="size-4" />
            New Analysis
          </Button>
        </div>
      </div>

      {/* Desktop Action */}
      <div className="mx-auto hidden max-w-2xl px-4 pb-8 lg:block">
        <div className="flex justify-center">
          <Button onClick={handleAnalyzeAgain} variant="outline" className="gap-2 bg-transparent">
            <IconRefresh className="size-4" />
            Start New Analysis
          </Button>
        </div>
      </div>
    </div>
  )
}
