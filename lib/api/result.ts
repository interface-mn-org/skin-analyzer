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
    cache: 'no-store',
  })
  if (!res.ok) {
    const err = (await res.json()) as ApiErrorResponse
    throw new Error(err.error ?? res.statusText)
  }
  const data = (await res.json()) as ResultListResponse | ResultListItem[]
  const results = Array.isArray(data) ? data : (data.results ?? [])
  return { results }
}

export async function apiGetResultById(
  id: string,
  options: { baseUrl?: string; token: string },
): Promise<ResultResponse> {
  const base = options.baseUrl ?? ''
  const res = await fetch(`${base}/api/results/${id}`, {
    headers: { Authorization: `Bearer ${options.token}` },
    cache: 'no-store',
  })
  if (!res.ok) {
    const err = (await res.json()) as ApiErrorResponse
    throw new Error(err.error ?? res.statusText)
  }
  return res.json() as Promise<ResultResponse>
}
