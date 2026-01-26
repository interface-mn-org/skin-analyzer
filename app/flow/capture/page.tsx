import { YoucamCameraKit } from "@/components/analysis/youcam-camera-kit";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function CaptureStepPage() {
  return (
    <section className="grid min-w-0 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Capture your scan
          </h2>
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
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg">Open camera</Button>
            </DialogTrigger>
            <DialogContent
              showCloseButton={false}
              className="h-[min(92vh,900px)] w-[min(96vw,1100px)] max-w-none overflow-hidden p-0"
            >
              <div className="flex h-full min-h-0 flex-col">
                <DialogHeader className="shrink-0 px-4 pt-4 sm:px-6 sm:pt-6">
                  <DialogTitle>Capture your scan</DialogTitle>
                </DialogHeader>
                <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 sm:px-6 sm:pb-6">
                  <YoucamCameraKit />
                </div>
                <DialogFooter className="shrink-0 px-4 pb-4 sm:px-6 sm:pb-6">
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}
