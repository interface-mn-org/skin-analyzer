import { redirect } from 'next/navigation'

import { AccountClient } from '@/components/account/account-client'
import { auth } from '@/lib/auth'
import { creditPurchasesQueryOptions, creditsBalanceQueryOptions, resultsListQueryOptions } from '@/lib/query/options'
import { createQueryClient } from '@/lib/query/query-client'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'

export default async function AccountPage() {
  const session = await auth()
  const user = session?.backendUser

  if (!user) {
    redirect('/')
  }

  const accessToken = session?.backendTokens?.accessToken
  if (!accessToken) {
    redirect('/')
  }

  const queryClient = createQueryClient()

  await Promise.allSettled([
    queryClient.prefetchQuery(creditsBalanceQueryOptions(accessToken, user.id)),
    queryClient.prefetchQuery(creditPurchasesQueryOptions(accessToken, user.id)),
    queryClient.prefetchQuery(resultsListQueryOptions(accessToken, user.id)),
  ])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AccountClient user={user} />
    </HydrationBoundary>
  )
}
