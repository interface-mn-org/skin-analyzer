import { NextRequest, NextResponse } from 'next/server'

import { checkCreditPurchase } from '@/lib/api/credits'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await auth()
  const accessToken = session?.backendTokens?.accessToken

  if (!accessToken) {
    return NextResponse.json({ error: 'Нэвтэрсэн эрх баталгаажаагүй байна.' }, { status: 401 })
  }

  const { purchaseId } = (await req.json().catch(() => ({}))) as {
    purchaseId?: string
  }

  if (!purchaseId) {
    return NextResponse.json({ error: 'purchaseId заавал шаардлагатай.' }, { status: 400 })
  }

  try {
    const status = await checkCreditPurchase(purchaseId)
    return NextResponse.json({ ok: true, ...status })
  } catch (err: unknown) {
    const message =
      typeof err === 'object' && err !== null && 'error' in err
        ? String((err as { error: unknown }).error)
        : 'Шалгалт амжилтгүй боллоо.'

    return NextResponse.json({ error: message }, { status: 400 })
  }
}
