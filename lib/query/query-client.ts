import { QueryClient, type DefaultOptions } from '@tanstack/react-query'

const defaultOptions: DefaultOptions = {
  queries: {
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 2,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
  },
  mutations: {
    retry: 0,
  },
}

export function createQueryClient() {
  return new QueryClient({ defaultOptions })
}
