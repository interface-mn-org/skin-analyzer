import { PaymentShell } from '@/components/payment/payment-shell'
import { auth } from '@/lib/auth'
import { CREDITS_REQUIRED } from '@/lib/constants'
import { createPurchaseQueryOptions, creditsBalanceQueryOptions } from '@/lib/query/options'
import { createQueryClient } from '@/lib/query/query-client'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { redirect } from 'next/navigation'

export default async function PaymentStepPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/flow/capture')
  }

  const accessToken = session?.backendTokens?.accessToken
  if (!accessToken) {
    redirect('/flow/capture')
  }

  const queryClient = createQueryClient()
  const userId = session?.backendUser?.id ?? session?.user?.email ?? 'unknown'

  const userCredits = await queryClient.fetchQuery(
    creditsBalanceQueryOptions(accessToken, userId),
  )
  const hasEnoughCredits = userCredits.credits_balance >= CREDITS_REQUIRED

  if (hasEnoughCredits) {
    redirect('/flow/results')
  }

  try {
    await queryClient.prefetchQuery(
      createPurchaseQueryOptions(accessToken, userId, CREDITS_REQUIRED),
    )
  } catch (error) {
    console.error('Failed to prefetch purchase:', error)
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PaymentShell userId={userId} />
    </HydrationBoundary>
  )
}
