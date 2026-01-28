'use client'

export function YoucamCaptureResults({
  images,
}: {
  images: Array<{ src: string; phase?: number }>
}) {
  if (images.length === 0) return null

  return (
    <div className="grid gap-3 pt-4 sm:grid-cols-2">
      {images.map((image, index) => (
        <div
          key={`${image.src}-${index}`}
          className="overflow-hidden rounded-xl border border-border bg-background"
        >
          <img
            src={image.src}
            alt={`Capture ${image.phase ?? index + 1}`}
            className="aspect-square w-full object-contain"
          />
        </div>
      ))}
    </div>
  )
}
