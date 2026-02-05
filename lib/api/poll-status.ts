'use client'

import { apiRequest } from '@/lib/api/client-fetch'
import type { PollStatusData, PollStatusResponse } from '@/types/files-api'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8081'

/**
 * Single fetch of /api/poll-status/{taskId}. No loop — call once on user action.
 */
export async function getTaskStatus(
  taskId: string,
  accessToken: string,
): Promise<{
  data: PollStatusData
  output: unknown[]
  errorCode: string | undefined
  resultId: string | undefined
}> {
  const body = await apiRequest<PollStatusResponse>(
    `/api/poll-status/${encodeURIComponent(taskId)}`,
    {
      accessToken,
      baseUrl: API_BASE,
      method: 'GET',
      headers: { Accept: 'application/json' },
    },
  )
  const data = body.data
  const output = data.results?.output ?? []
  const errorCode = data.error_code
  const resultId = data.result_id
  return { data, output, errorCode, resultId }
}
