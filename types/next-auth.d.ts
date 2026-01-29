import type { ApiError, AuthTokens, AuthUser } from '@/types/auth'
import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    backendUser?: AuthUser
    backendTokens?: AuthTokens
    authError?: ApiError
    user?: DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    backendUser?: AuthUser
    backendTokens?: AuthTokens
    backendExpiresAt?: number
    authError?: ApiError
  }
}
