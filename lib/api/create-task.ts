'use client'

import { apiRequest } from '@/lib/api/client-fetch'
import type { CreateTaskRequestBody, CreateTaskResponse } from '@/types/files-api'

const DEFAULT_DST_ACTIONS = ['wrinkle', 'pore', 'texture', 'acne'] as const
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8081'

export type CreateTaskOptions = {
  accessToken: string
  src_file_id: string
  dst_actions?: string[]
  photo_file_id?: string
}

/**
 * Create a task with src_file_id (from start-analyze + upload) and optional dst_actions / photo_file_id.
 * Returns task_id for polling.
 */
export async function createTask(options: CreateTaskOptions): Promise<string> {
  const { accessToken } = options
  const body: CreateTaskRequestBody = {
    src_file_id: options.src_file_id,
    dst_actions: options.dst_actions ?? [...DEFAULT_DST_ACTIONS],
    ...(options.photo_file_id != null && { photo_file_id: options.photo_file_id }),
  }

  const data = await apiRequest<CreateTaskResponse>('/api/create-task', {
    accessToken,
    baseUrl: API_BASE,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!data.task_id) {
    throw new Error('Invalid create-task response: missing task_id')
  }
  return data.task_id
}
