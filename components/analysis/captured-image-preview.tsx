/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useState } from 'react'

const CAPTURED_IMAGES_KEY = 'skin-analyzer:capture-images'

export function CapturedImagePreview() {
  const [image, setImage] = useState<string | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem(CAPTURED_IMAGES_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as { image?: string }[]
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (parsed[0]?.image) setImage(parsed[0].image)
    } catch {
      // ignore malformed storage
    }
  }, [])

  if (!image) return null

  return (
    <div className="flex justify-center">
      <div className="relative">
        <div className="size-36 rounded-full overflow-hidden border-2 border-primary/50 shadow-lg">
          <img
            src={image}
            alt="Your captured face"
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />
        </div>
        <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-primary flex items-center justify-center">
          <svg
            className="size-3.5 text-primary-foreground"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>
    </div>
  )
}
