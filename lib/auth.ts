import NextAuth from 'next-auth'
import Facebook from 'next-auth/providers/facebook'
import Google from 'next-auth/providers/google'

import { exchangeSocialToken, refreshSession } from '@/lib/api/auth'
import type { ApiError, AuthSession, AuthTokens, AuthUser, SocialProvider } from '@/types/auth'

const TOKEN_REFRESH_BUFFER = 30

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      async profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.image,
        }
      },
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope: 'openid email profile',
        },
      },
    }),
    Facebook({
      authorization: {
        params: {
          scope: 'email public_profile',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ account }) {
      if (!account) {
        return true
      }

      const provider = account.provider as SocialProvider
      const idToken = account.id_token ?? undefined
      const accessToken = account.access_token ?? undefined

      const exchange = await exchangeSocialToken({
        provider,
        idToken,
        accessToken,
      })

      const mutableAccount = account as {
        backendSession?: AuthSession
        backendAuthError?: ApiError
      }

      if (exchange.ok) {
        mutableAccount.backendSession = exchange.session
        mutableAccount.backendAuthError = undefined
      } else {
        mutableAccount.backendSession = undefined
        mutableAccount.backendAuthError = exchange.error
      }

      return true
    },
    async jwt({ token, account }) {
      if (account) {
        const backendSession = (account as { backendSession?: AuthSession }).backendSession
        const backendAuthError = (account as { backendAuthError?: ApiError }).backendAuthError

        if (backendSession) {
          token.backendUser = backendSession.user
          token.backendTokens = backendSession.tokens
          token.backendExpiresAt =
            typeof backendSession.tokens.expiresIn === 'number'
              ? Math.floor(Date.now() / 1000) + backendSession.tokens.expiresIn
              : undefined
          token.authError = undefined
        } else if (backendAuthError) {
          token.backendUser = undefined
          token.backendTokens = undefined
          token.backendExpiresAt = undefined
          token.authError = backendAuthError
        }
      }

      const expiresAt = token.backendExpiresAt
      const backendTokens = token.backendTokens as AuthTokens | undefined
      const refreshToken = backendTokens?.refreshToken
      const now = Math.floor(Date.now() / 1000)

      if (
        typeof expiresAt === 'number' &&
        refreshToken &&
        expiresAt - TOKEN_REFRESH_BUFFER <= now
      ) {
        const refreshed = await refreshSession({ refreshToken })
        if (refreshed.ok) {
          token.backendTokens = refreshed.tokens
          token.backendExpiresAt =
            typeof refreshed.tokens.expiresIn === 'number'
              ? now + refreshed.tokens.expiresIn
              : undefined
          token.authError = undefined
        } else {
          token.authError = refreshed.error
        }
      }

      return token
    },
    async session({ session, token }) {
      session.backendUser = token.backendUser as AuthUser | undefined
      session.backendTokens = token.backendTokens as AuthTokens | undefined
      session.authError = token.authError as ApiError | undefined
      return session
    },
  },
})
