import Link from 'next/link'
import type { ReactNode } from 'react'

import { ModeToggle } from '@/components/mode-toggle'

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 md:px-6">
          <Link
            href="/"
            className="text-xs font-semibold uppercase tracking-[0.35em] text-foreground transition-colors hover:text-muted-foreground"
          >
            Арьсны шинжилгээ
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/account"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Данс
            </Link>
            <ModeToggle />
          </div>
        </div>
      </header>
      {children}
    </div>
  )
}
