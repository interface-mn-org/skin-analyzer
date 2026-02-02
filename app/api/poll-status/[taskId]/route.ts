import { authorizedFetch } from '@/lib/api/authorized-fetch'
import { auth } from '@/lib/auth'
import type { PollStatusResponse } from '@/types/files-api'
import { NextRequest, NextResponse } from 'next/server'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8081'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ taskId: string }> }) {
  const session = await auth()
  const accessToken = session?.backendTokens?.accessToken

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { taskId } = await params
  if (!taskId) {
    return NextResponse.json({ error: 'taskId is required' }, { status: 400 })
  }

  try {
    const res = await authorizedFetch(`${API_BASE}/api/poll-status/${encodeURIComponent(taskId)}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }))
      return NextResponse.json(err as { error: string }, { status: res.status })
    }

    const data = (await res.json()) as PollStatusResponse
    if (!data?.data) {
      return NextResponse.json({ error: 'Invalid poll-status response' }, { status: 502 })
    }

    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Poll status failed' },
      { status: 500 },
    )
  }
}
