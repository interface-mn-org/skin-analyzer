'use client'

import type {
  CreateTaskApiError,
  CreateTaskRequestBody,
  CreateTaskResponse,
} from '@/types/files-api'

const DEFAULT_DST_ACTIONS = ['wrinkle', 'pore', 'texture', 'acne'] as const

export type CreateTaskOptions = {
  src_file_id: string
  dst_actions?: string[]
  photo_file_id?: string
}

/**
 * Create a task with src_file_id (from start-analyze + upload) and optional dst_actions / photo_file_id.
 * Returns task_id for polling.
 */
export async function createTask(options: CreateTaskOptions): Promise<string> {
  const body: CreateTaskRequestBody = {
    src_file_id: options.src_file_id,
    dst_actions: options.dst_actions ?? [...DEFAULT_DST_ACTIONS],
    ...(options.photo_file_id != null && { photo_file_id: options.photo_file_id }),
  }

  const res = await fetch('/api/create-task', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as CreateTaskApiError
    throw new Error(data.error || res.statusText || 'Create task failed')
  }

  const data = (await res.json()) as CreateTaskResponse
  if (!data.task_id) {
    throw new Error('Invalid create-task response: missing task_id')
  }
  return data.task_id
}
