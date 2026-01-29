import { getCreditsBalance } from '@/lib/api/credits'
import { auth } from '@/lib/auth'

export async function CreditsBalanceCard() {
  const session = await auth()
  const accessToken = session?.backendTokens?.accessToken
  console.log('accessToken', session)

  if (!accessToken) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 text-xs font-medium text-muted-foreground">
        Sign in to view credits
      </div>
    )
  }

  const { credits_balance } = await getCreditsBalance()
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-xs font-medium text-foreground shadow-sm">
      <span className="text-muted-foreground">Credits</span>
      <span className="font-bold">{credits_balance}</span>
    </div>
  )
}
