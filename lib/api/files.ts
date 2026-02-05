import type {
  CompleteFileUploadResponse,
  FileApiError,
  FileRecord,
  RequestFileUploadBody,
  RequestFileUploadResponse,
} from '@/types/files-api'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8081'

function withAuthHeaders(accessToken: string, init?: HeadersInit) {
  const headers = new Headers(init)
  headers.set('Authorization', `Bearer ${accessToken}`)
  return headers
}

async function parseFileApiError(res: Response): Promise<FileApiError> {
  const text = await res.text()
  try {
    return JSON.parse(text) as FileApiError
  } catch {
    return { error: text || res.statusText }
  }
}

async function parseFileApiResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await parseFileApiError(res)
    throw new Error(err.error || res.statusText)
  }

  return res.json()
}

export async function requestFileUpload(
  accessToken: string,
  body: RequestFileUploadBody,
): Promise<RequestFileUploadResponse> {
  const res = await fetch(`${API_BASE}/files/upload`, {
    method: 'POST',
    headers: withAuthHeaders(accessToken, {
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(body),
    cache: 'no-store',
  })

  return parseFileApiResponse(res)
}

export async function completeFileUpload(
  accessToken: string,
  fileId: string,
): Promise<CompleteFileUploadResponse> {
  const res = await fetch(`${API_BASE}/files/${fileId}/complete`, {
    method: 'POST',
    headers: withAuthHeaders(accessToken),
    cache: 'no-store',
  })

  return parseFileApiResponse(res)
}

export type UploadImageResult = FileRecord

export async function uploadImageFile(
  accessToken: string,
  file: File,
): Promise<UploadImageResult> {
  const extension = (() => {
    const parts = file.name.split('.')
    if (parts.length <= 1) return ''
    return parts[parts.length - 1]
  })()

  const requestBody: RequestFileUploadBody = {
    content_type: file.type || 'application/octet-stream',
    size_bytes: file.size,
    original_name: file.name,
    extension,
    metadata: {
      source: 'web',
    },
  }

  const { file: createdFile, upload_url, headers } = await requestFileUpload(
    accessToken,
    requestBody,
  )
  const s3Res = await fetch(upload_url, {
    method: 'PUT',
    headers,
    body: file,
  })
  if (!s3Res.ok) {
    const text = await s3Res.text().catch(() => '')
    throw {
      error: text || 'S3 руу байршуулахад алдаа гарлаа.',
    } satisfies FileApiError
  }

  const { file: completedFile } = await completeFileUpload(accessToken, createdFile.id)

  return completedFile
}
