"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { YoucamCameraViewport } from "@/components/analysis/youcam/camera-viewport";
import { YoucamCaptureResults } from "@/components/analysis/youcam/capture-results";
import { YOUCAM_SDK_SRC } from "@/components/analysis/youcam/types";
import { useYoucamCameraKit } from "@/components/analysis/youcam/use-youcam-camera-kit";

export function YoucamCameraKit() {
  const router = useRouter();
  const {
    sdkLoaded,
    isSdkReady,
    status,
    error,
    capturedImages,
    isOpen,
    viewportRef,
    moduleRef,
    handleOpen,
    handleClose,
    onScriptLoad,
    onScriptError,
  } = useYoucamCameraKit();

  return (
    <div className="grid min-w-0 gap-4">
      <Script
        src={YOUCAM_SDK_SRC}
        strategy="afterInteractive"
        onLoad={onScriptLoad}
        onError={onScriptError}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={handleOpen} disabled={!sdkLoaded || !isSdkReady} size="lg">
            Open
          </Button>
          <Button onClick={handleClose} disabled={!isOpen} size="lg" variant="outline">
            Close
          </Button>
        </div>
        <span className="text-xs text-muted-foreground">{status}</span>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <YoucamCameraViewport isOpen={isOpen} viewportRef={viewportRef} moduleRef={moduleRef} />
      <YoucamCaptureResults images={capturedImages} />
      <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
        <Button
          type="button"
          size="lg"
          disabled={capturedImages.length === 0}
          onClick={() => router.push("/flow/auth")}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
