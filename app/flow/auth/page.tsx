import { redirect } from 'next/navigation'

import { SocialAuthButtons } from '@/components/auth/social-auth-buttons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { auth } from '@/lib/auth'

export default async function AuthStepPage() {
  const session = await auth()
  if (session?.user) {
    redirect('/flow/payment')
  }

  return (
    <section className="grid min-w-0 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold sm:text-3xl">Sign in</h2>
          <p className="text-sm text-muted-foreground">Continue to unlock results.</p>
        </div>
      </div>
      <Card className="min-w-0 border-border bg-card/60 text-card-foreground">
        <CardHeader>
          <CardTitle>Continue</CardTitle>
          <CardDescription className="text-muted-foreground">Use social or email.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <SocialAuthButtons redirectTo="/flow/payment" />
          <div className="flex items-center gap-3">
            <Separator className="flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or email</span>
            <Separator className="flex-1 bg-border" />
          </div>
          <div className="space-y-3">
            <Input placeholder="Email address" type="email" />
            <Input placeholder="Create password" type="password" />
            <Button className="w-full" size="lg">
              Create account
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
