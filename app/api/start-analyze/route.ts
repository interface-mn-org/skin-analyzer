import { authorizedFetch } from '@/lib/api/authorized-fetch'
import { auth } from '@/lib/auth'
import type { StartAnalyzeRequestBody, StartAnalyzeResponse } from '@/types/files-api'
import { NextRequest, NextResponse } from 'next/server'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8081'

export async function POST(req: NextRequest) {
  const session = await auth()
  const accessToken = session?.backendTokens?.accessToken

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  let body: StartAnalyzeRequestBody
  try {
    body = (await req.json()) as StartAnalyzeRequestBody
  } catch {
    return NextResponse.json({ error: 'files metadata is required' }, { status: 400 })
  }

  if (!body?.files?.length) {
    return NextResponse.json({ error: 'files metadata is required' }, { status: 400 })
  }

  try {
    const res = await authorizedFetch(`${API_BASE}/api/start-analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }))
      return NextResponse.json(err as { error: string }, { status: res.status })
    }

    const data = (await res.json()) as StartAnalyzeResponse
    if (!data.upload_request?.url || !data.file_id) {
      return NextResponse.json({ error: 'Invalid upload metadata response' }, { status: 502 })
    }

    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Start analyze failed' },
      { status: 500 },
    )
  }
}
