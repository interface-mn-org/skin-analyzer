import type { ReactNode } from 'react'

// bg-[radial-gradient(900px_circle_at_8%_10%,rgba(14,165,233,0.16),transparent_60%),radial-gradient(700px_circle_at_92%_8%,rgba(16,185,129,0.18),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,1),rgba(248,250,252,1))]
export function FlowShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen text-foreground">
      <div className="relative mx-auto flex max-w-7xl flex-col gap-8">{children}</div>
    </div>
  )
}
