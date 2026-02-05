import { auth } from '@/lib/auth'
import { creditsBalanceQueryOptions } from '@/lib/query/options'
import { createQueryClient } from '@/lib/query/query-client'

export async function CreditsBalanceCard() {
  const session = await auth()
  const accessToken = session?.backendTokens?.accessToken

  if (!accessToken) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 text-xs font-medium text-muted-foreground">
        Sign in to view credits
      </div>
    )
  }

  const queryClient = createQueryClient()
  const { credits_balance } = await queryClient.fetchQuery(
    creditsBalanceQueryOptions(accessToken, session?.backendUser?.id),
  )
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-xs font-medium text-foreground shadow-sm">
      <span className="text-muted-foreground">Credits</span>
      <span className="font-bold">{credits_balance}</span>
    </div>
  )
}
