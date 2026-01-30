'use client'

import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Spinner } from '../ui/spinner'

const CAPTURED_IMAGES_KEY = 'skin-analyzer:capture-images'

type StoredCapture = {
  image: string
  width: number
  height: number
  phase: number
}

export function ContinueToAnalyticsButton() {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleContinue = async () => {
    if (isUploading) return
    setIsUploading(true)
    setError(null)
    try {
      const raw = sessionStorage.getItem(CAPTURED_IMAGES_KEY)
      if (!raw) {
        throw new Error('No captured image found. Please capture again.')
      }
      const images = JSON.parse(raw) as StoredCapture[]
      if (!images.length || !images[0]?.image) {
        throw new Error('No captured image found. Please capture again.')
      }

      const blob = await fetch(images[0].image).then((res) => res.blob())
      const type = blob.type || 'image/jpeg'
      const extension = type.split('/')[1] || 'jpg'
      const file = new File([blob], `capture-0.${extension}`, { type })
      const formData = new FormData()
      formData.set('file', file)

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })
      const data = (await res.json()) as { ok?: boolean; file?: { id?: string }; error?: string }
      if (!res.ok || !data.ok || !data.file?.id) {
        throw new Error(data.error || 'Upload failed')
      }

      const balanceRes = await fetch('/api/credits-balance', { method: 'GET' })
      const balanceData = (await balanceRes.json()) as {
        ok?: boolean
        credits_balance?: number
        error?: string
      }
      if (!balanceRes.ok || !balanceData.ok || typeof balanceData.credits_balance !== 'number') {
        throw new Error(balanceData.error || 'Unable to check credits balance')
      }

      sessionStorage.removeItem(CAPTURED_IMAGES_KEY)
      if (balanceData.credits_balance >= 10) {
        router.push('/flow/results')
        return
      }
      router.push(`/flow/payment?id=${encodeURIComponent(data.file.id)}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      setIsUploading(false)
      return
    }
    setIsUploading(false)
  }

  return (
    <div className="space-y-3">
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button size="lg" onClick={handleContinue} disabled={isUploading}>
        {isUploading ? <Spinner /> : null}
        Continue to Analytics <IconArrowRight className="size-4" />
      </Button>
    </div>
  )
}
