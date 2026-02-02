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

// --- start-analyze (metadata-only then PUT to signed URL) ---

export type StartAnalyzeFileMetadata = {
  content_type: string
  file_name: string
  file_size: number
}

export type StartAnalyzeRequestBody = {
  files: StartAnalyzeFileMetadata[]
}

export type StartAnalyzeUploadRequest = {
  method: 'PUT'
  url: string
  headers: {
    'Content-Type': string
    'Content-Length': string
    [key: string]: string
  }
}

export type StartAnalyzeResponse = {
  upload_request: StartAnalyzeUploadRequest
  file_id: string
}

export type StartAnalyzeApiError = {
  error: string
}

// --- create-task ---

export type CreateTaskRequestBody = {
  src_file_id: string
  dst_actions: string[]
  photo_file_id?: string
}

export type CreateTaskResponse = {
  task_id: string
}

export type CreateTaskApiError = {
  error: string
}

// --- poll-status ---

export type TaskStatus = 'pending' | 'processing' | 'success' | 'failed'

/** One item from results.output (e.g. texture, pore, acne, wrinkle, all, skin_age, resize_image) */
export type OutputItem = {
  type: string
  url?: string | null
  mask_urls?: string[]
  ui_score?: number
  raw_score?: number
  score?: number
}

export type PollStatusData = {
  task_status: TaskStatus
  results?: {
    output?: OutputItem[]
  }
  error_code?: string
  result_id?: string
}

export type PollStatusResponse = {
  data: PollStatusData
}
