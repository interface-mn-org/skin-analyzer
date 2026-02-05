'use client'

import { Button } from '@/components/ui/button'
import { checkCreditPurchase } from '@/lib/api/credits'
import { queryKeys } from '@/lib/query/query-keys'
import { cn } from '@/lib/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { IconArrowRight } from '@tabler/icons-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
  const { data: session } = useSession()
  const accessToken = session?.backendTokens?.accessToken
  const userId = session?.backendUser?.id
  const queryClient = useQueryClient()

  const checkMutation = useMutation({
    mutationFn: async () => {
      if (!accessToken) {
        throw new Error('Нэвтэрсэн эрх баталгаажаагүй байна.')
      }
      if (!purchaseId) {
        throw new Error('Төлбөрийн дугаар олдсонгүй. Дахин оролдоно уу.')
      }
      return checkCreditPurchase(accessToken, purchaseId)
    },
    onSuccess: (data) => {
      if (data.paid) {
        if (userId) {
          queryClient.setQueryData(queryKeys.creditsBalance(userId), {
            credits_balance: data.credits_balance,
          })
          queryClient.invalidateQueries({ queryKey: queryKeys.creditPurchases(userId) })
        }
        toast.success('Төлбөр амжилттай баталгаажлаа.')
        router.push('/flow/results')
        return
      }
      toast.info('Төлбөр хараахан баталгаажаагүй байна. Түр хүлээгээд дахин шалгана уу.')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Төлбөрийн төлөв шалгахад алдаа гарлаа.')
    },
  })

  const handleCheck = async () => {
    if (disabled || checkMutation.isPending) return
    if (!purchaseId) {
      toast.error('Төлбөрийн дугаар олдсонгүй. Дахин оролдоно уу.')
      return
    }
    checkMutation.mutate()
  }

  return (
    <Button
      size={size}
      disabled={disabled || checkMutation.isPending}
      className={cn('cursor-pointer', className)}
      onClick={handleCheck}
      aria-busy={checkMutation.isPending}
    >
      {checkMutation.isPending ? <Spinner /> : null}
      {checkMutation.isPending ? 'Шалгаж байна…' : 'Төлсөн'} <IconArrowRight className="size-4" />
    </Button>
  )
}
