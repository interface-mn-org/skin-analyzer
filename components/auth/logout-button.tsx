'use client'

import { signIn, signOut, useSession } from 'next-auth/react'

import { Button } from '@/components/ui/button'
import { logout } from '@/lib/api/auth'

export function LogoutButton() {
  const { status } = useSession()
  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      await signOut()
    }
  }

  const handleLogin = async () => {
    await signIn('google')
  }

  return (
    <Button
      variant="default"
      onClick={status === 'authenticated' ? handleLogout : handleLogin}
      disabled={status === 'loading'}
    >
      {status === 'authenticated' ? 'Log out' : 'Log in'}
    </Button>
  )
}
