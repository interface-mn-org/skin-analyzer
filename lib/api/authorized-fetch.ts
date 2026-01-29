import { auth } from '@/lib/auth'

export async function authorizedFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const session = await auth()
  const accessToken = session?.backendTokens?.accessToken

  const headers = new Headers(init.headers)
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  return fetch(input, {
    ...init,
    headers,
  })
}
