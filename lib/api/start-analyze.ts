'use client'

import { apiRequest } from '@/lib/api/client-fetch'
import type { StartAnalyzeResponse } from '@/types/files-api'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8081'

/**
 * Start-analyze flow: send file metadata to POST /api/start-analyze,
 * then upload the file with PUT to the returned signed URL.
 * Returns file_id for use as src_file_id (e.g. create-task-and-poll).
 * This is a separate feature from /api/upload-image.
 */
export async function startAnalyzeAndUpload(
  file: File,
  accessToken: string,
): Promise<string> {
  const metadata = {
    files: [
      {
        content_type: file.type || 'application/octet-stream',
        file_name: file.name,
        file_size: file.size,
      },
    ],
  }

  const data = await apiRequest<StartAnalyzeResponse>('/api/start-analyze', {
    accessToken,
    baseUrl: API_BASE,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metadata),
  })

  const { upload_request, file_id } = data
  const putRes = await fetch(upload_request.url, {
    method: 'PUT',
    headers: {
      'Content-Type': upload_request.headers['Content-Type'],
      'Content-Length': upload_request.headers['Content-Length'],
    },
    body: file,
  })

  if (!putRes.ok) {
    const text = await putRes.text().catch(() => '')
    throw new Error(text || 'Upload to signed URL failed')
  }
  return file_id
}
