import type { ReactNode } from 'react'

// bg-[radial-gradient(900px_circle_at_8%_10%,rgba(14,165,233,0.16),transparent_60%),radial-gradient(700px_circle_at_92%_8%,rgba(16,185,129,0.18),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,1),rgba(248,250,252,1))]
export function FlowShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen text-foreground">
      {/* <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-72 w-80 -translate-x-1/2 rounded-full bg-linear-to-r from-sky-200/60 via-emerald-200/50 to-teal-100/60 blur-3xl" />
        <div className="absolute -bottom-24 right-[-8%] h-72 w-72 rounded-full bg-linear-to-tr from-slate-200/60 via-sky-100/50 to-emerald-100/60 blur-3xl" />
      </div> */}
      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
        {/* <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
            Skin Analyzer
          </p>
        </header> */}
        {children}
      </div>
    </div>
  )
}
