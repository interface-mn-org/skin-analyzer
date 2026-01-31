import { ResultsStepView } from '@/components/results/results-step-view'
import ResultsStepWrapper from '@/components/results/results-step-wrapper'
import { getCreditsBalance } from '@/lib/api/credits'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function ResultsStep() {
  const session = await auth()

  if (!session?.user) {
    redirect('/flow/capture')
  }

  const userCredits = await getCreditsBalance()
  const hasEnoughCredits = userCredits.credits_balance >= 10

  if (!hasEnoughCredits) {
    redirect('/flow/payment')
  }

  return (
    <ResultsStepWrapper>
      <ResultsStepView />
    </ResultsStepWrapper>
  )
}
