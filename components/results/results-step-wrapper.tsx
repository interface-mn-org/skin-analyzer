'use client'

import { createTask } from '@/lib/api/create-task'
import { uploadImageFile } from '@/lib/api/files'
import { startAnalyzeAndUpload } from '@/lib/api/start-analyze'
import { CAPTURED_IMAGES_KEY } from '@/lib/constants'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
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
  const { data: session, status } = useSession()
  const accessToken = session?.backendTokens?.accessToken
  const userId = session?.backendUser?.id ?? 'anonymous'
  const existingId = searchParams.get('id')
  const taskIdParam = searchParams.get('taskId')

  const captureKey = useMemo(() => {
    if (typeof window === 'undefined') return 'server'
    const raw = sessionStorage.getItem(CAPTURED_IMAGES_KEY)
    if (!raw) return 'missing'
    try {
      const images = JSON.parse(raw) as StoredCapture[]
      const first = images[0]?.image
      if (!first) return 'empty'
      return `${first.length}:${first.slice(0, 24)}`
    } catch {
      return 'invalid'
    }
  }, [])

  const uploadQuery = useQuery({
    queryKey: ['analysis-upload', userId, captureKey],
    enabled: Boolean(accessToken) && !existingId && !taskIdParam && status !== 'loading',
    retry: 0,
    staleTime: Infinity,
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('Нэвтэрсэн эрх баталгаажаагүй байна.')
      }

      const raw = sessionStorage.getItem(CAPTURED_IMAGES_KEY)
      if (!raw) {
        throw new Error('Зураг авсан мэдээлэл олдсонгүй. Дахин зураг авна уу.')
      }
      const images = JSON.parse(raw) as StoredCapture[]
      if (!images.length || !images[0]?.image) {
        throw new Error('Зураг авсан мэдээлэл олдсонгүй. Дахин зураг авна уу.')
      }

      const blob = await fetch(images[0].image).then((res) => res.blob())
      const type = blob.type || 'image/jpeg'
      const extension = type.split('/')[1] || 'jpg'
      const file = new File([blob], `capture-0.${extension}`, { type })

      const uploaded = await uploadImageFile(accessToken, file)
      const youCamFileId = await startAnalyzeAndUpload(file, accessToken)

      const taskId = await createTask({
        accessToken,
        src_file_id: youCamFileId,
        dst_actions: ['wrinkle', 'pore', 'texture', 'acne'],
        photo_file_id: uploaded.id,
      })

      return { youCamFileId, taskId }
    },
    onSuccess: (result) => {
      if (result) {
        sessionStorage.removeItem(CAPTURED_IMAGES_KEY)
        const params = new URLSearchParams()
        params.set('id', result.youCamFileId)
        params.set('taskId', result.taskId)
        router.replace(`/flow/results?${params.toString()}`)
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Зургуудыг серверт байршуулахад алдаа гарлаа.',
      )
      router.push('/flow/capture')
    },
  })

  const isUploading =
    !existingId &&
    !taskIdParam &&
    (uploadQuery.isPending || uploadQuery.isFetching || status === 'loading')

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
