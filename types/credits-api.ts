export type CreditPurchaseStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED'

export type QPayUrl = {
  name: string
  description: string
  link: string
}

export type CreditBalanceResponse = {
  credits_balance: number
}

export type CreditPurchaseListItem = {
  id: string
  credits: number
  amount_mnt: number
  status: CreditPurchaseStatus
  qpay_invoice_id: string | null
  qpay_qr_text: string | null
  qpay_qr_image: string | null
  qpay_urls: QPayUrl[] | null
  created_at: string
  paid_at: string | null
}

export type ListPurchasesResponse = {
  purchases: CreditPurchaseListItem[]
}

export type CreatePurchaseRequest = {
  credits: number
}

export type CreatePurchaseResponse = {
  purchase_id: string
  credits: number
  amount_mnt: number
  status: CreditPurchaseStatus
  qpay: {
    invoice_id: string
    qr_text: string
    qr_image: string
    urls: QPayUrl[]
  }
}

export type CheckPurchaseResponse = {
  purchase_id: string
  status: CreditPurchaseStatus
  paid: boolean
  credits_balance: number
}

export type QPayCallbackResponse = {
  ok: true
} & CheckPurchaseResponse

export type ApiError = {
  error: string
}
