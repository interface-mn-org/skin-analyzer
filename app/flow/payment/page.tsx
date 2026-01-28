import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function QrCode() {
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

export default function PaymentStepPage() {
  return (
    <section className="grid min-w-0 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold sm:text-3xl">Payment</h2>
          <p className="text-sm text-muted-foreground">Scan the QR and continue.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button size="lg">I have paid</Button>
          <Button
            size="lg"
            variant="outline"
            className="border-border text-foreground hover:bg-muted"
          >
            Need help?
          </Button>
        </div>
      </div>
      <Card className="min-w-0 border-border bg-card/60 text-card-foreground">
        <CardHeader>
          <CardTitle>Scan to pay</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <QrCode />
          <p className="text-xs text-muted-foreground">Amount: 9,900 MNT</p>
        </CardContent>
      </Card>
    </section>
  )
}
