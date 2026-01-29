export type SocialProvider = 'google' | 'apple' | 'facebook'

export interface SocialTokenPayload {
  provider: SocialProvider
  idToken?: string
  accessToken?: string
  expiresAt?: number
}

export interface AuthUser {
  id: string
  email: string
  name?: string
  avatarUrl?: string
  isNew: boolean
}

export interface AuthTokens {
  accessToken: string
  refreshToken?: string
  expiresIn?: number
}

export interface AuthSession {
  user: AuthUser
  tokens: AuthTokens
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}

export interface ExchangeRequest {
  provider: SocialProvider
  idToken?: string
  accessToken?: string
}

export type ExchangeResponse = { ok: true; session: AuthSession } | { ok: false; error: ApiError }

export interface RefreshRequest {
  refreshToken: string
}

export type RefreshResponse = { ok: true; tokens: AuthTokens } | { ok: false; error: ApiError }

export type MeResponse = { ok: true; user: AuthUser } | { ok: false; error: ApiError }

export type LogoutResponse = { ok: true } | { ok: false; error: ApiError }
