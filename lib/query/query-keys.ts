export const queryKeys = {
  creditsBalance: (userId?: string) => ['credits', 'balance', userId] as const,
  creditPurchases: (userId?: string) => ['credits', 'purchases', userId] as const,
  creditPurchase: (purchaseId: string) => ['credits', 'purchase', purchaseId] as const,
  resultsList: (userId?: string) => ['results', 'list', userId] as const,
  resultById: (id: string) => ['results', 'detail', id] as const,
  taskStatus: (taskId: string) => ['task', 'status', taskId] as const,
}
