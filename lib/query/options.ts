import { apiGetResultById, apiListResults } from '@/lib/api/result'
import {
  checkCreditPurchase,
  createCreditPurchase,
  getCreditsBalance,
  listCreditPurchases,
} from '@/lib/api/credits'
import { queryKeys } from '@/lib/query/query-keys'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8081'

export const creditsBalanceQueryOptions = (accessToken: string, userId?: string) => ({
  queryKey: queryKeys.creditsBalance(userId),
  queryFn: () => getCreditsBalance(accessToken),
  staleTime: 30_000,
})

export const creditPurchasesQueryOptions = (accessToken: string, userId?: string) => ({
  queryKey: queryKeys.creditPurchases(userId),
  queryFn: () => listCreditPurchases(accessToken),
  staleTime: 60_000,
})

export const resultsListQueryOptions = (accessToken: string, userId?: string) => ({
  queryKey: queryKeys.resultsList(userId),
  queryFn: () => apiListResults({ baseUrl: API_BASE, token: accessToken }),
  staleTime: 60_000,
})

export const resultByIdQueryOptions = (accessToken: string, id: string) => ({
  queryKey: queryKeys.resultById(id),
  queryFn: () => apiGetResultById(id, { baseUrl: API_BASE, token: accessToken }),
  staleTime: 5 * 60_000,
})

export const createPurchaseQueryOptions = (
  accessToken: string,
  userId: string | undefined,
  credits: number,
) => ({
  queryKey: ['credits', 'purchase', userId, 'create', credits] as const,
  queryFn: () => createCreditPurchase(accessToken, { credits }),
  staleTime: Infinity,
  gcTime: 10 * 60_000,
  retry: 1,
  refetchOnWindowFocus: false,
})

export const checkPurchaseMutationOptions = (
  accessToken: string,
  purchaseId: string,
) => ({
  mutationKey: [...queryKeys.creditPurchase(purchaseId), 'check'] as const,
  mutationFn: () => checkCreditPurchase(accessToken, purchaseId),
})
