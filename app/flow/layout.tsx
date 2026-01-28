import type { ReactNode } from 'react'

import { auth } from '@/lib/auth'
import type { FlowStep } from '@/components/ui/flow-progress'
import { FlowShell } from './flow-shell'

const allSteps: FlowStep[] = [
  { title: 'Capture image', href: '/flow/capture' },
  { title: 'Register / login', href: '/flow/auth' },
  { title: 'Payment', href: '/flow/payment' },
  { title: 'Results', href: '/flow/results' },
]

export default async function FlowLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  const isLoggedIn = Boolean(session?.user)

  const steps = isLoggedIn ? allSteps.filter((step) => step.href !== '/flow/auth') : allSteps

  return <FlowShell steps={steps}>{children}</FlowShell>
}
