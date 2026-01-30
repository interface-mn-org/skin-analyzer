import { CapturedImagePreview } from '@/components/analysis/captured-image-preview'
import Header from '@/components/header'
import { CheckPurchaseButton } from '@/components/payment/check-purchase-button'
import { Button } from '@/components/ui/button'
import { createCreditPurchase } from '@/lib/api/credits'
import type { CreatePurchaseResponse } from '@/types/credits-api'
import { IconArrowLeft } from '@tabler/icons-react'
import Image from 'next/image'

function FallbackQrCode() {
  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label="Payment QR code"
      className="h-48 w-48 rounded-2xl bg-background p-4"
    >
      <rect width="200" height="200" fill="#ffffff" />
      <rect x="16" y="16" width="48" height="48" fill="#0f172a" />
      <rect x="24" y="24" width="32" height="32" fill="#ffffff" />
      <rect x="32" y="32" width="16" height="16" fill="#0f172a" />
      <rect x="136" y="16" width="48" height="48" fill="#0f172a" />
      <rect x="144" y="24" width="32" height="32" fill="#ffffff" />
      <rect x="152" y="32" width="16" height="16" fill="#0f172a" />
      <rect x="16" y="136" width="48" height="48" fill="#0f172a" />
      <rect x="24" y="144" width="32" height="32" fill="#ffffff" />
      <rect x="32" y="152" width="16" height="16" fill="#0f172a" />
      <rect x="88" y="88" width="16" height="16" fill="#0f172a" />
      <rect x="112" y="88" width="16" height="32" fill="#0f172a" />
      <rect x="88" y="112" width="32" height="16" fill="#0f172a" />
      <rect x="72" y="72" width="8" height="40" fill="#0f172a" />
      <rect x="120" y="120" width="8" height="40" fill="#0f172a" />
      <rect x="72" y="136" width="40" height="8" fill="#0f172a" />
      <rect x="136" y="72" width="24" height="8" fill="#0f172a" />
      <rect x="88" y="56" width="8" height="16" fill="#0f172a" />
      <rect x="104" y="56" width="8" height="16" fill="#0f172a" />
    </svg>
  )
}

function QPayAppsRow({ urls }: { urls: CreatePurchaseResponse['qpay']['urls'] }) {
  if (!urls?.length) return null

  return (
    <div className="w-full grid-cols-3 gap-3 sm:hidden grid">
      {urls.map((app) => (
        <a
          key={app.link}
          href={app.link}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <div className="flex h-10 w-10 items-center justify-center sm:h-12 sm:w-12">
            <Image
              src={app.logo}
              alt={app.name}
              width={40}
              height={40}
              className="object-center rounded-md object-contain"
            />
          </div>
          <span className="line-clamp-1 text-center">{app.name}</span>
        </a>
      ))}
    </div>
  )
}

export default async function PaymentStepPage() {
  let purchase: CreatePurchaseResponse | null = null
  let error: string | null = null

  try {
    purchase = await createCreditPurchase({ credits: 10 })
  } catch (e) {
    error = 'Failed to create payment. Please try again.'
    console.error('Failed to create credit purchase', e)
  }
  return (
    <div className="flex flex-col min-h-svh">
      <Header title="Payment" step={3} />
      <main className="flex-1 px-4 py-6 md:px-8 md:py-10 pb-36 md:pb-10">
        <div className="max-w-md mx-auto space-y-8">
          {/* Title Section */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground text-balance">
              Continue to see your results
            </h1>
            <p className="text-sm text-muted-foreground">
              Purchase <span className="font-medium text-foreground">10 credits</span> and continue
              your analysis.
            </p>
          </div>
          <CapturedImagePreview />
          {/* Auth Options */}
          <div className="space-y-4">
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : purchase ? (
              <>
                <QPayAppsRow urls={purchase.qpay.urls} />
                {purchase.qpay.qr_image ? (
                  <div className="flex flex-col items-center gap-3 rounded-2xl bg-muted/60 p-4">
                    <div className="relative size-72">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`data:image/png;base64,${purchase.qpay.qr_image}`}
                        alt="QPay payment QR"
                        className="rounded-2xl bg-background object-contain p-2 shadow-sm size-full"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground text-center">
                      Та QR кодыг өөрийн интернэт банк эсвэл төлбөрийн аппликейшн ашиглан уншуулж
                      төлбөрөө төлөөрэй.
                    </p>
                  </div>
                ) : (
                  <FallbackQrCode />
                )}
                <div className="flex w-full flex-col items-center gap-2">
                  <Button asChild size="sm" className="w-full sm:w-auto" variant="outline">
                    <a href={purchase.payment_url} target="_blank" rel="noreferrer">
                      Open in QPay
                    </a>
                  </Button>
                </div>
              </>
            ) : (
              <FallbackQrCode />
            )}
          </div>
        </div>
      </main>

      <div className="md:hidden fixed bottom-0 inset-x-0 p-4 bg-background/80 backdrop-blur-md border-t">
        <div className="max-w-2xl mx-auto flex gap-2">
          <Button variant="outline" size="lg" className="flex-1 bg-transparent mb-2">
            <IconArrowLeft className="size-4" />
            Back to Capture
          </Button>
          <CheckPurchaseButton
            purchaseId={purchase?.purchase_id}
            disabled={!purchase || !!error}
            className="flex-1"
          />
        </div>
      </div>

      {/* Desktop Back Button */}
      <div className="hidden md:flex fixed bottom-8 left-8 right-8 gap-2 justify-between">
        <Button variant="ghost" size="sm">
          <IconArrowLeft className="size-4" />
          Back
        </Button>
        <CheckPurchaseButton purchaseId={purchase?.purchase_id} disabled={!purchase || !!error} />
      </div>
    </div>
  )
}
