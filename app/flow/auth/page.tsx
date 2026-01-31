import { CapturedImagePreview } from '@/components/analysis/captured-image-preview'
import { ContinueToAnalyticsButton } from '@/components/analysis/continue-to-analytics'
import { SocialAuthButtons } from '@/components/auth/social-auth-buttons'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'
import { IconArrowLeft } from '@tabler/icons-react'
import { redirect } from 'next/navigation'

export default async function AuthStepPage() {
  const session = await auth()

  if (session?.user) {
    redirect('/flow/payment')
  }

  return (
    <div className="flex flex-col min-h-svh">
      {/* Header */}
      <Header title="Authenticate" step={2} />

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 md:px-8 md:py-10 pb-36 md:pb-10">
        <div className="max-w-md mx-auto space-y-8">
          {/* Title Section */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground text-balance">
              Continue to see your results
            </h1>
            <p className="text-muted-foreground text-balance">
              Sign in with your social account to view your personalized skin analysis
            </p>
          </div>
          <CapturedImagePreview />
          <div className="space-y-4">
            <SocialAuthButtons redirectTo="/flow/auth" />
            <p className="text-xs text-center text-muted-foreground text-pretty">
              By continuing, you agree to our{' '}
              <a href="#" className="underline hover:text-foreground transition-colors">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="underline hover:text-foreground transition-colors">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Mobile Fixed Bottom Bar - Back Button */}
      <div className="md:hidden fixed bottom-0 inset-x-0 p-4 bg-background/80 backdrop-blur-md border-t">
        <div className="max-w-2xl mx-auto">
          <Button variant="outline" size="lg" className="w-full bg-transparent">
            <IconArrowLeft className="size-4" />
            Back to Capture
          </Button>
        </div>
      </div>

      {/* Desktop Back Button */}
      <div className="hidden md:flex fixed bottom-8 left-8 right-8 gap-2 justify-between">
        <Button variant="ghost" size="sm">
          <IconArrowLeft className="size-4" />
          Back
        </Button>

        <ContinueToAnalyticsButton />
      </div>
    </div>
  )
}
