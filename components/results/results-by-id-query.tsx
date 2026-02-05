'use client'

import { ResultsByIdView } from '@/components/results/results-by-id-view'
import { Skeleton } from '@/components/ui/skeleton'
import { resultByIdQueryOptions } from '@/lib/query/options'
import type { ResultResponse } from '@/lib/api/result'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

type Props = {
  resultId: string
}

export function ResultsByIdQuery({ resultId }: Props) {
  const { data: session } = useSession()
  const accessToken = session?.backendTokens?.accessToken

  const query = useQuery({
    ...resultByIdQueryOptions(accessToken ?? 'missing', resultId),
    enabled: Boolean(accessToken),
    placeholderData: (prev) => prev,
  })

  if (query.isPending && !query.data) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <div className="space-y-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-20 w-full" />
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (query.isError || !query.data) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-10 text-center">
        <p className="text-sm text-destructive">
          {(query.error as Error | undefined)?.message ?? 'Үр дүнг авахад алдаа гарлаа.'}
        </p>
      </div>
    )
  }

  const result = query.data as ResultResponse

  if (result.status !== 'success' || result.error_code) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-10 text-center">
        <p className="text-sm text-destructive">Үр дүн одоогоор бэлэн биш байна.</p>
      </div>
    )
  }

  return <ResultsByIdView result={result} />
}
