'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { creditPurchasesQueryOptions, creditsBalanceQueryOptions, resultsListQueryOptions } from '@/lib/query/options'
import type { AuthUser } from '@/types/auth'
import type { CreditPurchaseListItem } from '@/types/credits-api'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

const dateFormatter = new Intl.DateTimeFormat('mn-MN', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const currencyFormatter = new Intl.NumberFormat('mn-MN', {
  style: 'currency',
  currency: 'MNT',
  maximumFractionDigits: 0,
})

function formatStatus(status: CreditPurchaseListItem['status']) {
  switch (status) {
    case 'PAID':
      return {
        label: 'Төлсөн',
        className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
      }
    case 'PENDING':
      return {
        label: 'Төлбөр хүлээгдэж байна',
        className: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
      }
    case 'CANCELLED':
      return {
        label: 'Цуцлагдсан',
        className: 'bg-muted text-muted-foreground border-border/60',
      }
    case 'EXPIRED':
      return {
        label: 'Хугацаа дууссан',
        className: 'bg-destructive/10 text-destructive border-destructive/30',
      }
    default:
      return {
        label: status,
        className: 'bg-muted text-muted-foreground border-border/60',
      }
  }
}

type Props = {
  user: AuthUser
}

export function AccountClient({ user }: Props) {
  const { data: session } = useSession()
  const accessToken = session?.backendTokens?.accessToken

  const balanceQuery = useQuery({
    ...creditsBalanceQueryOptions(accessToken ?? 'missing', user.id),
    enabled: Boolean(accessToken),
    placeholderData: (prev) => prev,
  })

  const purchasesQuery = useQuery({
    ...creditPurchasesQueryOptions(accessToken ?? 'missing', user.id),
    enabled: Boolean(accessToken),
    placeholderData: (prev) => prev,
    select: (data) => ({
      purchases: [...data.purchases].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
    }),
  })

  const resultsQuery = useQuery({
    ...resultsListQueryOptions(accessToken ?? 'missing', user.id),
    enabled: Boolean(accessToken),
    placeholderData: (prev) => prev,
    select: (data) => ({
      results: [...data.results].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
    }),
  })

  const balance = balanceQuery.data?.credits_balance
  const purchases = purchasesQuery.data?.purchases ?? []
  const results = resultsQuery.data?.results ?? []

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/40">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 pb-16 pt-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            {user.avatarUrl && (
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border/70 bg-muted">
                <Image
                  src={user.avatarUrl}
                  alt={user.name ?? user.email ?? 'Хэрэглэгчийн зураг'}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {user.name || 'Данс'}
              </h1>
              <p className="text-xs text-muted-foreground sm:text-[13px]">{user.email}</p>
            </div>
          </div>
          <p className="max-w-prose text-sm text-muted-foreground">
            Кредитийн үлдэгдэл болон төлбөрийн түүхээ эндээс харна уу. Энэ хуудас нь Арьсны
            шинжилгээг хэрхэн ашиглаж буй тань талаар товч, ойлгомжтой тоймыг өгнө.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-border/80 bg-card/80">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between gap-3">
                <span>Кредитийн тойм</span>
                <Badge variant="outline" className="text-xs font-normal">
                  {user.email ?? 'Нэвтэрсэн'}
                </Badge>
              </CardTitle>
              <CardDescription>
                Одоогийн үлдэгдэл болон сүүлийн үйл ажиллагааг нэг дор.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-baseline gap-3">
                <span className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
                  Боломжит кредит
                </span>
              </div>
              <div className="flex items-end gap-3">
                {balanceQuery.isPending && balance == null ? (
                  <Skeleton className="h-12 w-28" />
                ) : (
                  <span className="text-4xl font-semibold leading-none tracking-tight sm:text-5xl">
                    {balance ?? 0}
                  </span>
                )}
                <span className="pb-1 text-sm text-muted-foreground">кредит</span>
              </div>
              <Separator />
              <p className="text-xs text-muted-foreground">
                Нэг шинжилгээ тодорхой тооны кредит зарцуулна. Үлдэгдэл багассан тохиолдолд нэмэлт
                кредит худалдан авч, Арьсны шинжилгээг тасалдалгүй үргэлжлүүлнэ үү.
              </p>
              {balanceQuery.isError ? (
                <p className="text-xs text-destructive">
                  {(balanceQuery.error as Error | undefined)?.message ??
                    'Кредитийн үлдэгдэл авахад алдаа гарлаа.'}
                </p>
              ) : null}
            </CardContent>
          </Card>

          <Card className="border-border/80 bg-card/80">
            <CardHeader className="pb-3">
              <CardTitle>Төлбөрийн түүх</CardTitle>
              <CardDescription>Сүүлийн үеийн кредит худалдан авалтууд.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {purchasesQuery.isPending && purchases.length === 0 ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full" />
                  ))}
                </div>
              ) : purchases.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Та одоогоор кредит худалдан аваагүй байна. Худалдан авалт хиймэгц энд төлөв ба
                  цагийн тэмдэглэгээтэйгээр харагдана.
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
                              {purchase.credits} кредит
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
                            <span>
                              Төлсөн: {dateFormatter.format(new Date(purchase.paid_at))}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
              {purchasesQuery.isError ? (
                <p className="text-xs text-destructive">
                  {(purchasesQuery.error as Error | undefined)?.message ??
                    'Төлбөрийн түүх авахад алдаа гарлаа.'}
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/80 bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle>Таны үр дүн</CardTitle>
            <CardDescription>
              Өмнөх арьсны шинжилгээнүүд. Нэгийг дарж бүрэн тайланг үзнэ үү.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resultsQuery.isPending && results.length === 0 ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-14 w-full" />
                ))}
              </div>
            ) : results.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Одоогоор үр дүн алга. Урсгалаар шинжилгээ дуусгасны дараа тайлангууд энд харагдана.
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
                          <span className="font-medium text-foreground">
                            Шинжилгээ #{item.id}
                          </span>
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
            {resultsQuery.isError ? (
              <p className="text-xs text-destructive">
                {(resultsQuery.error as Error | undefined)?.message ??
                  'Үр дүнгийн жагсаалт авахад алдаа гарлаа.'}
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
