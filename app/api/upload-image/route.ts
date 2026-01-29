import { NextRequest, NextResponse } from 'next/server'

import { uploadImageFile } from '@/lib/api/files'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await auth()
  const accessToken = session?.backendTokens?.accessToken

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file')

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'file is required' }, { status: 400 })
  }

  try {
    const uploaded = await uploadImageFile(file)
    return NextResponse.json({ ok: true, file: uploaded })
  } catch (err: unknown) {
    console.error(err)
    const message =
      typeof err === 'object' && err !== null && 'error' in err
        ? String((err as { error: unknown }).error)
        : 'Upload failed'

    return NextResponse.json({ error: message }, { status: 400 })
  }
}
