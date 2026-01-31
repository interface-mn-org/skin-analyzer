/* eslint-disable @next/next/no-img-element */
import { IconChevronRight } from '@tabler/icons-react'
import type { AnalysisImage } from './types'

interface ResultsAnalysisListProps {
  images: AnalysisImage[]
  onSelectImage: (index: number) => void
}

export function ResultsAnalysisList({ images, onSelectImage }: ResultsAnalysisListProps) {
  return (
    <section className="mb-10">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
        Detailed Analysis
      </h2>

      <div className="space-y-3">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => onSelectImage(index)}
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
  )
}
