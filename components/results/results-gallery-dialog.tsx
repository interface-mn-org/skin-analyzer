/* eslint-disable @next/next/no-img-element */
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import type { AnalysisImage } from './types'

interface ResultsGalleryDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedImage: AnalysisImage | null
  selectedIndex: number | null
  totalImages: number
  onPrevious: () => void
  onNext: () => void
}

export function ResultsGalleryDialog({
  isOpen,
  onOpenChange,
  selectedImage,
  selectedIndex,
  totalImages,
  onPrevious,
  onNext,
}: ResultsGalleryDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange} modal>
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

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  {(selectedIndex ?? 0) + 1} / {totalImages}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onPrevious}
                    disabled={selectedIndex === 0}
                    className="h-8 w-8 bg-transparent"
                  >
                    <IconChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onNext}
                    disabled={selectedIndex === totalImages - 1}
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
  )
}
