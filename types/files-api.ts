export type FileUploadMetadata = {
  source: 'web' | (string & {})
  // Extendable for future metadata fields if needed
  [key: string]: unknown
}

export type FileRecord = {
  id: string
  s3_key: string
  s3_bucket: string
  s3_etag: string | null
  size_bytes: number
  extension: string
  content_type: string
  original_name: string
  metadata: FileUploadMetadata
  created_at: string
  uploaded_at: string | null
}

export type RequestFileUploadBody = {
  content_type: string
  size_bytes: number
  original_name: string
  extension: string
  metadata: FileUploadMetadata
}

export type RequestFileUploadResponse = {
  file: FileRecord
  upload_url: string
  headers: {
    'Content-Type': string
    [key: string]: string
  }
}

export type CompleteFileUploadResponse = {
  ok: boolean
  file: FileRecord
}

export type FileApiError = {
  error: string
}

