import Link from 'next/link'

import { LogoutButton } from '@/components/auth/logout-button'
import { CreditsBalanceCard } from '@/components/credits-balance'
import { Button } from '@/components/ui/button'
import { landingContents } from '@/lib/contents/landing'

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-background via-background to-muted/40 text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-[-6%] h-64 w-64 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-[-4%] h-72 w-72 rounded-full bg-muted/60 blur-3xl"
      />
      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-16">
        <div className="flex w-full items-center justify-between gap-3 pb-8">
          <CreditsBalanceCard />
          <LogoutButton />
        </div>
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
              {landingContents.badge}
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {landingContents.badgeSuffix}
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
                {landingContents.title}
              </h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                {landingContents.description}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button asChild size="lg">
                <Link href="/flow">{landingContents.cta}</Link>
              </Button>
              <span className="text-xs text-muted-foreground sm:text-sm">
                {landingContents.hint}
              </span>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card/70 p-6 shadow-lg">
            <div className="space-y-5">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {landingContents.panelTitle}
                </p>
                <p className="text-base font-semibold text-foreground">
                  {landingContents.panelSubtitle}
                </p>
              </div>
              <ul className="space-y-4">
                {landingContents.highlights.map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_0_6px] shadow-primary/15" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="rounded-2xl bg-muted px-4 py-3 text-xs text-muted-foreground">
                {landingContents.privacyNote}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
