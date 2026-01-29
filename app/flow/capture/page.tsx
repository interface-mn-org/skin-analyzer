import { CameraKitDialog } from '@/components/analysis/camera-kit-dialog'

export default function CaptureStepPage() {
  return (
    <section className="grid min-w-0 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold sm:text-3xl">Capture your scan</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Use good lighting and keep the phone steady.
        </p>
      </div>
      <div className="min-w-0 rounded-3xl border border-border bg-card/40 p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Camera</h3>
          </div>
          <CameraKitDialog />
        </div>
      </div>
    </section>
  )
}
