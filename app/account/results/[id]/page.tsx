import { ResultsByIdQuery } from '@/components/results/results-by-id-query'
import { auth } from '@/lib/auth'
import { resultByIdQueryOptions } from '@/lib/query/options'
import { createQueryClient } from '@/lib/query/query-client'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { notFound, redirect } from 'next/navigation'

type Props = { params: Promise<{ id: string }> }

export default async function AccountResultsByIdPage({ params }: Props) {
  const session = await auth()

  if (!session?.user) {
    redirect('/')
  }

  const accessToken = session?.backendTokens?.accessToken
  if (!accessToken) {
    redirect('/')
  }

  const { id } = await params
  const queryClient = createQueryClient()

  let result
  try {
    result = await queryClient.fetchQuery(resultByIdQueryOptions(accessToken, id))
  } catch {
    notFound()
  }

  if (result.status !== 'success' || result.error_code) {
    notFound()
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ResultsByIdQuery resultId={id} />
    </HydrationBoundary>
  )
}
