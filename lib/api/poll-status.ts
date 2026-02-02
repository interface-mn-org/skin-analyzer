'use client'

import type { PollStatusData, PollStatusResponse } from '@/types/files-api'

/**
 * Single fetch of /api/poll-status/{taskId}. No loop — call once on user action.
 */
export async function getTaskStatus(taskId: string): Promise<{
  data: PollStatusData
  output: unknown[]
  errorCode: string | undefined
  resultId: string | undefined
}> {
  const res = await fetch(`/api/poll-status/${encodeURIComponent(taskId)}`, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error((err as { error?: string }).error || 'Poll status failed')
  }
  const body = (await res.json()) as PollStatusResponse
  const data = body.data
  const output = data.results?.output ?? []
  const errorCode = data.error_code
  const resultId = data.result_id
  return { data, output, errorCode, resultId }
}
