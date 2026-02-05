'use client'

import { Button } from '@/components/ui/button'
import { getCreditsBalance } from '@/lib/api/credits'
import { uploadImageFile } from '@/lib/api/files'
import { CAPTURED_IMAGES_KEY, CREDITS_REQUIRED } from '@/lib/constants'
import { creditsBalanceQueryOptions } from '@/lib/query/options'
import { useMutation, useQuery } from '@tanstack/react-query'
import { IconArrowRight } from '@tabler/icons-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Spinner } from '../ui/spinner'

type StoredCapture = {
  image: string
  width: number
  height: number
  phase: number
}

export function ContinueToAnalyticsButton() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { data: session, status } = useSession()
  const accessToken = session?.backendTokens?.accessToken
  const userId = session?.backendUser?.id
  const isAuthenticated = Boolean(accessToken)

  const creditsQuery = useQuery({
    queryKey: creditsBalanceQueryOptions(accessToken ?? 'missing', userId).queryKey,
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('Нэвтэрсэн эрх баталгаажаагүй байна.')
      }
      return getCreditsBalance(accessToken)
    },
    enabled: false,
  })

  const uploadMutation = useMutation({
    mutationFn: async () => {
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
      return { uploaded }
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Байршуулахад алдаа гарлаа.')
    },
  })

  const handleContinue = async () => {
    if (uploadMutation.isPending || status === 'loading') return
    setError(null)
    try {
      if (!accessToken) {
        throw new Error('Нэвтэрсэн эрх баталгаажаагүй байна.')
      }
      const result = await uploadMutation.mutateAsync()
      const balanceResult = await creditsQuery.refetch()
      const balance = balanceResult.data
      if (!balance) {
        throw new Error('Кредитийн мэдээлэл олдсонгүй.')
      }
      sessionStorage.removeItem(CAPTURED_IMAGES_KEY)
      if (balance.credits_balance >= CREDITS_REQUIRED) {
        router.push('/flow/results')
        return
      }
      router.push(`/flow/payment?id=${encodeURIComponent(result.uploaded.id)}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Байршуулахад алдаа гарлаа.')
    }
  }

  return (
    <div className="space-y-3">
      {!isAuthenticated && status === 'unauthenticated' ? (
        <p className="text-xs text-muted-foreground" role="status" aria-live="polite">
          Нэвтэрч үргэлжлүүлнэ үү.
        </p>
      ) : null}
      {error ? (
        <p className="text-sm text-destructive" role="status" aria-live="polite">
          {error}
        </p>
      ) : null}
      <Button
        size="lg"
        onClick={handleContinue}
        disabled={uploadMutation.isPending || status === 'loading' || !isAuthenticated}
        aria-busy={uploadMutation.isPending}
      >
        {uploadMutation.isPending ? <Spinner /> : null}
        {uploadMutation.isPending ? 'Боловсруулж байна…' : 'Үргэлжлүүлэх'}{' '}
        <IconArrowRight className="size-4" />
      </Button>
    </div>
  )
}
