import { ResultsStepView } from '@/components/results/results-step-view'
import ResultsStepWrapper from '@/components/results/results-step-wrapper'
import { auth } from '@/lib/auth'
import { CREDITS_REQUIRED } from '@/lib/constants'
import { creditsBalanceQueryOptions } from '@/lib/query/options'
import { createQueryClient } from '@/lib/query/query-client'
import { redirect } from 'next/navigation'

export default async function ResultsStep() {
  const session = await auth()

  if (!session?.user) {
    redirect('/flow/capture')
  }

  const accessToken = session?.backendTokens?.accessToken
  if (!accessToken) {
    redirect('/flow/capture')
  }
  const queryClient = createQueryClient()
  const userCredits = await queryClient.fetchQuery(
    creditsBalanceQueryOptions(accessToken, session.backendUser?.id),
  )
  const hasEnoughCredits = userCredits.credits_balance >= CREDITS_REQUIRED

  if (!hasEnoughCredits) {
    redirect('/flow/payment')
  }

  return (
    <ResultsStepWrapper>
      <ResultsStepView />
    </ResultsStepWrapper>
  )
}
