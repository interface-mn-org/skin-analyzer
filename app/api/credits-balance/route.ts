import { NextResponse } from 'next/server'

import { getCreditsBalance } from '@/lib/api/credits'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  const accessToken = session?.backendTokens?.accessToken

  if (!accessToken) {
    return NextResponse.json({ error: 'Нэвтэрсэн эрх баталгаажаагүй байна.' }, { status: 401 })
  }

  try {
    const { credits_balance } = await getCreditsBalance()
    return NextResponse.json({ ok: true, credits_balance })
  } catch (err: unknown) {
    const message =
      typeof err === 'object' && err !== null && 'error' in err
        ? String((err as { error: unknown }).error)
        : 'Кредитийн үлдэгдлийг авахад алдаа гарлаа.'

    return NextResponse.json({ error: message }, { status: 400 })
  }
}
