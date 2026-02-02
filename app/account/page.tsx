import { redirect } from 'next/navigation'

import Image from 'next/image'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getCreditsBalance, listCreditPurchases } from '@/lib/api/credits'
import { apiListResults } from '@/lib/api/result'
import { auth } from '@/lib/auth'
import type { CreditPurchaseListItem } from '@/types/credits-api'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8081'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'MNT',
  maximumFractionDigits: 0,
})

function formatStatus(status: CreditPurchaseListItem['status']) {
  switch (status) {
    case 'PAID':
      return {
        label: 'Paid',
        className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
      }
    case 'PENDING':
      return {
        label: 'Pending payment',
        className: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
      }
    case 'CANCELLED':
      return {
        label: 'Cancelled',
        className: 'bg-muted text-muted-foreground border-border/60',
      }
    case 'EXPIRED':
      return {
        label: 'Expired',
        className: 'bg-destructive/10 text-destructive border-destructive/30',
      }
    default:
      return {
        label: status,
        className: 'bg-muted text-muted-foreground border-border/60',
      }
  }
}

export default async function AccountPage() {
  const session = await auth()
  const user = session?.backendUser

  if (!user) {
    redirect('/')
  }

  const accessToken = session?.backendTokens?.accessToken
  if (!accessToken) {
    redirect('/')
  }

  const [balance, purchasesResponse, resultsResponse] = await Promise.all([
    getCreditsBalance(),
    listCreditPurchases(),
    apiListResults({ baseUrl: API_BASE, token: accessToken }).catch(() => ({ results: [] })),
  ])

  const results = [...resultsResponse.results].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )

  const purchases = [...purchasesResponse.purchases].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/40">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 pb-16 pt-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            {user.avatarUrl && (
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border/70 bg-muted">
                <Image
                  src={user.avatarUrl}
                  alt={user.name ?? user.email ?? 'User avatar'}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {user.name || 'Account'}
              </h1>
              <p className="text-xs text-muted-foreground sm:text-[13px]">{user.email}</p>
            </div>
          </div>
          <p className="max-w-prose text-sm text-muted-foreground">
            View your current credit balance and payment history. This page gives you a clear,
            minimal overview of how you&apos;ve been using Skin Analyzer.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-border/80 bg-card/80">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between gap-3">
                <span>Credits overview</span>
                <Badge variant="outline" className="text-xs font-normal">
                  {user.email ?? 'Signed in'}
                </Badge>
              </CardTitle>
              <CardDescription>
                Your current balance and recent activity at a glance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-baseline gap-3">
                <span className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
                  Available credits
                </span>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-semibold leading-none tracking-tight sm:text-5xl">
                  {balance.credits_balance}
                </span>
                <span className="pb-1 text-sm text-muted-foreground">credits</span>
              </div>
              <Separator />
              <p className="text-xs text-muted-foreground">
                Each analysis consumes a small number of credits. When your balance runs low,
                purchase additional credits to keep using Skin Analyzer without interruption.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/80 bg-card/80">
            <CardHeader className="pb-3">
              <CardTitle>Payment history</CardTitle>
              <CardDescription>Your most recent credit purchases.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {purchases.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  You haven&apos;t purchased any credits yet. Once you do, they&apos;ll show up here
                  with status and timestamps.
                </p>
              ) : (
                <div className="space-y-3">
                  {purchases.map((purchase) => {
                    const status = formatStatus(purchase.status)
                    const createdAt = dateFormatter.format(new Date(purchase.created_at))
                    const amountLabel = currencyFormatter.format(purchase.amount_mnt)

                    return (
                      <div
                        key={purchase.id}
                        className="rounded-lg border border-border/80 bg-background/60 px-3 py-2.5 text-xs sm:text-sm"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              {purchase.credits} credits
                            </span>
                            <span className="text-[11px] text-muted-foreground">{amountLabel}</span>
                          </div>
                          <Badge
                            variant="outline"
                            className={`border ${status.className} px-2 py-0 text-[10px] sm:text-xs`}
                          >
                            {status.label}
                          </Badge>
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
                          <span>{createdAt}</span>
                          {purchase.paid_at && (
                            <span>Paid at {dateFormatter.format(new Date(purchase.paid_at))}</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Results list */}
        <Card className="border-border/80 bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle>Your results</CardTitle>
            <CardDescription>Past skin analyses. Tap one to view the full report.</CardDescription>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                You don&apos;t have any results yet. Complete an analysis from the flow to see
                reports here.
              </p>
            ) : (
              <ul className="space-y-2">
                {results.map((item) => {
                  if (item.status !== 'success') {
                    return null
                  }
                  return (
                    <li key={item.id}>
                      <Link
                        href={`/account/results/${item.id}`}
                        className="block rounded-lg border border-border/80 bg-background/60 px-3 py-2.5 text-sm transition-colors hover:bg-muted/50"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-medium text-foreground">Analysis #{item.id}</span>
                          <Badge variant="outline" className="text-xs font-normal capitalize">
                            {item.status}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {dateFormatter.format(new Date(item.created_at))}
                        </p>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
