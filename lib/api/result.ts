/**
 * GET /api/results — list results.
 * GET /api/results/:id — single result.
 * Auth: Authorization: Bearer <token>
 */

export type ResultListItem = {
  id: number
  youcam_task_id: string
  status: string
  created_at: string
  completed_at: string | null
}

export type ResultListResponse = {
  results: ResultListItem[]
}

export type ResultResponse = {
  id: number
  youcam_task_id: string
  youcam_file_id: string
  file_id: string | null
  status: string
  error_code: string | null
  results: Record<string, unknown> | null
  created_at: string
  completed_at: string | null
}

export const mockResultResponse: ResultResponse = {
  id: 42,
  youcam_task_id: 'task_abc123',
  youcam_file_id: 'file_xyz789',
  file_id: '550e8400-e29b-41d4-a716-446655440000',
  status: 'completed',
  error_code: null,
  results: {
    output: [
      { type: 'wrinkle', ui_score: 72, raw_score: 0.72, mask_urls: [] },
      { type: 'pore', ui_score: 65, raw_score: 0.65, mask_urls: [] },
    ],
  },
  created_at: '2025-02-01T12:00:00.000Z',
  completed_at: '2025-02-01T12:01:00.000Z',
}

export type ApiErrorResponse = {
  error: string
}

export async function apiListResults(options: {
  baseUrl?: string
  token: string
}): Promise<ResultListResponse> {
  const base = options.baseUrl ?? ''
  const res = await fetch(`${base}/api/results`, {
    headers: { Authorization: `Bearer ${options.token}` },
  })
  if (!res.ok) {
    const err = (await res.json()) as ApiErrorResponse
    throw new Error(err.error ?? res.statusText)
  }
  const data = (await res.json()) as ResultListResponse | ResultListItem[]
  const results = Array.isArray(data) ? data : data.results ?? []
  return { results }
}

export async function apiGetResultById(
  id: string,
  options: { baseUrl?: string; token: string },
): Promise<ResultResponse> {
  const base = options.baseUrl ?? ''
  const res = await fetch(`${base}/api/results/${id}`, {
    headers: { Authorization: `Bearer ${options.token}` },
  })
  if (!res.ok) {
    const err = (await res.json()) as ApiErrorResponse
    throw new Error(err.error ?? res.statusText)
  }
  return res.json() as Promise<ResultResponse>
}
