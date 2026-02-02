import { ResultsByIdView } from '@/components/results/results-by-id-view'
import { apiGetResultById } from '@/lib/api/result'
import { auth } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8081'

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

  let result
  try {
    result = await apiGetResultById(id, {
      baseUrl: API_BASE,
      token: accessToken,
    })
  } catch {
    notFound()
  }

  if (result.status !== 'success' || result.error_code) {
    notFound()
  }

  return <ResultsByIdView result={result} />
}
