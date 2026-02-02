import { Button } from '@/components/ui/button'
import {
  IconArrowRight,
  IconBrandZapier,
  IconCircleCheck,
  IconShield,
  IconSparkles,
} from '@tabler/icons-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-svh bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/8 via-transparent to-accent/5" />

        <div className="mx-auto max-w-4xl px-6 py-24 md:py-32">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <IconSparkles className="h-3.5 w-3.5" />
              AI-Powered Skin Analysis
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
              Discover your skin&apos;s true potential
            </h1>

            {/* Subheadline */}
            <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed text-pretty">
              Professional AI analysis that reveals your skin&apos;s unique characteristics. Get
              personalized insights and expert recommendations.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="gap-2 px-8" asChild>
                <Link href="/flow/capture">
                  Start Your Analysis
                  <IconArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Pricing hint */}
            <p className="mt-4 text-sm text-muted-foreground">
              One-time analysis: ₮5,000 ☕️ — just a CU coffee.
            </p>
          </div>

          {/* Hero Visual */}
          <div className="relative mx-auto mt-16 max-w-lg">
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-linear-to-br from-primary/10 via-secondary to-accent/20">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/15">
                  <IconSparkles className="h-10 w-10 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">Advanced AI Analysis</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Texture, pores, hydration & more
                </p>
              </div>

              {/* Floating stats */}
              <div className="absolute -right-2 top-1/4 rounded-xl bg-background/90 p-3 shadow-sm backdrop-blur-sm md:-right-6">
                <p className="text-lg font-semibold text-foreground">98%</p>
                <p className="text-[10px] text-muted-foreground">Accuracy</p>
              </div>

              <div className="absolute -left-2 bottom-1/4 rounded-xl bg-background/90 p-3 shadow-sm backdrop-blur-sm md:-left-6">
                <p className="text-lg font-semibold text-foreground">60s</p>
                <p className="text-[10px] text-muted-foreground">Results</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <h2 className="mb-12 text-center text-2xl font-semibold text-foreground">How it works</h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <IconSparkles className="h-5 w-5" />,
                title: 'Capture',
                description: 'Take a photo of your face',
              },
              {
                icon: <IconBrandZapier className="h-5 w-5" />,
                title: 'Analyze',
                description: 'AI scans texture, pores & more',
              },
              {
                icon: <IconCircleCheck className="h-5 w-5" />,
                title: 'Results',
                description: 'Get your detailed PDF report',
              },
            ].map((feature, i) => (
              <div key={feature.title} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <span className="mb-1 text-xs text-muted-foreground">0{i + 1}</span>
                <h3 className="mb-2 font-medium text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy & CTA */}
      <section className="bg-background">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <IconShield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="mb-2 text-lg font-medium text-foreground">Your privacy matters</h3>
              <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
                We never store your photos. Images are analyzed instantly and deleted immediately
                after generating your results.
              </p>
            </div>
            <Button size="lg" className="mt-4 gap-2" asChild>
              <Link href="/flow/capture">
                Get Started
                <IconArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/30">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <div className="flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
            <div className="flex items-center gap-2">
              <IconSparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">SkinAI</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Professional skin analysis powered by AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
