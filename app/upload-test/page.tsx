'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import type { FileRecord } from '@/types/files-api'

export default function UploadTestPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<FileRecord | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null
    setFile(nextFile)
    setError(null)
    setResult(null)
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select an image to upload.')
      return
    }

    setIsUploading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      const data = (await res.json()) as { ok?: boolean; file?: FileRecord; error?: string }

      if (!res.ok || !data.ok || !data.file) {
        throw { error: data.error || 'Upload failed' }
      }

      setResult(data.file)
    } catch (err: unknown) {
      console.error(err)
      const message =
        typeof err === 'object' && err !== null && 'error' in err
          ? String((err as { error: unknown }).error)
          : 'Upload failed'

      setError(message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-lg font-semibold">Image Upload Test</h1>
        <p className="text-sm text-muted-foreground">
          Select an image and upload it using the JWT-protected upload flow. This page is intended
          for testing and debugging the upload integration.
        </p>

        <div className="space-y-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="block w-full text-sm file:mr-3 file:rounded-md file:border file:border-border file:bg-muted file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-foreground hover:file:bg-muted/80"
          />
          {file ? (
            <p className="text-xs text-muted-foreground">
              Selected:{' '}
              <span className="font-medium text-foreground">
                {file.name} ({Math.round(file.size / 1024)} KB)
              </span>
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">No file selected yet.</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? 'Uploading…' : 'Upload image'}
          </Button>
          {isUploading && (
            <span className="text-xs text-muted-foreground">Uploading, please wait…</span>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-1 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Upload complete</p>
            <p>
              <span className="font-semibold">File ID:</span> {result.id}
            </p>
            <p>
              <span className="font-semibold">Uploaded at:</span> {result.uploaded_at ?? 'pending'}
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
