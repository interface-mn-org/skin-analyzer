'use client'

import { createTask } from '@/lib/api/create-task'
import { startAnalyzeAndUpload } from '@/lib/api/start-analyze'
import { CAPTURED_IMAGES_KEY } from '@/lib/constants'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Spinner } from '../ui/spinner'
type StoredCapture = {
  image: string
  width: number
  height: number
  phase: number
}

export default function ResultsStepWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isUploading, setIsUploading] = useState(true)

  const getImagesFromSessionStorage = () => {
    const raw = sessionStorage.getItem(CAPTURED_IMAGES_KEY)
    if (!raw) return []
    const images = JSON.parse(raw) as StoredCapture[]
    return images
  }

  const uploadImagesToServer = async (): Promise<{
    youCamFileId: string
    taskId: string
  } | null> => {
    const images = getImagesFromSessionStorage()
    if (!images.length || !images[0]?.image) {
      throw new Error('Зураг авсан мэдээлэл олдсонгүй. Дахин зураг авна уу.')
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
      throw new Error(data.error || 'Байршуулахад алдаа гарлаа.')
    }

    const photoFileId = data.file.id
    const youCamFileId = await startAnalyzeAndUpload(file)

    const taskId = await createTask({
      src_file_id: youCamFileId,
      dst_actions: ['wrinkle', 'pore', 'texture', 'acne'],
      photo_file_id: photoFileId,
    })

    return { youCamFileId, taskId }
  }

  useEffect(() => {
    if (searchParams.get('id')) {
      setIsUploading(false)
      return
    }

    uploadImagesToServer()
      .then((result) => {
        if (result) {
          const params = new URLSearchParams()
          params.set('id', result.youCamFileId)
          params.set('taskId', result.taskId)
          router.replace(`/flow/results?${params.toString()}`)
        }
      })
      .catch((error) => {
        toast.error(
          error instanceof Error ? error.message : 'Зургуудыг серверт байршуулахад алдаа гарлаа.',
        )
        router.push('/flow/capture')
      })
      .finally(() => {
        setIsUploading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative min-h-svh">
      {children}
      {isUploading && (
        <div className="absolute inset-0 flex justify-center items-center bg-background/50 backdrop-blur-sm">
          <Spinner className="size-8 text-primary" />
        </div>
      )}
    </div>
  )
}
