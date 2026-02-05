import { authorizedFetch } from '@/lib/api/authorized-fetch'
import type {
  ApiError,
  CheckPurchaseResponse,
  CreatePurchaseRequest,
  CreatePurchaseResponse,
  CreditBalanceResponse,
  ListPurchasesResponse,
} from '@/types/credits-api'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8081'

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
    throw await parseError(res)
  }

  return res.json()
}

export async function getCreditsBalance(): Promise<CreditBalanceResponse> {
  const res = await authorizedFetch(`${API_BASE}/credits/balance`, {
    method: 'GET',
  })

  return parseResponse(res)
}

export async function listCreditPurchases(): Promise<ListPurchasesResponse> {
  const res = await authorizedFetch(`${API_BASE}/credits/purchases`, {
    method: 'GET',
  })

  return parseResponse(res)
}

export async function createCreditPurchase(
  body: CreatePurchaseRequest,
): Promise<CreatePurchaseResponse> {
  const res = await authorizedFetch(`${API_BASE}/credits/purchases`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  return parseResponse(res)
}

export async function checkCreditPurchase(purchaseId: string): Promise<CheckPurchaseResponse> {
  const res = await authorizedFetch(`${API_BASE}/credits/purchases/${purchaseId}/check`, {
    method: 'POST',
  })

  return parseResponse(res)
}
