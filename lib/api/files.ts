import { authorizedFetch } from '@/lib/api/authorized-fetch'
import type {
  CompleteFileUploadResponse,
  FileApiError,
  FileRecord,
  RequestFileUploadBody,
  RequestFileUploadResponse,
} from '@/types/files-api'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8081'

async function parseFileApiError(res: Response): Promise<FileApiError> {
  try {
    return await res.json()
  } catch {
    return { error: await res.text() }
  }
}

async function parseFileApiResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw await parseFileApiError(res)
  }

  return res.json()
}

export async function requestFileUpload(
  body: RequestFileUploadBody,
): Promise<RequestFileUploadResponse> {
  const res = await authorizedFetch(`${API_BASE}/files/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  return parseFileApiResponse(res)
}

export async function completeFileUpload(fileId: string): Promise<CompleteFileUploadResponse> {
  const res = await authorizedFetch(`${API_BASE}/files/${fileId}/complete`, {
    method: 'POST',
  })

  return parseFileApiResponse(res)
}

export type UploadImageResult = FileRecord

export async function uploadImageFile(file: File): Promise<UploadImageResult> {
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

  const { file: createdFile, upload_url, headers } = await requestFileUpload(requestBody)
  console.log('upload_url', upload_url)
  console.log('headers', headers)
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

  const { file: completedFile } = await completeFileUpload(createdFile.id)

  return completedFile
}
