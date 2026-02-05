import type {
  ApiError,
  CheckPurchaseResponse,
  CreatePurchaseRequest,
  CreatePurchaseResponse,
  CreditBalanceResponse,
  ListPurchasesResponse,
} from '@/types/credits-api'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8081'

function withAuthHeaders(accessToken: string, init?: HeadersInit) {
  const headers = new Headers(init)
  headers.set('Authorization', `Bearer ${accessToken}`)
  return headers
}

async function parseError(res: Response): Promise<ApiError> {
  const text = await res.text()
  try {
    return JSON.parse(text) as ApiError
  } catch {
    return { error: text || res.statusText }
  }
}

async function parseResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await parseError(res)
    throw new Error(err.error || res.statusText)
  }

  return res.json()
}

export async function getCreditsBalance(accessToken: string): Promise<CreditBalanceResponse> {
  const res = await fetch(`${API_BASE}/credits/balance`, {
    method: 'GET',
    headers: withAuthHeaders(accessToken),
    cache: 'no-store',
  })

  return parseResponse(res)
}

export async function listCreditPurchases(accessToken: string): Promise<ListPurchasesResponse> {
  const res = await fetch(`${API_BASE}/credits/purchases`, {
    method: 'GET',
    headers: withAuthHeaders(accessToken),
    cache: 'no-store',
  })

  return parseResponse(res)
}

export async function createCreditPurchase(
  accessToken: string,
  body: CreatePurchaseRequest,
): Promise<CreatePurchaseResponse> {
  const res = await fetch(`${API_BASE}/credits/purchases`, {
    method: 'POST',
    headers: withAuthHeaders(accessToken, {
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(body),
    cache: 'no-store',
  })

  return parseResponse(res)
}

export async function checkCreditPurchase(
  accessToken: string,
  purchaseId: string,
): Promise<CheckPurchaseResponse> {
  const res = await fetch(`${API_BASE}/credits/purchases/${purchaseId}/check`, {
    method: 'POST',
    headers: withAuthHeaders(accessToken),
    cache: 'no-store',
  })

  return parseResponse(res)
}
