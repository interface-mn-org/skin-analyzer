import { cn } from '@/lib/utils'

import { ModeToggle } from '@/components/mode-toggle'

export default function Header({ title, step }: { title: string; step: number }) {
  const steps = [
    { title: 'Capture Image', step: 1 },
    { title: 'Analyze Image', step: 2 },
    { title: 'Get Results', step: 3 },
    { title: 'Share Results', step: 4 },
  ]

  return (
    <header className="sticky top-0 z-10 bg-background/70 backdrop-blur-xl px-4 py-4 md:px-8 border-b space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-foreground">
          Skin Analyzer
        </p>
        <ModeToggle />
      </div>
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">{title}</span>
            <span className="text-muted-foreground">Step {step} of 4</span>
          </div>
          <div className="flex gap-2">
            {steps.map((stepItem, index) => (
              <div
                key={stepItem.step}
                className={cn(
                  'h-1.5 flex-1 rounded-full',
                  index < step ? 'bg-primary' : 'bg-muted',
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
