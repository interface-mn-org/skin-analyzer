'use client'

import type { StartAnalyzeApiError, StartAnalyzeResponse } from '@/types/files-api'

/**
 * Start-analyze flow: send file metadata to POST /api/start-analyze,
 * then upload the file with PUT to the returned signed URL.
 * Returns file_id for use as src_file_id (e.g. create-task-and-poll).
 * This is a separate feature from /api/upload-image.
 */
export async function startAnalyzeAndUpload(file: File): Promise<string> {
  const metadata = {
    files: [
      {
        content_type: file.type || 'application/octet-stream',
        file_name: file.name,
        file_size: file.size,
      },
    ],
  }

  const res = await fetch('/api/start-analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(metadata),
  })

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as StartAnalyzeApiError
    throw new Error(data.error || res.statusText || 'Start analyze failed')
  }

  const data = (await res.json()) as StartAnalyzeResponse
  const { upload_request, file_id } = data
  console.log('upload_request', upload_request)
  console.log('file_id', file_id)

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
