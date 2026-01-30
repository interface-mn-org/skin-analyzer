import type {
    ExchangeRequest,
    ExchangeResponse,
    LogoutResponse,
    MeResponse,
    RefreshRequest,
    RefreshResponse,
} from '@/types/auth'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8081'

const jsonHeaders = {
  'Content-Type': 'application/json',
}

type RawExchangeResponse = {
  token?: string
  access_token?: string
  accessToken?: string
  refresh_token?: string
  refreshToken?: string
  expires_in?: number
  expiresIn?: number
  user?: {
    id?: number | string
    email?: string
    name?: string | null
    avatar_url?: string | null
    avatarUrl?: string | null
    is_new?: boolean
    isNew?: boolean
  }
  ok?: boolean
  session?: ExchangeResponse extends { ok: true; session: infer S } ? S : never
}

function getJwtExpiresIn(token?: string) {
  if (!token) return undefined
  try {
    const [, payload] = token.split('.')
    if (!payload) return undefined
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      exp?: number
    }
    if (typeof decoded.exp !== 'number') return undefined
    const now = Math.floor(Date.now() / 1000)
    return Math.max(decoded.exp - now, 0)
  } catch {
    return undefined
  }
}

function normalizeExchangeResponse(body: RawExchangeResponse): ExchangeResponse {
  if (body.ok === true && body.session) {
    return { ok: true, session: body.session }
  }

  const accessToken = body.token ?? body.access_token ?? body.accessToken
  if (!accessToken || !body.user?.email || !body.user?.id) {
    return {
      ok: false,
      error: { code: 'EXCHANGE_FAILED', message: 'Invalid exchange response' },
    }
  }

  const refreshToken = body.refresh_token ?? body.refreshToken
  const expiresIn = body.expires_in ?? body.expiresIn ?? getJwtExpiresIn(accessToken)

  return {
    ok: true,
    session: {
      user: {
        id: String(body.user.id),
        email: body.user.email,
        name: body.user.name ?? undefined,
        avatarUrl: body.user.avatar_url ?? body.user.avatarUrl ?? undefined,
        isNew: body.user.is_new ?? body.user.isNew ?? false,
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn,
      },
    },
  }
}

export async function exchangeSocialToken(req: ExchangeRequest): Promise<ExchangeResponse> {
  const res = await fetch(`${API_BASE}/auth/exchange`, {
    method: 'POST',
    headers: jsonHeaders,
    credentials: 'include',
    body: JSON.stringify(req),
  })

  if (!res.ok) {
    return {
      ok: false,
      error: { code: 'EXCHANGE_FAILED', message: await res.text() },
    }
  }

  const body = (await res.json()) as RawExchangeResponse
  return normalizeExchangeResponse(body)
}

export async function refreshSession(req: RefreshRequest): Promise<RefreshResponse> {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: jsonHeaders,
    credentials: 'include',
    body: JSON.stringify(req),
  })

  if (!res.ok) {
    return {
      ok: false,
      error: { code: 'REFRESH_FAILED', message: await res.text() },
    }
  }

  return res.json()
}

export async function getMe(): Promise<MeResponse> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!res.ok) {
    return {
      ok: false,
      error: { code: 'ME_FAILED', message: await res.text() },
    }
  }

  return res.json()
}

export async function logout(): Promise<LogoutResponse> {
  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  })

  if (!res.ok) {
    return {
      ok: false,
      error: { code: 'LOGOUT_FAILED', message: await res.text() },
    }
  }

  return { ok: true }
}
