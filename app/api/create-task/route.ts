import { authorizedFetch } from '@/lib/api/authorized-fetch'
import { auth } from '@/lib/auth'
import type { CreateTaskRequestBody, CreateTaskResponse } from '@/types/files-api'
import { NextRequest, NextResponse } from 'next/server'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8081'

export async function POST(req: NextRequest) {
  const session = await auth()
  const accessToken = session?.backendTokens?.accessToken

  if (!accessToken) {
    return NextResponse.json({ error: 'Нэвтэрсэн эрх баталгаажаагүй байна.' }, { status: 401 })
  }

  let body: CreateTaskRequestBody
  try {
    body = (await req.json()) as CreateTaskRequestBody
  } catch {
    return NextResponse.json({ error: 'Хүсэлтийн бие заавал шаардлагатай.' }, { status: 400 })
  }

  if (!body?.src_file_id || !Array.isArray(body.dst_actions)) {
    return NextResponse.json(
      { error: 'src_file_id болон dst_actions заавал шаардлагатай.' },
      { status: 400 },
    )
  }

  try {
    const res = await authorizedFetch(`${API_BASE}/api/create-task`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        src_file_id: body.src_file_id,
        dst_actions: body.dst_actions,
        ...(body.photo_file_id != null && { photo_file_id: body.photo_file_id }),
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }))
      return NextResponse.json(err as { error: string }, { status: res.status })
    }

    const data = (await res.json()) as CreateTaskResponse
    if (!data.task_id) {
      return NextResponse.json({ error: 'create-task хариу мэдээлэл хүчингүй байна.' }, { status: 502 })
    }

    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Даалгавар үүсгэхэд алдаа гарлаа.' },
      { status: 500 },
    )
  }
}
