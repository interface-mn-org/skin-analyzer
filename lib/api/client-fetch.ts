const DEFAULT_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8081'

type ApiErrorBody = {
  error?: string
  message?: string
}

async function parseErrorMessage(res: Response): Promise<string> {
  const text = await res.text()
  if (!text) return res.statusText
  try {
    const parsed = JSON.parse(text) as ApiErrorBody
    return parsed.error ?? parsed.message ?? text
  } catch {
    return text
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { accessToken: string; baseUrl?: string },
): Promise<T> {
  const { accessToken, baseUrl, ...init } = options
  const base = baseUrl ?? DEFAULT_API_BASE
  const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? '' : '/'}${path}`

  const headers = new Headers(init.headers)
  headers.set('Authorization', `Bearer ${accessToken}`)
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json')
  }

  const res = await fetch(url, {
    ...init,
    headers,
    cache: init.cache ?? 'no-store',
  })

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res))
  }

  if (res.status === 204) {
    return {} as T
  }

  return (await res.json()) as T
}
