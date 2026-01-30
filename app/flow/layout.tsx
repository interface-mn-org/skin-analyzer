import type { ReactNode } from 'react'

import { FlowShell } from './flow-shell'

export default async function FlowLayout({ children }: { children: ReactNode }) {
  return <FlowShell>{children}</FlowShell>
}
