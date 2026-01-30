'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { IconArrowRight } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Spinner } from '../ui/spinner'

type CheckPurchaseButtonProps = {
  purchaseId?: string
  disabled?: boolean
  size?: 'sm' | 'lg' | 'default' | 'icon'
  className?: string
}

export function CheckPurchaseButton({
  purchaseId,
  disabled,
  size = 'lg',
  className,
}: CheckPurchaseButtonProps) {
  const [isChecking, setIsChecking] = useState(false)
  const router = useRouter()

  const handleCheck = async () => {
    if (disabled || isChecking) return
    if (!purchaseId) {
      toast.error('Missing purchase ID. Please refresh and try again.')
      return
    }
    setIsChecking(true)
    try {
      const res = await fetch('/api/check-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purchaseId }),
      })
      const data = (await res.json()) as {
        ok?: boolean
        paid?: boolean
        error?: string
      }
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Unable to check payment status.')
      }
      if (data.paid) {
        router.push('/flow/results')
        return
      }
      toast.info('Payment not received yet. Please try again shortly.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to check payment status.')
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <Button
      size={size}
      disabled={disabled || isChecking}
      className={cn('cursor-pointer', className)}
      onClick={handleCheck}
    >
      {isChecking ? <Spinner /> : null}
      I have paid <IconArrowRight className="size-4" />
    </Button>
  )
}
